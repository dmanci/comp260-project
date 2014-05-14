define('app', [
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'tree/views/tree',
	'tree/app',
	'map/views/polygon',
	'map/spatial_object',
	'data/app'
], function(
	$,
	_,
	Backbone,
	D3,
	TreeView,
	TreeApp,
	PolygonView,
	SpatialObject,
	DataApp,
undefined) {
 var App = {
	initialize: function() {
		var polygonView = new PolygonView({
			el: D3.select("#map-container"),
			model: DataApp
		});
		polygonView.render();

		var treeView = new TreeView({
			el: D3.select("#tree-container"),
			model: DataApp
		});

		$('document').ready(function() {
			var $navBar = $('#navigation');
			var $pages = $('.page');
			var numberOfPages = $pages.length;

			var navHTML = '';
			var j;
			$pages.each(function(i, el) {
				j = i + 1;
				if ($(el).attr('id') == 'demo-container') {
					navHTML += "<li class='pageButton'>Demo</li>\n";
				}
				else {
					if (i === 0 || i === 1) {
						navHTML += "<li class='pageButton'>Intro " + j + "</li>\n";

					}
					else if (i === 2 || i === 3 || i === 4 || i === 5) {
						navHTML += "<li class='pageButton'>Background " + j + "</li>\n";
					}
					else if (i === 6 || i === 7 || i === 8 || i === 9 || i === 10) {
						navHTML += "<li class='pageButton'>Insert " + j + "</li>\n";
					}
					else if (i === 11 || i === 12) {
						navHTML += "<li class='pageButton'>Search " + j + "</li>\n";
					}
				}
				$(el).data('page-number', j);
			});

			$navBar.html(navHTML);
			var $navBarItems = $navBar.children();
			$navBarItems.each(function(i, el) {
				if (i === 0) {
					$(el).addClass('nav-open');
				}
				$(el).data('page-number', i + 1);
				$(el).click(function() {
					j = i + 1;
					var $page = $pages.filter(function() {
						var el = this;
						return $(el).data('page-number') == j;
					});
					$pages.hide();
					$page.show();
					$navBarItems.removeClass('nav-open');
					$(el).addClass('nav-open');
				});
			});


		})
//		var object = new SpatialObject();
	}
 };

 return App;
});
