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
	initialize: function(points) {
		var object = this;

		object.points = points;
		_setBorders();
	},

	_setBorders: function() {
		var object = this;

		object._leftmost = _.min(object.points, function(point) { return point.x; });
		object._righmost = _.max(object.points, function(point) { return point.x; });
		object._topmost = _.max(object.points, function(point) { return point.y; });
		object._bottommost = _.min(object.points, function(point) { return point.y; });

		return;
	},

	leftmost: function() {
		var object = this;
		return object._leftmost;
	},

	rightmost: function() {
		var object = this;
		return object._rightmost;
	},

	topmost: function() {
		var object = this;
		return object._topmost;
	},

	bottommost: function() {
		var object = this;
		return object._bottommost;
	}
 });

 return new SpatialObject();
});
