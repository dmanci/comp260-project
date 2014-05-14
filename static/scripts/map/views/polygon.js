define('map/views/polygon', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'view',
	'map/app',
	'data/app'
], function(
	$,
	_,
	Backbone,
	D3,
	View,
	MapApp,
	DataApp,
undefined) {
 var PolygonView = View.extend({
	initialize: function() {
		var view = this;
		View.prototype.initialize.apply(view, arguments);

		view.records = view.model.simpleRecordList();

		view.polygonRecords = [];
		view.lineRecords = [];
		view.groupRecords();

		view.listenTo(view.model, 'record-added', function(record) {
			var simpleRecords = view.model.simpleRecordList(record);
			view.groupRecords(simpleRecords);
			view.render();
		});

		view.listenTo(Backbone, 'search', function(box, params) {
			var record = DataApp.createRecord(box.get('pointSet'));
			var simpleRecords = view.model.simpleRecordList(record);

			view.svgContainer.selectAll('g.g-search').remove();
			var searchContainer = view.svgContainer.append('g')
				.classed('g-search', true);
			var search = searchContainer.selectAll('rect')
				.data(simpleRecords)
				.enter()
				.append('rect')
				.attr('x', params[0])
				.attr('y', params[1])
				.attr('height', params[2])
				.attr('width', params[3])
				.classed('search-polygon', true);
		});

		view.svgContainer = view.$el.append("svg")
			.classed('map-container', true);

		view.polygonContainer = view.svgContainer.append('g');
		view.lineContainer = view.svgContainer.append('g');

		return view;
	},

	render: function() {
		var view = this;

		view._renderPolygons();
		view._renderLines();
		view._renderAxes();

		return view;
	},

	_renderPolygons: function() {
		var view = this;

		view.polygons = view.polygonContainer.selectAll('polygon')
			.data(view.polygonRecords)
			.enter()
			.append('polygon')
			.attr('points', view.polygonPoints)
			.classed('map-polygon', true);

		view.setText(view.polygonContainer, view.polygonRecords);
	},

	_renderLines: function() {
		var view = this;

		view.lines = view.lineContainer.selectAll('line')
			.data(view.lineRecords)
			.enter()
			.append('line');
		view.setLineAttributes();
		view.lines.classed('map-line', true);

		view.setText(view.lineContainer, view.lineRecords);
	},

	setText: function(container, data) {
		var view = this;

		var text = container.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.attr('x', function(record) {
				return record.spatialObject.get('pointSet')[0].x + 5;
			})
			.attr('y', function(record) {
				return record.spatialObject.get('pointSet')[0].y + 10;
			})
			.text(function(record) {
				return record.index;
			});

		text.classed('node', true);
	},

	_renderAxes: function() {
		var view = this;

		var axisScale = D3.scale.linear()
			.domain([0, 600])
			.range([0, 600]);

		var axis = D3.svg.axis().scale(axisScale);

		var padding = 0;

		view.svgContainer.append('g')
			.classed('axis', true)
			.call(axis.orient('top'));

		view.svgContainer.append('g')
			.classed('axis', true)
			.call(axis.orient('left'));
	},

	polygonPoints: function(record) {
		var view = this;

		var pointString = record.spatialObject.get('pointSet').map(function(point) {
			return point.x + ',' + point.y;
		}).join(' ');

		return pointString;
	},

	setLineAttributes: function() {
		var view = this;

		var getPoints = function(record) {
			return record.spatialObject.get('pointSet');
		};

		view.lines
			.attr('x1', function(record) { return getPoints(record)[0].x; })
			.attr('y1', function(record) { return getPoints(record)[0].y; })
			.attr('x2', function(record) { return getPoints(record)[1].x; })
			.attr('y2', function(record) { return getPoints(record)[1].y; });
	},

	linePathFunction: function(args) {
		var app = this;

		return D3.svg.line()
				.x(function(d) { return d.x; })
				.y(function(d) { return d.y; })
				.interpolate("linear").call(app, args);
	},

	groupRecords: function(records) {
		var view = this;

		records = records || view.records;
		_.each(records, function(record) {
			record.spatialObject.get('pointSet').length > 2
			? view.polygonRecords.push(record)
			: view.lineRecords.push(record);
		});
	},
 });

 return PolygonView;
});

