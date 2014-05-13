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

//		var pointSets = view.model.get('pointSets');
		var records = view.model.simpleRecordList();
//		_.each(pointSets, function(pointSet) {
	debugger;
		_.each(records, function(record) {
			var pointSet = record.spatialObject.get('pointSet');
			var id = record.index;
			view.svgContainer
				.append("path")
				.attr('d', view.linePathFunction(pointSet))
				.attr('stroke', 'blue')
				.attr('stroke-width', 2)
				.attr('fill', 'none');

			view.svgContainer
				.append('text')
				.attr("x", pointSet[0].x)
                .attr("y", pointSet[1].y)
				.text(id)
				.attr('font-size', '9pt');
		});

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

