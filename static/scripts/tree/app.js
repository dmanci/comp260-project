define('tree/app', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'data/app',
	'map/spatial_object/bounding_box',
	'tree/record',
	'tree/entry',
	'tree/node',
	'tree/node/leaf'
], function(
	$,
	_,
	Backbone,
	D3,
	DataApp,
	BoundingBoxApp,
	RecordApp,
	EntryApp,
	NodeApp,
	LeafApp,
undefined) {
 var TreeApp = Backbone.Model.extend({
	defaults: {
		root: new LeafApp(),
		M: 4,
		m: 2
	},

	constructTree: function(records) {
		var app = this;

		var simpleRecords = DataApp.simpleRecordList();
		var entries = app.recordsToEntries(simpleRecords);
		_.each(entries, function(entry) {
			app.insertEntry(entry);
		}, app);

		return app.get('root');
	},

	// records - list of [key, value] pairs
	recordsToEntries: function(simpleRecords) {
		var app = this;

		var entries = [];
		_.each(simpleRecords, function(record) {
			entries.push(new EntryApp({
				boundingBox: new BoundingBoxApp({ pointSet: record.spatialObject.get('pointSet') }),
				recordId: record.index
			}));
		}, app);

		return entries;
	},

	insertEntry: function(entry) {
		var app = this;
		
		// Find the insertion point.
		var insertionLeaf = app._chooseLeaf(entry, app.get('root'));

		// If leaf has room, insert. Otherwise, split the node.
		var insertionLeaves;
		if (app._nodeHasRoom(insertionLeaf)) {
			app._installEntry(entry, insertionLeaf);
			insertionLeaves = [ insertionLeaf ];
		}
		else {
			insertionLeaves = app._splitNode({
				node: insertionLeaf,
				newEntry: entry
			});
		}

		// Adjust the tree starting at the leaf/leaves.
		var adjustedRoots = app._adjustTree(insertionLeaves);

		// Make the tree taller if adjustTree caused root to split.
		var root = adjustedRoots.root;
		if (adjustedRoots.splitRoot) {
			root = app._growTaller(adjustedRoots.root, adjustedRoots.splitRoot);
		}

		return app.get('root');
	},

	_growTaller: function(root1, root2) {
		var app = this;

		// Create new entries for the root and split root.
		var rootEntry1 = new EntryApp({
			childNode: root1,
			boundingBox: app._expandBoxOverEntries(root1.entries())
		});

		var rootEntry2 = new EntryApp({
			childNode: root2,
			boundingBox: app._expandBoxOverEntries(root2.entries())
		});

		// Create a new node to contain the entries for both old roots.
		var newRoot = new NodeApp({
			entries: [ rootEntry1, rootEntry2 ]
		});

		// Let the root and split root know about their new parent.
		root1.parentEntry(rootEntry1);
		root1.parentNode(newRoot);
		root2.parentEntry(rootEntry2);
		root2.parentNode(newRoot);

		app.set('root', newRoot);

		return app.get('root', newRoot);
	},

	_splitNode: function(args) {
		var app = this;

		var node = args.node;
		var useQuadratic = args.useQuadratic;
		var newEntry = args.newEntry;

		// Allow for the optional use of the quadratic algorithm.
		var pickSeeds;
		var pickNext;
		if (useQuadratic) {
			pickSeeds = app._quadraticPickSeeds;
			pickNext = app._quadraticPickNext;
		}
		else {
			pickSeeds = app._linearPickSeeds;
			pickNext = app._linearPickNext;
		}

		// Create a copy so we don't add the new entry to the old node.
		var entries = node.entries().slice(0);
		entries.push(newEntry);

		// Pick seed entries for the two new nodes.
		// A split node can be a leaf or internal. This simply allows for constructing
		// the appropriate node type, which gives us node-type predicate methods.
		var seeds = pickSeeds.call(app, entries);
		var nodeApp = node.isLeaf() ? LeafApp : NodeApp;
		var node1 = new nodeApp({
			entries: [seeds[0]],
			parentEntry: node.parentEntry(),
			parentNode: node.parentNode()
		});
		var node2 = new nodeApp({
			entries: [seeds[1]]
			// We don't know where node2 will go until we adjust the tree...
		});

		// Partition the rest of the entries into the groups.
		var remainingEntries = _.reject(entries, function(entry) {
			return entry === seeds[0] || entry === seeds[1];
		});
		pickNext.call(app, {
			node1: node1,
			node2: node2,
			remainingEntries: remainingEntries 
		});

		return [ node1, node2 ];
	},

	_linearPickNext: function(args) {
		var app = this;

		var node1 = args.node1;
		var node2 = args.node2;
		var remainingEntries = args.remainingEntries;

		for (var i = 0; i < remainingEntries.length; i++) {
			i % 2 ? node2.addEntry(remainingEntries[i]) : node1.addEntry(remainingEntries[i]);
		}

		return;
	},

	_linearPickSeeds: function(entries) {
		var app = this;

		// Find the greatest separation on the Y-axis.
		var highestBottomEntry = _.max(entries, function(entry) {
			return entry.boundingBox().bottommost().y;
		});

		var lowestTopEntry = _.min(entries, function(entry) {
			return entry.boundingBox().topmost().y;
		});

		var highY = highestBottomEntry.boundingBox().bottommost().y;
		var lowY = lowestTopEntry.boundingBox().topmost().y;
		var ySeparation = highY = lowY;

		// Find the greatest separation on the X-axis.
		var maxLeftEntry = _.max(entries, function(entry) {
			return entry.boundingBox().leftmost().x;
		});

		var minRightEntry = _.min(entries, function(entry) {
			return entry.boundingBox().rightmost().x;
		});

		var rightX = maxLeftEntry.boundingBox().leftmost().x;
		var leftX = minRightEntry.boundingBox().rightmost().x;
		var xSeparation = rightX - leftX;

		// Normalize the separations and pick the most extreme one.
		var yNormalized = ySeparation / app._findHeight(entries);
		var xNormalized = xSeparation / app._findWidth(entries);

		var seeds 	= yNormalized > xNormalized
					? [ highestBottomEntry, lowestTopEntry ]
					: [ maxLeftEntry, minRightEntry ];

		return seeds;
	},

	_findHeight: function(entries) {
		var app = this;

		var topmostEntry = _.max(entries, function(entry) {
			return entry.boundingBox().topmost().y;
		});

		var bottommostEntry = _.min(entries, function(entry) {
			return entry.boundingBox().bottommost().y;
		});

		var highY = topmostEntry.boundingBox().topmost().y;
		var lowY = bottommostEntry.boundingBox().bottommost().y;
		return highY - lowY;
	},

	_findWidth: function(entries) {
		var app = this;

		var rightmostEntry = _.max(entries, function(entry) {
			return entry.boundingBox().rightmost().x;
		});

		var leftmostEntry = _.min(entries, function(entry) {
			return entry.boundingBox().leftmost().x;
		});

		var rightX = rightmostEntry.boundingBox().rightmost().x;
		var leftX = leftmostEntry.boundingBox().leftmost().x;
		return rightX - leftX;
	},

	_installEntry: function(entry, leaf) {
		var app = this;

		leaf.addEntry(entry);
	},

	_nodeHasRoom: function(node) {
		var app = this;

		return node.numberOfEntries() < app.get('M');
	},

	// TODO: Make iterative and optimize.
	_chooseLeaf: function(entry, node) {
		var app = this;
		
		if (node.isLeaf()) {
			return node;
		}
		else {
			var minimumAreaChange;
			var originalArea;
			var chosenNode;

			// Choose a bounding box from one of the children to descend into.
			_.each(node.entries(), function(childEntry) {
				// Make a copy so we don't actually add the new entry - this is a hypothetical
				// check.
				var newEntries = node.entries().slice(0);
				newEntries.push(entry);

				var boundingBox = childEntry.boundingBox();
				var boundingBoxArea = boundingBox.getArea();
				
				var expandedBox = app._expandBoxOverEntries(newEntries);
				var expandedBoxArea = expandedBox.getArea();
				var areaChange = expandedBoxArea - boundingBoxArea;

				// Choose the box that needs to expand the least.
				if (_.isUndefined(minimumAreaChange) || areaChange < minimumAreaChange) {
					minimumAreaChange = areaChange;
					originalArea = boundingBoxArea;
					chosenNode = childEntry.get('childNode');
				}
				// If there's a tie, take the box with the lower original area.
				else if (minimumAreaChange === areaChange) {
					if (boundingBoxArea < originalArea) {
						minimumAreaChange = areaChange;
						originalArea = boundingBoxArea;
						chosenNode = childEntry.get('childNode');
					}
				}
			}, app);
		}
		
		// Try to insert into the next node down the tree.
		return app._chooseLeaf(entry, chosenNode);
	},

	_entriesToPoints: function(entries) {
		var app = this;

		var entryPointSets = _.map(entries, function(entry) {
			return entry.boundingBox().get('pointSet');
		});

		return _.flatten(entryPointSets);
	},

	// TODO: make this more efficient - make this actually expand rather than creating a new box.
	_expandBoxOverEntries: function(entries) {
		var app = this;

		var entryPoints = app._entriesToPoints(entries);
		return new BoundingBoxApp({ pointSet: entryPoints });
	},

	_adjustTree: function(newNodes) {
		var app = this;

		var node1 = newNodes[0];
		var node2 = newNodes[1];

		var nextNodes;
		if (node1.isRoot()) {
			return {
				root: node1,
				splitRoot: node2
			};
		}
		else {
			// Adjust the parent entry's box so it tightly encloses all entries
			// in node1. Then replace the old node with the new node.
			// TODO: Check for memory leaks here with the detached nodes.
			var expandedParentBox = app._expandBoxOverEntries(node1.entries());
			var parentEntry1 = node1.parentEntry();
			parentEntry1.set('boundingBox', expandedParentBox);
			parentEntry1.set('childNode', node1);

			var parentNode1 = node1.parentNode();
			nextNodes = [ parentNode1 ];

			// Propagate a node split upward.
			if (node2) {
				// Create a new parent entry that points to the new node and has
				// a bounding box containing all entries in the new node.
				var splitEntry = new EntryApp({
					childNode: node2,
					boundingBox: app._expandBoxOverEntries(node2.entries())
				});
				node2.parentEntry(splitEntry);

				// If node1's parent has room, add node2's parent entry to that.
				// Otherwise, split node1's parent and add it to that.
				if (app._nodeHasRoom(parentNode1)) {
					parentNode1.addEntry(splitEntry);
					node2.parentNode(parentNode1);
				}
				else {
					nextNodes = app._splitNode({
						node: parentNode1,
						newEntry: splitEntry
					});
				}
			}
		}

		return app._adjustTree(nextNodes);
	},

	/*****************************************************************************
	*	SEARCH
	*****************************************************************************/
	search: function(searchBox, node) {
		var app = this;
		var result;

		var searchNode = node || app.get('root');
		var entries = searchNode.entries();
		var qualifyingEntries = [];

		// TODO: optimize
		_.each(entries, function(entry) {
			if (app.doPointSetsOverlap(entry.boundingBox(), searchBox)) {
				qualifyingEntries.push(
					searchNode.isLeaf()
					? entry
					: app.search(searchBox, entry.get('childNode')));
			}
		}, app);

		return _.flatten(qualifyingEntries);
	},

	doPointSetsOverlap: function(box1, box2) {
		var app = this;

		return box1.contains(box2) || box2.contains(box1);
	}

 });

 return new TreeApp();
});
