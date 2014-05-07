define('tree/node/internal', [
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
 var InternalApp = NodeApp.extend({
	isInternal: function() { return true; }
 });

 return InternalApp;
});

