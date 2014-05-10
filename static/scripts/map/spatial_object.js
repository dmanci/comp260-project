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
	initialize: function(pointSet) {
		var object = this;

		object.set('pointSet', pointSet);
		object._setBorders();
	},

	_setBorders: function() {
		var object = this;

		var pointSet = object.get('pointSet');
		object._leftmost = _.min(pointSet, function(point) { return point.x; });
		object._righmost = _.max(pointSet, function(point) { return point.x; });
		object._topmost = _.max(pointSet, function(point) { return point.y; });
		object._bottommost = _.min(pointSet, function(point) { return point.y; });

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

 return SpatialObject;
});
