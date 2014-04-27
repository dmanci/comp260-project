define('tree/app', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'data/app',
	'tree/box/bounding_box'
], function(
	$,
	_,
	Backbone,
	D3,
	DataApp,
	BoundingBox,
undefined) {
 var TreeApp = Backbone.Model.extend({
	 initialize: function() {
		var app = this;

		app.highestIndex = 0;
		app.treeData = app.createTreeData(DataApp.getTestData());
	 },

	 createTreeData: function(data) {
		var app = this;

		// For each polygon definition, create a "database record"
		// of a retrieval index and the data point.
		var database = [];
		_.each(data, function(dataElement) {
			var record = {
				index: app.highestIndex++,
				value: dataElement
			};
			database.push(record);
		});

		return database;
	 },

	 insertNode: function(entry, tree) {
		 var app = this;

		 var insertionLeaf = app._chooseLeaf(entry, tree);

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
		var expandedBox.box = $.clone(boundingBox.box());
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


 )};

 return new TreeApp();
});
