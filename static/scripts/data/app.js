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
		var app = this;
	},

	getTestData: function() {
		return [
			{ x: 0, y: 0 },
			{ x: 200, y: 200 }
		];
	}
 });

 return new DataApp();
});

