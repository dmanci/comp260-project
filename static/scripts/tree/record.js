define('tree/record', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'map/spatial_object'
], function(
	$,
	_,
	Backbone,
	D3,
	SpatialObject,
undefined) {
 var RecordApp = Backbone.Model.extend({
	initialize: function(dataElement) {
		var app = this;
		
		app.record = app.createRecord(dataElement);
	},

	 createRecord: function(index, dataElement) {
		var app = this;

		var record = {};
		record[index] = new SpatialObject(dataElement);
		return record;
	 },

	 record: function(record) {
		var app = this;

		if (record) {
			app.record = record;
		}

		return app.record;
	 }

 });

 return RecordApp;
});

