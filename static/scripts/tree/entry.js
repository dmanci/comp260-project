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

		app.boundingBox = args.boundingBox;
		args.childNode ? childNode(args.childNode) : recordId(args.recordId);
	},

	childNode: function(childNode) {
		var app = this;

		if (childNode) {
			app.childNode = childNode;
			app.recordId = undefined;
		}

		return app.childNode;
	},

	recordId: function(recordId) {
		var app = this;

		if (recordId) {
			app.recordId = recordId;
			app.childNode = undefined;
		}

		return app.recordId;
	},

	isRecordEntry: function() {
		var app = this;

		return !_.isUndefined(app.recordId);
	},

	isParentEntry: function() {
		var app = this;

		return !_.isUndefined(app.childNode);
	},

	boundingBox: function(boundingBox) {
		var app = this;

		if (boundingBox) {
			app.boundingBox = boundingBox;
		}

		return app.boundingBox;
	}

 });

 return EntryApp;
});
