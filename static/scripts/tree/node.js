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
	initialize: function(args) {
		var app = this;

		app.entries = args.entries || [];
		app.numberOfEntries = app.entries.length;
		app.parentEntry = args.parentEntry;
		app.parentNode = args.parentNode;
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
	},

	parentEntry: function(parentEntry) {
		var app = this;

		if (parentEntry) {
			app.parentEntry = parentEntry;
		}
		return app.parentEntry;
	},

	parentNode: function(parentNode) {
		var app = this;

		if (parentNode) {
			app.parentNode = parentNode;
		}
		return app.parentNode;
	}
 });

 return NodeApp;
});

