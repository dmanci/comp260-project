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

		var indexes = node.getIndexes();
		var records = app.retrieveRecords(indexes);

		var pickSeeds = useQuadratic ? app._quadraticPickSeeds : app._linearPickSeeds;

		var seeds = pickSeeds(records);

		var leaf1 = new LeafApp([seeds[0]]);
		var leaf2 = new LeafApp([seeds[1]]);

		var rest = _.reject(records, function(record) {
			return record.index !== seeds[0].index
				&& record.index !== seeds[1].index;
		});
		while (rest.length > 0) {
			if (leaf1
		}
	 },

	 _linearPickSeeds: function(records) {
		var app = this;

		// Find the greatest separation on the Y-axis.
		var highestBottomSeed = _.max(records, function(record) {
			return record.bottommost();
		});

		var lowestTopSeed = _.min(records, function(record) {
			return record.topmost();
		});

		ySeparation = highestBottomSeed.bottommost - lowestTopSeed.topmost;

		// Find the greatest separation on the X-axis.
		var maxLeftSeed = _.max(records, function(record) {
			return record.leftmost();
		});

		var minRightSeed = _.min(records, function(record) {
			return record.rightmost();
		});

		xSeparation = maxLeftSeed.leftmost() - minRightSeed.rightmost();

		// Normalize the separations and pick the most extreme one.
		var yNormalized = ySeparation / app._findHeight(records);
		var xNormalized = xSeparation / app._findWidth(records);

		var seeds 	= yNormalized > xNormalized
					? [ highestBottomSeed, lowestTopSeed ]
					: [ maxLeftSeed, minRightSeed ];

		return seeds;
	 },

	_findHeight: function(records) {
		var app = this;

		var topmostRecord = _.max(records, function(record) {
			return record.topmost();
		});

		var bottommostRecord = _.min(records, function(record) {
			return record.bottommost();
		});

		return topmostRecord.topmost() - bottommostRecord.bottommost();
	},

	_findWidth: function(records) {
		var app = this;

		var rightmostRecord = _.max(records, function(record) {
			return record.rightmost();
		});

		var leftmostRecord = _.min(records, function(record) {
			return record.leftmost();
		});

		return rightmostRecord.rightmost() - leftmostRecord.leftmost();
	},

	 _installEntry: function(entry, leaf) {
		var app = this;

		var record = app.createTreeData([entry])[0];
		leaf.addRecordIndex(record.index);
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
