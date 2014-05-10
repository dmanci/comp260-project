define('map/views/polygon', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'view',
	'map/app'
], function(
	$,
	_,
	Backbone,
	D3,
	View,
	MapApp,
undefined) {
 var PolygonView = View.extend({
	initialize: function() {
		var view = this;
		View.prototype.initialize.apply(view, arguments);

		view.svgContainer = view.$el.append("svg")
			.attr("width", 600)
			.attr("height", 600);

		return view;
	},

	render: function() {
		var view = this;

		var points = view.model.get('pointSets');
		view.svgContainer
			.append("path")
			.attr('d', view.linePathFunction(points))
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

