define('map/app', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'data/app'
], function(
	$,
	_,
	Backbone,
	D3,
	DataApp,
undefined) {
 var MapApp = Backbone.Model.extend({
	getPointData: function() {
		var app = this;

		return DataApp.get('pointSets');
	}
 });

 return new MapApp();
});
