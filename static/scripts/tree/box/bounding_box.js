define('tree/box/bounding_box', [
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
 var BoundingBoxApp = Backbone.Model.extend({
	 /*
		var box = [
			{x: , y:}, // top left
			{x: , y:}, // bottom left
			{x: , y:}, // top right
			{x: , y:} // bottom right
		];
	 */
	 box: function() {
		var app = this;

		return app.box;
	 },

	 topLeft: function(point) {
		var app = this;

		if (point) {
			app.box.topLeftPoint = point;
		}

		return app.box.topLeftPoint;
	 },

	 bottomLeft: function(point) {
		var app = this;

		if (point) {
			app.box.bottomLeftPoint = point;
		}

		return app.box.bottomLeftPoint;
	 },

	 topRight: function(point) {
		var app = this;

		if (point) {
			app.box.topRightPoint = point;
		}

		return app.box.topRightPoint;
	 },

	 bottomRight: function(point) {
		var app = this;

		if (point) {
			app.box.bottomRightPoint = point;
		}

		return app.box.bottomRightPoint;
	 },

	 leftmost: function() {
		var app = this;

		return app.box.topLeftPoint.x;
	 },

	 rightmost: function() {
		var app = this;

		return app.box.topRightPoint.x;
	 },

	 topmost: function() {
		var app = this;

		return app.box.topRightPoint.y;
	 },

	 bottommost: function() {
		var app = this;

		return app.box.bottomRightPoint.y;
	 },

	 getArea: function() {
		var app = this;

		var height = app.topmost - app.bottommost;
		var width = app.rightmost - app.leftmost;

		return height * width;
	 },

	 expandUp: function(newTopmost) {
		var app = this;

		app.topLeft.y = newTopmost;
		app.topRight.y = newTopmost;

		return;
	 },

	 expandDown: function(newBottommost) {
		var app = this;

		app.bottomLeft.y = newBottommost;
		app.bottomRight.y = newBottommost;

		return;
	 },

	 expandLeft: function(newLeftmost) {
		var app = this;

		app.topLeft.x = newLeftmost;
		app.bottomLeft.x = newLeftmost;

		return;
	 },

	 expandRight: function(newRightmost) {
		var app = this;

		app.topRight.x = newRigthmost;
		app.bottomRight.x = newRightmost;

		return;
	 }
 });

 return BoundingBoxApp;
});
