define('data/app', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'tree/record',
	'map/spatial_object'
], function(
	$,
	_,
	Backbone,
	D3,
	RecordApp,
	SpatialObject,
undefined) {
 var DataApp = Backbone.Model.extend({
	initialize: function() {
		var data = this;

		data.set('records', data.createRecords(data.get('pointSets')));
	},

	defaults: {
		pointSets: [
				[ { "x": 1,   "y": 5}, { "x": 20,  "y": 20} ], 
				[ { "x": 40,  "y": 10}, { "x": 60,  "y": 40} ],
				[ { "x": 80,  "y": 5}, { "x": 100, "y": 60} ],
				[ { "x": 10,   "y": 5}, { "x": 10,  "y": 50} ], 
				[ { "x": 70,  "y": 30}, { "x": 20,  "y": 90} ],
				[ { "x": 25,  "y": 50}, { "x": 30, "y": 75} ]
		],
		highestIndex: 0
	},

	createRecords: function(pointSets) {
		var data = this;

		// For each polygon definition, create a "database record"
		// of a retrieval index and the data point.
		var database = {};

		pointSets = pointSets || data.get('pointSets');
		_.each(pointSets, function(pointSet) {
			_.extend(database, data.createRecord(pointSet));
		});

		return database;
	},

	createRecord: function(pointSet) {
		var data = this;

		var nextIndex = data.get('highestIndex');
		data.set('highestIndex', ++nextIndex);

		var record = {};
		var indexStr = nextIndex.toString();
		record[indexStr] = { spatialObject: new SpatialObject(pointSet) };

		return record;
	},

	simpleRecordList: function() {
		var data = this;

		var simpleRecords = _.map(data.get('records'), function(recordData, index) {
			return { 
				index: index,
				spatialObject: recordData.spatialObject
			};
		});

		return simpleRecords;
	},

	addPointSet: function(pointSet) {
		var data = this;

		data.addRecord(data.createRecord(pointSet));
	},

	addRecord: function(record) {
		var data = this;

		var currentRecords = data.get('records');
		data.set('records', _.extend(currentRecords, record));
	},

	getRecordsByIndex: function(indexes) {
		var data = this;

		// Get the records from the datastore.
		return _.pick(data.get('records'), indexes);
	}
 });

 return new DataApp();
});

