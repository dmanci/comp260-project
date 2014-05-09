define('data/app', [
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
 var DataApp = Backbone.Model.extend({
	initialize: function() {
		var data = this;

		data._testData = [
		{ "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                 { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                 { "x": 80,  "y": 5},  { "x": 100, "y": 60}
		];
	},

	getTestData: function() {
		var data = this;

		return data._testData;
	}
 });

 return new DataApp();
});

