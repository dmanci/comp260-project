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
				[ { "x": 50,  "y": 300}, { "x": 300,  "y": 250}, { "x": 100, "y": 100 } ],
				[ { "x": 100,  "y": 470}, { "x": 200,  "y": 430} ],
				[ { "x": 40,  "y": 10}, { "x": 60,  "y": 40} ],
				[ { "x": 300,  "y": 40}, { "x": 400,  "y": 20} ],
				[ { "x": 300,  "y": 400}, { "x": 250,  "y": 420} ],
				[ { "x": 250,  "y": 250}, { "x": 350,  "y": 350} ],
				[ { "x": 110,   "y": 55}, { "x": 20,  "y": 220} ], 
				[ { "x": 50,  "y": 240}, { "x": 55,  "y": 200} ],
				[ { "x": 70,  "y": 37}, { "x": 20,  "y": 40} ],
				[ { "x": 420,  "y": 310}, { "x": 230,  "y": 60} ]
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
		record[indexStr] = { spatialObject: new SpatialObject({ pointSet: pointSet }) };

		return record;
	},

	simpleRecordList: function(records) {
		var data = this;

		records = records || data.get('records');
		var simpleRecords = _.map(records, function(recordData, index) {
			return { 
				index: index,
				spatialObject: recordData.spatialObject
			};
		});

		return simpleRecords;
	},

	addPointSet: function(pointSet) {
		var data = this;

		var record = data.createRecord(pointSet);
		data.addRecord(record);
		return record;
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

