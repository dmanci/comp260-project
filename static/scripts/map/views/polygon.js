define('map/views/polygon', [
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
 var PolygonView = Backbone.View.extend({
	initialize: function() {
		var view = this;

		view.$el = D3.select("#map-container");

		view.svgContainer = view.$el.append("svg")
			.attr("width", 200)
			.attr("height", 200);
	},

	render: function() {
		var view = this;

		view.svgContainer
			.append("path")
			.attr('d', view.linePathFunction(MapApp.getPointData()))
			.attr('stroke', 'blue')
			.attr('stroke-width', 2)
			.attr('fill', 'none');

		return view;
	},

	linePathFunction: function(args) {
		var app = this;

		return D3.svg.line()
				.x(function(d) { return d.x; })
				.y(function(d) { return d.y; })
				.interpolate("linear").call(app, args);
	},
 });

 return PolygonView;
});

