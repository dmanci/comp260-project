define('map/app', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'data/app'
], function(
	$,
	_,
	Backbone,
	D3,
	DataApp,
undefined) {
 var MapApp = Backbone.Model.extend({
	linePathFunction: function(args) {
		var app = this;

		return D3.svg.line()
				.x(function(d) { return d.x; })
				.y(function(d) { return d.y; })
				.interpolate("linear").call(app, args);
	},
	
	getPolyData: function() {
		var app = this;

		return DataApp.getTestData();
	}
 });

 return new MapApp();
});
