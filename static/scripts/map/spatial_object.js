define('map/spatial_object', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'map/app'
], function(
	$,
	_,
	Backbone,
	D3,
	MapApp,
undefined) {
 var SpatialObject = Backbone.Model.extend({
	initialize: function() {
		var object = this;

		if (object.get('pointSet')) {
			object._setBorders();
		}
	},

	_setBorders: function() {
		var object = this;

		var pointSet = object.get('pointSet');
		object.set('_leftmost', _.min(pointSet, function(point) { return point.x; }));
		object.set('_rightmost', _.max(pointSet, function(point) { return point.x; }));
		object.set('_topmost', _.max(pointSet, function(point) { return point.y; }));
		object.set('_bottommost', _.min(pointSet, function(point) { return point.y; }));

		return;
	},

	leftmost: function() {
		var object = this;
		return object.get('_leftmost');
	},

	rightmost: function() {
		var object = this;
		return object.get('_rightmost');
	},

	topmost: function() {
		var object = this;
		return object.get('_topmost');
	},

	bottommost: function() {
		var object = this;
		return object.get('_bottommost');
	}
 });

 return SpatialObject;
});
