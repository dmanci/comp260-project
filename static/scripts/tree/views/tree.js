define('tree/views/tree', [
	'jquery',
	'underscore',
	'backbone',
	'd3'
], function(
	$,
	_,
	Backbone,
	D3,
undefined) {
 var TreeView = Backbone.View.extend({
	initialize: function() {
		var view = this;
		
		view.el = D3.select("#tree-container");
		view.model = new TreeApp(10, 5);
		view.layout = D3.layout.tree();

		view.diagonal = D3.svg.diagonal()
			.projection(function(d) { return [d.y, d.x]; });

		view.svg = view.el.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
				.attr("transform", "translate(40,0)");

		return view;
	},

	render: function() {

		
	}
 });

 return TreeView;
});

