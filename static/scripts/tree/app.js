define('tree/app', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'data/app',
	'tree/box/bounding_box',
	'tree/record'
], function(
	$,
	_,
	Backbone,
	D3,
	DataApp,
	BoundingBoxApp,
	RecordApp,
undefined) {
 var TreeApp = Backbone.Model.extend({
	 initialize: function(M, m) {
		var app = this;

		app.highestIndex = 0;
		app.records = app.createRecords(DataApp.getTestData());
		app.M = M;
		app.m = m;
	 },

	 createRecords: function(data) {
		var app = this;

		// For each polygon definition, create a "database record"
		// of a retrieval index and the data point.
		var database;

		_.each(data, function(dataElement) {
			record = new RecordApp(app.highestIndex++, dataElement);
			_.extend(database, record);
			addRecord(record);
		});

		return database;
	 },

	 addRecord: function(record) {
		var app = this;

		_.extend(app.records, record);
	 },

	 retrieveRecords: function(indexes) {
		var app = this;

		// Get the records from the datastore.
		return _.pick(app.records, indexes);
	 },

	 insertEntry: function(entry) {
		var app = this;
		
		// Find the insertion point.
		var insertionLeaf = app._chooseLeaf(entry, app.tree);

		// If leaf has room, insert. Otherwise, split the node.
		if (app._nodeHasRoom(insertionLeaf)) {
			app._installEntry(entry, insertionLeaf);
		}
		else {
			var newLeaf = app._splitNode(insertionLeaf);
		}

		// Adjust the tree starting at the leaf/leaves.
		app._adjustTree(insertionLeaf, newLeaf);

		// Make the tree taller if adjustTree caused root to split.
		if (app._isRootSplit) {
			app._growTaller(root, splitRoot);
		}
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
		var nodeApp = node.isLeaf ? LeafApp : InternalApp;
		var node1 = new nodeApp([seeds[0]]);
		var node2 = new nodeApp([seeds[1]]);

		// Partition the rest of the entries into the groups.
		var rest = _.reject(entries, function(entry) {
			return entry === seeds[0] || entry === seeds[1];
		});
		pickNext({
			node1: node1,
			node2: node2,
			remainingEntries: rest
		});

		return {
			node1: node1,
			node2: node2 
		};
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
		var highestBottomEntry = _.max(entries, function(entry) {
			return entry.boundingBox().bottommost();
		});

		var lowestTopEntry = _.min(entries, function(entry) {
			return entry.boundingBox().topmost();
		});

		ySeparation = 	highestBottomEntry.boundingBox().bottommost()
						- lowestTopEntry.boundingBox().topmost();

		// Find the greatest separation on the X-axis.
		var maxLeftEntry = _.max(entries, function(entry) {
			return entry.boundingBox().leftmost();
		});

		var minRightEntry = _.min(entries, function(entry) {
			return entry.boundingBox().rightmost();
		});

		xSeparation = 	maxLeftEntry.boundingBox().leftmost()
						- minRightEntry.boundingBox().rightmost();

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
			return entry.boundingBox().topmost();
		});

		var bottommostEntry = _.min(entries, function(entry) {
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

		return node.numberOfEntries() < app.M;
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
				
				var expandedBox = app._expandBox(boundingBox, entry);
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

	 _expandBox: function(boundingBox, spatialObject) {
		var app = this;

		var expandedBox = new BoundingBoxApp();
		expandedBox.box($.clone(boundingBox.box()));

		if (spatialObject.leftmost() < boundingBox.leftmost()) {
			expandedBox.expandLeft(spatialObject.leftmost());
		}
		if (spatialObject.rightmost() > boundingBox.rightmost()) {
			expandedBox.expandRight(spatialObject.rightmost());
		}
		if (spatialObject.topmost() > boundingBox.topmost()) {
			expandedBox.expandUp(spatialObject.topmost());
		}
		if (spatialObject.bottommost() < boundingBox.bottommost()) {
			expandedBox.expandDown(spatialObject.bottommost());
		}

		return expandedBox;
	 }

 });

 return TreeApp;
});
