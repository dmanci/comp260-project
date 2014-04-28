define('app', [
	'jquery',
	'underscore',
	'backbone',
	'tree/views/tree',
	'tree/app',
	'map/views/polygon',
	'map/spatial_object'
], function(
	$,
	_,
	Backbone,
	TreeView,
	TreeApp,
	PolygonView,
	SpatialObject,
undefined) {
 var App = {
	initialize: function() {
		var polygonView = new PolygonView();
		polygonView.render();

		var treeApp = new TreeApp();
		var object = new SpatialObject();
	}
 };

 return App;
});
