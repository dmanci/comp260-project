define('view', [
	'backbone'
], function(
	Backbone,
undefined) {
 var View = Backbone.View.extend({
	initialize: function(options) {
		var view = this;
		
		view.$el = options.el;
		view.model = options.model;

		Backbone.View.prototype.initialize.apply(view, arguments);
	}
 });

 return View;
});
