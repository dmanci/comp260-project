define('tree/node', [
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
 var NodeApp = Backbone.Model.extend({
	initialize: function(entries) {
		var app = this;

		app.entries = entries || [];
		app.numberOfEntries = app.entries.length;
	},

	numberOfEntries: function() {
		var app = this;
		return app.numberOfEntries;
	},

	addEntry: function(entry) {
		var app = this;

		app.entries.push(entry);
		app.numberOfEntries++;
	},

	entries: function() {
		var app = this;

		return app.entries;
	}
 });

 return NodeApp;
});

