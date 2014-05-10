define('app', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'tree/views/tree',
	'tree/app',
	'map/views/polygon',
	'map/spatial_object',
	'data/app'
], function(
	$,
	_,
	Backbone,
	D3,
	TreeView,
	TreeApp,
	PolygonView,
	SpatialObject,
	DataApp,
undefined) {
 var App = {
	initialize: function() {
		var polygonView = new PolygonView({
			el: D3.select("#map-container"),
			model: DataApp
		});
		polygonView.render();

		var treeView = new TreeView({
			el: D3.select("#tree-container"),
			model: DataApp
		});

//		var object = new SpatialObject();
	}
 };

 return App;
});
