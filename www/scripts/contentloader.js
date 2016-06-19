(function ($) {
	$.fn.contentloader = function() {
		var el = $(this);
		el.css({ 'position': 'fixed', 'width': '100%', 'height': '100%', 'top': '0px', 'left': '0px', 'background-color': '#C0392B', 'z-index': 999 });
		el.each(function() { el.html('<div class="fl spinner3"><div class="dot1"></div><div class="dot2"></div></div>'); centerLoader(); });
		
		return { open: openLoader, close: closeLoader, obj: el };
	};

	function centerLoader() {
		var winW = $(window).width();
		var winH = $(window).height();
		var spinnerW = $('.fl').outerWidth();
		var spinnerH = $('.fl').outerHeight();

		$('.fl').css({
			'position': 'absolute',
			'left': (winW / 2) - (spinnerW / 2),
			'top': (winH / 2) - (spinnerH / 2)
		});
	}
	
	function openLoader() {
		$(this.obj).fadeIn();
	}

	function closeLoader() {
		$(this.obj).fadeOut();
	}

	$(window).load(function() {
		centerLoader();
		
		$(window).resize(function() {
			centerLoader();
		});
	});
}(jQuery));