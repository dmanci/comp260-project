define('tree/box/bounding_box', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'map/spatial_object'
], function(
	$,
	_,
	Backbone,
	D3,
	SpatialObject,
undefined) {
 var BoundingBoxApp = Backbone.Model.extend({
	 /*
		var box = [
			{x: , y:},	// top left
			{x: , y:},	// top right
			{x: , y:},	// bottom left
			{x: , y:}	// bottom right
		];
	 */
	initialize: function(spatialObject) {
		var app = this;

		if (spatialObject) {
			app.box = minimumBoundingBox(spatialObject);
		}
	},

	minimumBoundingBox: function(spatialObject) {
		var app = this;

		return {
			topLeft: {
				x: spatialObject.leftmost,
				y: spatialObject.topmost
			},
			topRight: {
				x: spatialObject.rightmost,
				y: spatialObject.topmost
			},
			bottomLeft: {
				x: spatialObject.leftmost,
				y: spatialObject.bottommost
			},
			bottomRight: {
				x: spatialObject.rightmost,
				y: spatialObject.bottommost
			}
		};
	},

	boxObjectToArray: function() {
		var app = this;

		return _.values(app.box);
	},

	box: function(box) {
		var app = this;

		if (box) {
			app.box = box;
		}

		return app.box;
	},

	topLeft: function(point) {
		var app = this;

		if (point) {
			app.box.topLeft = point;
		}

		return app.box.topLeft;
	},

	bottomLeft: function(point) {
		var app = this;

		if (point) {
			app.box.bottomLeft = point;
		}

		return app.box.bottomLeft;
	},

	topRight: function(point) {
		var app = this;

		if (point) {
			app.box.topRight = point;
		}

		return app.box.topRight;
	},

	bottomRight: function(point) {
		var app = this;

		if (point) {
			app.box.bottomRight = point;
		}

		return app.box.bottomRight;
	},

	leftmost: function() {
		var app = this;

		return app.box.topLeft.x;
	},

	rightmost: function() {
		var app = this;

		return app.box.topRight.x;
	},

	topmost: function() {
		var app = this;

		return app.box.topRight.y;
	},

	bottommost: function() {
		var app = this;

		return app.box.bottomRight.y;
	},

	getArea: function() {
		var app = this;

		var height = app.topmost - app.bottommost;
		var width = app.rightmost - app.leftmost;

		return height * width;
	},

	expandUp: function(newTopmost) {
		var app = this;

		app.topLeft.y = newTopmost;
		app.topRight.y = newTopmost;

		return;
	},

	expandDown: function(newBottommost) {
		var app = this;

		app.bottomLeft.y = newBottommost;
		app.bottomRight.y = newBottommost;

		return;
	},

	expandLeft: function(newLeftmost) {
		var app = this;

		app.topLeft.x = newLeftmost;
		app.bottomLeft.x = newLeftmost;

		return;
	},

	expandRight: function(newRightmost) {
		var app = this;

		app.topRight.x = newRigthmost;
		app.bottomRight.x = newRightmost;

		return;
	}
 });

 return BoundingBoxApp;
});
