define('tree/views/tree', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'view',
	'tree/app',
	'tree/node',
	'map/spatial_object/bounding_box'
], function(
	$,
	_,
	Backbone,
	D3,
	View,
	TreeApp,
	NodeApp,
	BoundingBoxApp,
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

		TreeApp.constructTree(view.model.get('records'));

		$('#submit-button').mouseup(function() {
			var searchText = $('#search').val();
			var params = searchText.split(':');
			
			var searchParams = _.map(params, function(param) { return Number(param); });
			var pointSet = [];
			pointSet.push({ x: searchParams[0], y: searchParams[1] });
			pointSet.push({
				x: searchParams[0],
				y: searchParams[1] + searchParams[2]
			});
			pointSet.push({
				x: searchParams[0] + searchParams[3],
				y: searchParams[1] + searchParams[2]
			});
			pointSet.push({
				x: searchParams[0] + searchParams[3],
				y: searchParams[1]
			});

			var searchBox = new BoundingBoxApp({
				pointSet: pointSet
			});

			var entries = TreeApp.search(searchBox);
			var ids = _.map(entries, function(entry) {
				return entry.get('recordId');
			});

			Backbone.trigger('search', searchBox, searchParams);
			$('#result').html(ids.join(", "));
		});

		$('#add-button').mouseup(function() {
			var addText = $('#add').val();
			var points = addText.split(':');
			var pointSet = [];
			_.each(points, function(point) {
				var p = point.split(',');
				pointSet.push({
					x: Number(p[0]),
					y: Number(p[1])
				});
			});

			var addedRecord = view.model.addPointSet(pointSet);
			view.model.trigger('record-added', addedRecord);

			var simpleRecords = view.model.simpleRecordList(addedRecord);
			var entries = TreeApp.recordsToEntries(simpleRecords);
			TreeApp.insertEntry(entries[0]);

			view.clear();
			view.render();
		});


		view.svgContainer = view.$el.append("svg")
			.classed('tree-container', true);

		view.render();
		return view;
	},

	render: function() {
		var view = this;

		view.setTree();

		// TEST
//		var testBox = new BoundingBoxApp({
//			pointSet: [
//				{x: 200, y: 200},
//				{x: 600, y: 200},
//				{x: 200, y: 450},
//				{x: 600, y: 450}
//			]
//		});
//		console.log(TreeApp.search(testBox));

		return view;
	},

	clear: function() {
		var view = this;

		view.svgContainer.selectAll('g').remove();
	},

	setTree: function() {
		var view = this;
		var tree = view.layout
			.children(view.childrenAccessor);

		var diagonal = D3.svg.diagonal();

		view.treeContainer = view.svgContainer.append("g")
			.attr("transform", "translate(50, 50)");

		var nodes = tree.nodes(TreeApp.get('root'));
		var links = tree.links(nodes);
		
		var link = view.treeContainer.selectAll('path.link')
			.data(links)
			.enter()
			.append('path')
			.attr('class', 'link')
			.attr('d', diagonal);

		var node = view.treeContainer.selectAll('g.node')
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
			.text(view.nodeText);
	},

	childrenAccessor: function(nodeOrEntry) {
		var view = this;

		var children = nodeOrEntry.get('entries') || nodeOrEntry.get('childNode');
		children = children instanceof NodeApp ? [ children ] : children;

		return children;
	},

	nodeText: function(node) {
		var view = this;

		var text;
		// Different text for nodes and entries.
		if (node instanceof NodeApp) {
			if (node.isRoot()) {
				text = "Root";
			}
			else if (node.isLeaf()) {
				text = "Leaf";
			}
			else {
				text = "Node";
			}
		}
		else {
			var recordId = node.get('recordId');
			if (recordId) {
				text = recordId;
			}
			else {
				text = "Entry";
			}
		}
//		text += " - " + node.cid;

		return text;
	}
 });

 return TreeView;
});

