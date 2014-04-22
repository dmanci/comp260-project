define('app', [
	'jquery',
	'underscore',
	'backbone',
	'tree/views/tree',
	'map/views/polygon'
], function(
	$,
	_,
	Backbone,
	TreeView,
	PolygonView,
undefined) {
 var App = {
	initialize: function() {
		var polygonView = new PolygonView();
		polygonView.render();
	}
 };

 return App;
});
