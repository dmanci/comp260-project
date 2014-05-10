define('tree/views/tree', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'view',
	'tree/app'
], function(
	$,
	_,
	Backbone,
	D3,
	View,
	TreeApp,
undefined) {
 var TreeView = View.extend({
	initialize: function() {
		var view = this;
		View.prototype.initialize.apply(view, arguments);
		
		view.layout = D3.layout.tree().size([400, 400]);

		view.testData = {
			name: "cluster",
			children: [
				{ name: 'test1', size: 10 },
				{ name: 'test2', size: 20 },
				{ name: 'test3', size: 20 }
			]
		};

		view.records = view.model.get('records');
		TreeApp.constructTree(view.records);
		view.root = TreeApp.toJSON();

		view.render();
		return view;
	},

	render: function() {
		var view = this;

		view.setTree();

		return view;
	},

	setTree: function() {
		var view = this;
		var tree = view.layout;

		var diagonal = D3.svg.diagonal();

		var svg = view.$el.append("svg")
			.attr("width", 500)
			.attr("height", 500)
			.append("g")
				.attr("transform", "translate(50, 50)");

		var nodes = tree.nodes(view.treeData);
		var links = tree.links(nodes);
		
		var link = svg.selectAll('path.link')
			.data(links)
			.enter().append('path')
				.attr('class', 'link')
				.attr('d', diagonal);

		var node = svg.selectAll('g.node')
			.data(nodes)
			.enter().append('g')
				.attr('class', 'node')
				.attr('transform', function(d) {
					return "translate(" + d.x + "," + d.y + ")";
				});

		node.append('circle')
			.attr('r', 4.5);

		node.append('text')
			.attr('dx', function(d) {
				return d.children ? -8 : 8;
			})
			.attr('dy', 3)
			.attr('text-anchor', function(d) {
				return d.children ? "end" : "start";
			})
			.text(function(d) {
				return d.name;
			});
	}
 });

 return TreeView;
});

