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

		app.set('entries', []);

		if (args) {
			app.set({
				entries: args.entries,
				parentEntry: args.parentEntry,
				parentNode: args.parentNode
			});
		}

		var entries = app.get('entries');
		app.set('numberOfEntries', entries.length);
	},

	numberOfEntries: function() {
		var app = this;
		return app.get('numberOfEntries');
	},

	addEntry: function(entry) {
		var app = this;

		var entries = app.get('entries');
		entries.push(entry);
		app.set('entries', entries);
		var numberOfEntries = app.get('numberOfEntries');
		app.set('numberOfEntries', ++numberOfEntries);
	},

	entries: function() {
		var app = this;

		return app.get('entries');
	},

	parentEntry: function(parentEntry) {
		var app = this;

		if (parentEntry) {
			app.set('parentEntry', parentEntry);
		}
		return app.get('parentEntry');
	},

	parentNode: function(parentNode) {
		var app = this;

		if (parentNode) {
			app.set('parentNode', parentNode);
		}
		return app.get('parentNode');
	},

	isRoot: function() {
		var app = this;

		return _.isUndefined(app.get('parentEntry')) && _.isUndefined(app.get('parentNode'));
	}
 });

 return NodeApp;
});

