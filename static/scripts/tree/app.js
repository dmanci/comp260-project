define('tree/app', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'data/app',
	'tree/box/bounding_box',
	'map/spatial_object'
], function(
	$,
	_,
	Backbone,
	D3,
	DataApp,
	BoundingBox,
	SpatialObject,
undefined) {
 var TreeApp = Backbone.Model.extend({
	 initialize: function(M, m) {
		var app = this;

		app.highestIndex = 0;
		app.treeData = app.createTreeData(DataApp.getTestData());
		app.M = M;
		app.m = m;
	 },

	 createTreeData: function(data) {
		var app = this;

		// For each polygon definition, create a "database record"
		// of a retrieval index and the data point.
		var database = [];
		_.each(data, function(dataElement) {
			record = app._createRecord(dataElement);
			database.push(record);
			app._addRecord(record);
		});

		return database;
	 },

	 _createRecord: function(entry) {
		var app = this;

		return {
			index: app.highestIndex++,
			value: new SpatialObject(entry);
		};
	 },

	 _addRecord: function(record) {
		var app = this;

		app.treeData.push(record);
	 },

	 retrieveRecords: function(indexes) {
		var app = this;

		// Get the records from the datastore.
		var records = [];
		_.each(indexes, function(index) {
			records.push(_.findWhere(app.treeData, { index: index }));
		});

		return records;
	 },

	 insertNode: function(entry, tree) {
		var app = this;
		
		// Find the insertion point.
		var insertionLeaf = app._chooseLeaf(entry, tree);

		// If leaf has room, insert. Otherwise, split the node.
		if (app._leafHasRoom(insertionLeaf)) {
			app._installNode(entry, insertionLeaf);
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

	 _splitLeaf: function(leaf, useQuadratic) {
		var app = this;

		var indexes = leaf.getIndexes();
		var records = app.retrieveRecords(indexes);

		var pickSeeds = useQuadratic ? app._quadraticPickSeeds : app._linearPickSeeds;

		var seeds = pickSeeds(records);

		var leaf1 = new LeafApp([seeds[0]]);
		var leaf2 = new LeafApp([seeds[1]]);

		var rest = _
		while (rest.length > 0) {
			
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

	 _installNode: function(entry, leaf) {
		var app = this;

		var record = app.createTreeData([entry])[0];
		leaf.addRecordIndex(record.index);
	 },

	 _leafHasRoom: function(leaf) {
		var app = this;

		return leaf.numberOfRecords() < app.M;
	 },

	 _chooseLeaf: function(entry, node) {
		var app = this;
		
		if (app._isLeaf(node)) {
			return node;
		}
		else {
			var mininumAreaChange;
			var originalArea;
			var chosenNode;

			// Choose a bounding box from one of the children to descend into.
			_.each(node.children, function(childNode) {
				var boundingBox = childNode.boundingBox;
				var boundingBoxArea = boundingBox.getArea();
				
				var expandedBox = app._expandBox(boundingBox, entry);
				var expandedBoxArea = expandedBox.getArea();
				var areaChange = expandedBoxArea - boundingBoxArea;

				// Choose the box that needs to expand the least.
				if (areaChange < minimumAreaChange || _.isUndefined(minimumAreaChange)) {
					minimumAreaChange = areaChange;
					originalArea = boundingBoxArea;
					chosenNode = childNode;
				}

				// If there's a tie, take the box with the lower original area.
				else if (minimumAreaChange === areaChange) {
					if (boundingBoxArea < originalArea) {
						minimumAreaChange = areaChange;
						originalArea = boundingBoxArea;
						chosenNode = childNode;
					}
				}
			});
		}
		
		return _chooseLeaf(entry, chosenNode);
	 },

	 _expandBox: function(boundingBox, spatialObject) {
		var app = this;

		var expandedBox = new BoundingBox();
		expandedBox.box = $.clone(boundingBox.box());

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
	 },

	 _isLeaf: function(node) {
		var app = this;

		return _.isUndefined(node.children);
	 }


 });

 return TreeApp;
});
