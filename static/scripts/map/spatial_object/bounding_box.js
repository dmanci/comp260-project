define('map/spatial_object/bounding_box', [
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
 var BoundingBoxApp = SpatialObject.extend({
	initialize: function(points) {
		var app = this;
		SpatialObject.prototype.initialize.apply(app, arguments);

		if (points) {
			app.constructBox();
		}

		return app;
	},

	constructBox: function(points) {
		var app = this;

		points ||= app.points();
		app.box = app.minimumBoundingBox();
		app.points(app.boxObjectToArray());
	},

	minimumBoundingBox: function() {
		var app = this;

		return {
			topLeft: {
				x: app.leftmost,
				y: app.topmost
			},
			topRight: {
				x: app.rightmost,
				y: app.topmost
			},
			bottomLeft: {
				x: app.leftmost,
				y: app.bottommost
			},
			bottomRight: {
				x: app.rightmost,
				y: app.bottommost
			}
		};
	},

	changeSize: function(points) {
		var app = this;

		app.points(points);
		app.box(app.minimumBoundingBox());
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

	getArea: function() {
		var app = this;

		var height = app.topmost - app.bottommost;
		var width = app.rightmost - app.leftmost;

		return height * width;
	}
 });

 return BoundingBoxApp;
});
