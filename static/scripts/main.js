requirejs.config({
	baseUrl: 'static/scripts',
	urlArgs: "bust=" + (new Date()).getTime(),

	paths: {
		jquery: 'thirdparty/jquery-2.1.0.min',
		underscore: 'thirdparty/underscore-min',
		backbone: 'thirdparty/backbone-min',
		d3: 'thirdparty/d3.min'
	}
});

requirejs([
	'app'
], function(
	App,
undefined) {
	App.initialize();
});
