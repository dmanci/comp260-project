define('tree/entry', [
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
 var EntryApp = Backbone.Model.extend({
	initialize: function(args) {
		var app = this;

		app.set('boundingBox', args.boundingBox);
		args.childNode ? app.set('childNode', args.childNode) : app.set('recordId', args.recordId);
	},

	isRecordEntry: function() {
		var app = this;

		return !_.isUndefined(app.get('recordId'));
	},

	isParentEntry: function() {
		var app = this;

		return !_.isUndefined(app.get('childNode'));
	},

	boundingBox: function(boundingBox) {
		var app = this;

		if (boundingBox) {
			app.set('boundingBox', boundingBox);
		}

		return app.get('boundingBox');
	}

 });

 return EntryApp;
});
