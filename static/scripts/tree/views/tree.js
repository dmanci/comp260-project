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
		
		view.layout = d3.layout.tree();

		return view;
	},

	render: function() {

		
	}
 });

 return TreeView;
});

