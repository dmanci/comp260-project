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
		});

		return app.get('root');
	},

	// records - list of [key, value] pairs
	recordsToEntries: function(simpleRecords) {
		var app = this;

		var entries = [];
		_.each(simpleRecords, function(record) {
			entries.push(new EntryApp({
				boundingBox: new BoundingBoxApp(record.spatialObject.get('pointSet')),
				recordId: record.index
			}));
		});

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
			insertionLeaves = app._splitNode(insertionLeaf);
		}

		// Adjust the tree starting at the leaf/leaves.
		var adjustedRoots = app._adjustTree(insertionLeaves);

		// Make the tree taller if adjustTree caused root to split.
		var root = adjustedRoots.root;
		if (adjustedRoots.splitRoot) {
			root = app._growTaller(adjustedRoots.root, adjustedRoots.splitRoot);
		}

		return app.get('root');;
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

	_splitNode: function(node, useQuadratic) {
		var app = this;

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

		var entries = node.entries();

		// Pick seed entries for the two new nodes.
		// A split node can be a leaf or internal. This simply allows for constructing
		// the appropriate node type, which gives us node-type predicate methods.
		var seeds = pickSeeds(entries);
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
		var rest = _.reject(entries, function(entry) {
			return entry === seeds[0] || entry === seeds[1];
		});
		pickNext({
			node1: node1,
			node2: node2,
			remainingEntries: rest
		});

		return [ node1, node2 ];
	},

	_linearPickNext: function(args) {
		var app = this;

		var node1 = args.node1;
		var node2 = args.node2;
		var rest = args.rest;

		for (i = 0; i < rest.length; i++) {
			remaining % 2 ? node1.addEntry(rest[i]) : node2.addEntry(rest[i]);
		}

		return;
	},

	_linearPickSeeds: function(entries) {
		var app = this;

		// Find the greatest separation on the Y-axis.
		var highestBottomPoint = _.max(entries, function(entry) {
			return entry.boundingBox().bottommost();
		});

		var lowestTopPoint = _.min(entries, function(entry) {
			return entry.boundingBox().topmost();
		});

		ySeparation = highestBottomPoint.y - lowestTopPoint.y;

		// Find the greatest separation on the X-axis.
		var maxLeftPoint = _.max(entries, function(entry) {
			return entry.boundingBox().leftmost();
		});

		var minRightPoint = _.min(entries, function(entry) {
			return entry.boundingBox().rightmost();
		});

		xSeparation = maxLeftPoint.x - minRightPoint.x;

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

		var topmostPoint = _.max(entries, function(entry) {
			return entry.boundingBox().topmost();
		});

		var bottommostPoint = _.min(entries, function(entry) {
			return entry.boundingBox().bottommost();
		});

		return 	topmostEntry.boundingBox().topmost()
				- bottommostEntry.boundingBox().bottommost();
	},

	_findWidth: function(entries) {
		var app = this;

		var rightmostEntry = _.max(entries, function(entry) {
			return entry.boundingBox().rightmost();
		});

		var leftmostEntry = _.min(entries, function(entry) {
			return entry.boundingBox().leftmost();
		});

		return 	rightmostEntry.boundingBox().rightmost()
				- leftmostEntry.boundingBox().leftmost();
	},

	_installEntry: function(entry, leaf) {
		var app = this;

		leaf.addEntry(entry);
	},

	_nodeHasRoom: function(node) {
		var app = this;

		return node.numberOfEntries() < app.get('M');
	},

	// TODO: Make iterative.
	_chooseLeaf: function(entry, node) {
		var app = this;
		
		if (node.isLeaf()) {
			return node;
		}
		else {
			var mininumAreaChange;
			var originalArea;
			var chosenNode;

			// Choose a bounding box from one of the children to descend into.
			_.each(node.entries(), function(childEntry) {
				var boundingBox = childEntry.boundingBox();
				var boundingBoxArea = boundingBox.getArea();
				
				var expandedBox = app._expandBoxOverEntries(boundingBox, [childEntry]);
				var expandedBoxArea = expandedBox.getArea();
				var areaChange = expandedBoxArea - boundingBoxArea;

				// Choose the box that needs to expand the least.
				if (areaChange < minimumAreaChange || _.isUndefined(minimumAreaChange)) {
					minimumAreaChange = areaChange;
					originalArea = boundingBoxArea;
					chosenNode = childEntry.childNode();
				}

				// If there's a tie, take the box with the lower original area.
				else if (minimumAreaChange === areaChange) {
					if (boundingBoxArea < originalArea) {
						minimumAreaChange = areaChange;
						originalArea = boundingBoxArea;
						chosenNode = childEntry.childNode();
					}
				}
			});
		}
		
		// Try to insert into the next node down the tree.
		return _chooseLeaf(entry, chosenNode);
	},

	_entriesToPoints: function(entries) {
		var app = this;

		var entryPoints = [];
		return _.each(entries, function(entry) {
			_.union(entry.boundingBox().points(), entryPoints);
		});
	},

	_expandBoxOverEntries: function(entries) {
		var app = this;

		var entryPoints = app._entriesToPoints(entries);
		return new BoundingBoxApp(entryPoints);
	},

	_adjustTree: function(newNodes) {
		var app = this;

		var node1 = newNodes[0];
		var node2 = newNodes[1];

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
			parentEntry1.set('boundingBox', boundingBox(expandedParentBox));
			parentEntry1.set('childNode', node1);

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
				var parentNode1 = node1.parentNode();
				var newArgs;
				if (app._nodeHasRoom(parentNode1)) {
					parentNode1.addEntry(splitEntry);
					node2.parentNode(parentNode1);
					nextNodes = [ parentNode ];
				}
				else {
					nextNodes = app._splitNode(parentNode);
				}
			}
		}

		return app._adjustTree.apply(app, nextNodes);
	}

 });

 return new TreeApp();
});
