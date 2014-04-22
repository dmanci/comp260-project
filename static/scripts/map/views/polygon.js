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

		view.bodySelection = D3.select("#tree-container");

		view.svgContainer = view.bodySelection.append("svg")
			.attr("width", 200)
			.attr("height", 200);
	},

	render: function() {
		var view = this;

		var boxes = view.svgContainer
						.append("path")
						.attr('d', MapApp.linePathFunction(MapApp.getPolyData()))
						.attr('stroke', 'blue')
						.attr('stroke-width', 2)
						.attr('fill', 'none');

		return view;
	}
 });

 return PolygonView;
});

