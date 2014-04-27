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
			{
				x: 0,
				y: 0
			},
			{
				x: 200,
				y: 200
			}
		];
	},

	getTestData: function() {
		var data = this;

		return data._testData;
	}
 });

 return new DataApp();
});

