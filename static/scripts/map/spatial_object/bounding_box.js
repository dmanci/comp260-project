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
	initialize: function() {
		var app = this;
		SpatialObject.prototype.initialize.apply(app, arguments);

		if (app.get('pointSet')) {
			app.constructBox();
		}

		return app;
	},

	constructBox: function() {
		var app = this;

		app.set('boxObject', app.minimumBoundingBox());
		app.set('pointSet', app.boxObjectToArray());
	},

	minimumBoundingBox: function() {
		var app = this;

		return {
			topLeft: {
				x: app.leftmost().x,
				y: app.topmost().y
			},
			topRight: {
				x: app.rightmost().x,
				y: app.topmost().y
			},
			bottomLeft: {
				x: app.leftmost().x,
				y: app.bottommost().y
			},
			bottomRight: {
				x: app.rightmost().x,
				y: app.bottommost().y
			}
		};
	},

//	changeSize: function(points) {
//		var app = this;
//
//		app.points(points);
//		app.box(app.minimumBoundingBox());
//	},

	boxObjectToArray: function() {
		var app = this;

		return _.values(app.boxObject());
	},

	boxObject: function(box) {
		var app = this;

		if (box) {
			app.set('boxObject', box);
		}

		return app.get('boxObject');
	},

	getArea: function() {
		var app = this;

		var height = app.topmost().y - app.bottommost().y;
		var width = app.rightmost().x - app.leftmost().x;

		return height * width;
	},

	// TODO: Revisit this.
	contains: function(otherBox) {
		var app = this;

		var contains = false;
		if (app.leftmost().x < otherBox.leftmost().x && app.rightmost().x > otherBox.leftmost().x) {
			if (app.topmost().y > otherBox.topmost().y && app.bottommost().y < otherBox.topmost().y) {
				contains = true;
			}
			else if (app.topmost().y > otherBox.bottommost().y && app.bottommost().y < otherBox.bottommost().y) {
				contains = true;
			}
		}
		else if (app.leftmost().x < otherBox.rightmost().x && app.rightmost().x > otherBox.rightmost().x) {
			if (app.topmost().y > otherBox.topmost().y && app.bottommost().y < otherBox.topmost().y) {
				contains = true;
			}
			else if (app.topmost().y > otherBox.bottommost().y && app.bottommost().y < otherBox.bottommost().y) {
				contains = true;
			}
		}

		return contains;
	}
 });

 return BoundingBoxApp;
});
