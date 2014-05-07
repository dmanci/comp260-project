define('tree/node/leaf', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'tree/node'
], function(
	$,
	_,
	Backbone,
	D3,
	NodeApp,
undefined) {
 var LeafApp = NodeApp.extend({
	 isLeaf: function() { return true; }
 });

 return LeafApp;
});
