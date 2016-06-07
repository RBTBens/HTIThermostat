$(window).load(function() {
	$("#status").addClass("hide-status"), $("#preloader").addClass("hide-preloader")
}), $(document).ready(function() {
	function e() {
		var e = .85 * $("#page-content").height();
		$(".sidebar-scroll").css("height", e), $(".sidebar-scroll").css("top", "50%"), $(".sidebar-scroll").css("margin-top", -(e / 2))
	}

	function t() {
		var e = -($(".owl-dots").width() / 2);
		$(".coverpage-news .owl-dots, .coverpage-slider .owl-dots").css("position", "absolute"), $(".coverpage-news .owl-dots, .coverpage-slider .owl-dots").css("left", "50%"), $(".coverpage-news .owl-dots, .coverpage-slider .owl-dots").css("margin-left", e)
	}

	function o() {
		var e = $("#page-content").height(),
			t = $("#page-content").width(),
			o = $(".cover-page-content").height() - 30,
			i = $(".cover-page-content").width();
		$(".cover-page").css("height", e), $(".cover-page").css("width", t), $(".cover-page-content").css("margin-left", i / 2 * -1), $(".cover-page-content").css("margin-top", o / 2 * -1);
		var a = $(window).width(),
			s = $(window).height(),
			r = -$(".cover-center").height() / 2,
			l = -$(".cover-center").width() / 2;
		$(".cover-screen").css("width", a), $(".cover-screen").css("height", s), $(".cover-screen .overlay").css("width", a), $(".cover-screen .overlay").css("height", s), $(".cover-center").css("margin-left", l), $(".cover-center").css("margin-top", r + 30), $(".cover-left").css("margin-top", r), $(".cover-right").css("margin-top", r)
	}

	function i() {
		var e = $(window).width(),
			t = $(window).height();
		$(".map-fullscreen iframe").css("width", e), $(".map-fullscreen iframe").css("height", t)
	}
	
	function w() {
		$("a").each(function() {
			var href = $(this).attr("href");
			if (!href)
			{
				
			}
			else if (href == "#this")
			{
				$(this).removeAttr("href");
			}
			else if (href.substring(0, 6) == "#this-")
			{
				var func = href.substring(href.indexOf("-") + 1, href.length);
				var par1 = func.indexOf("(");
				var par2 = func.indexOf(")");
				var para = "()";
				
				if (par1 > -1 && par2 > -1)
				{
					para = func.substring(par1, par2 + 1);
					func = func.substring(0, par1);
				}
				
				$(this).attr("href", "javascript:gl['" + func + "']" + para);
			}
		});
	}
	
	if ($(function() {
			FastClick.attach(document.body)
		}), $(function() {
			$(".preload-image").lazyload({
				threshold: 100,
				effect: "fadeIn",
				container: $("#page-content-scroll")
			})
		}), $(window).resize(function() {
			e()
		}), $(".open-left-sidebar").click(function() {
			return $("#page-content").addClass("body-left"), $(".header-fixed").addClass("hide-header"), $(".sidebar-left, .sidebar-left-fix").addClass("active-sidebar-box"), $(".sidebar-right, .sidebar-right-fix").removeClass("active-sidebar-box"), $(".sidebar-tap-close").addClass("active-tap-close"), e(), !1
		}), $(".open-right-sidebar").click(function() {
			return $("#page-content").addClass("body-right"), $(".header-fixed").addClass("hide-header"), $(".sidebar-right, .sidebar-right-fix").addClass("active-sidebar-box"), $(".sidebar-left, .sidebar-left-fix").removeClass("active-sidebar-box"), $(".sidebar-tap-close").addClass("active-tap-close"), e(), !1
		}), $(".sidebar-tap-close, .close-sidebar").click(function() {
			return $("#page-content, .header-fixed, .footer-fixed").removeClass("body-left body-right"), $(".sidebar-left, .sidebar-right, .sidebar-left-fix, .sidebar-right-fix").removeClass("active-sidebar-box"), $(".sidebar-tap-close").removeClass("active-tap-close"), $(".header-fixed").removeClass("hide-header"), !1
		}), $(".open-submenu").click(function() {
			var e = $(this).parent().find(".submenu a").length;
			return $(this).parent().find(".submenu").toggleClass("active-submenu-" + e), $(this).toggleClass("active-item"), $(this).parent().find(".menu-item .fa-plus").toggleClass("rotate-icon"), !1
		}), $(".submenu").hasClass("active-submenu")) {
		var a = $(".active-submenu").find("a").length;
		$(".active-submenu").addClass("active-submenu-" + a), $(".active-submenu").parent().find(".menu-item .fa-plus").addClass("rotate-icon")
	}
	setTimeout(function() {
		$(".coverpage-slider").owlCarousel({
			loop: !0,
			margin: 0,
			nav: !1,
			items: 1
		}), $(".single-item").owlCarousel({
			autoplay: !0,
			autoplayTimeout: 4e3,
			loop: !0,
			margin: 10,
			nav: !0,
			dots: !0,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 1
				},
				1e3: {
					items: 1
				}
			}
		}), $(".home-next").click(function() {
			$(".single-item").trigger("next.owl.carousel")
		}), $(".home-prev").click(function() {
			$(".single-item").trigger("prev.owl.carousel")
		}), $(".double-item").owlCarousel({
			autoplay: !0,
			autoplayTimeout: 4e3,
			loop: !0,
			margin: 10,
			lazyLoad: !0,
			nav: !1,
			dots: !1,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1e3: {
					items: 2
				}
			}
		}), $(".tripple-item").owlCarousel({
			autoplay: !0,
			autoplayTimeout: 4e3,
			loop: !0,
			margin: 10,
			lazyLoad: !0,
			nav: !1,
			dots: !1,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 3
				},
				1e3: {
					items: 3
				}
			}
		}), $(".store-slider, .product-slider").owlCarousel({
			loop: !0,
			margin: 10,
			nav: !1,
			dots: !1,
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 2
				},
				1e3: {
					items: 2
				}
			}
		})
	}, .001), $(".switch-1").click(function() {
		return $(this).toggleClass("switch-1-on"), !1
	}), $(".switch-2").click(function() {
		return $(this).toggleClass("switch-2-on"), !1
	}), $(".switch-3").click(function() {
		return $(this).toggleClass("switch-3-on"), !1
	}), $(".switch, .switch-icon").click(function() {
		return $(this).parent().find(".switch-box-content").slideToggle(250), $(this).parent().find(".switch-box-subtitle").slideToggle(250), !1
	}), $(".toggle-title").click(function() {
		return $(this).parent().find(".toggle-content").slideToggle(250), $(this).find("i").toggleClass("rotate-toggle"), !1
	}), $(".accordion").find(".accordion-toggle").click(function() {
		$(this).next().slideDown(250), $(".accordion").find("i").removeClass("rotate-180"), $(this).find("i").addClass("rotate-180"), $(".accordion-content").not($(this).next()).slideUp(250)
	}), $("ul.tabs li").click(function() {
		var e = $(this).attr("data-tab");
		$("ul.tabs li").removeClass("active-tab"), $(".tab-content").slideUp(250), $(this).addClass("active-tab"), $("#" + e).slideToggle(250)
	}), $(".static-notification-close").click(function() {
		return $(this).parent().slideUp(250), !1
	}), $(".tap-dismiss").click(function() {
		return $(this).slideUp(250), !1
	});
	var s = {
		Android: function() {
			return navigator.userAgent.match(/Android/i)
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i)
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i)
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i)
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i)
		},
		any: function() {
			return s.Android() || s.BlackBerry() || s.iOS() || s.Opera() || s.Windows()
		}
	};
	s.any() || ($(".show-blackberry, .show-ios, .show-windows, .show-android").addClass("disabled"), $("#page-content-scroll").css("right", "0px"), $(".show-no-detection").removeClass("disabled")), s.Android() && ($("head").append('<meta name="theme-color" content="#000000"> />'), $(".show-android").removeClass("disabled"), $(".show-blackberry, .show-ios, .show-windows").addClass("disabled"), $("#page-content-scroll, .sidebar-scroll").css("right", "0px")), s.BlackBerry() && ($(".show-blackberry").removeClass("disabled"), $(".show-android, .show-ios, .show-windows").addClass("disabled"), $("#page-content-scroll, .sidebar-scroll").css("right", "0px")), s.iOS() && ($(".show-ios").removeClass("disabled"), $(".show-blackberry, .show-android, .show-windows").addClass("disabled"), $("#page-content-scroll, .sidebar-scroll").css("right", "0px")), s.Windows() && ($(".show-windows").removeClass("disabled"), $(".show-blackberry, .show-ios, .show-android").addClass("disabled"), $("#page-content-scroll, .sidebar-scroll").css("right", "0px")), $(".gallery a, .show-gallery").swipebox();
	var r = $(window).width();
	768 > r && $(".gallery-justified").justifiedGallery({
		rowHeight: 80,
		maxRowHeight: 370,
		margins: 5,
		fixedHeight: !1
	}), r > 768 && $(".gallery-justified").justifiedGallery({
		rowHeight: 150,
		maxRowHeight: 370,
		margins: 5,
		fixedHeight: !1
	}), $(".adaptive-one").click(function() {
		return $(".portfolio-switch").removeClass("active-adaptive"), $(this).addClass("active-adaptive"), $(".portfolio-adaptive").removeClass("portfolio-adaptive-two portfolio-adaptive-three"), $(".portfolio-adaptive").addClass("portfolio-adaptive-one"), !1
	}), $(".adaptive-two").click(function() {
		return $(".portfolio-switch").removeClass("active-adaptive"), $(this).addClass("active-adaptive"), $(".portfolio-adaptive").removeClass("portfolio-adaptive-one portfolio-adaptive-three"), $(".portfolio-adaptive").addClass("portfolio-adaptive-two"), !1
	}), $(".adaptive-three").click(function() {
		return $(".portfolio-switch").removeClass("active-adaptive"), $(this).addClass("active-adaptive"), $(".portfolio-adaptive").removeClass("portfolio-adaptive-two portfolio-adaptive-one"), $(".portfolio-adaptive").addClass("portfolio-adaptive-three"), !1
	}), $(".reminder-check-square").click(function() {
		return $(this).toggleClass("reminder-check-square-selected"), !1
	}), $(".reminder-check-round").click(function() {
		return $(this).toggleClass("reminder-check-round-selected"), !1
	}), $(".checklist-square").click(function() {
		return $(this).toggleClass("checklist-square-selected"), !1
	}), $(".checklist-round").click(function() {
		return $(this).toggleClass("checklist-round-selected"), !1
	}), $(".tasklist-incomplete").click(function() {
		return $(this).removeClass("tasklist-incomplete"), $(this).addClass("tasklist-completed"), !1
	}), $(".tasklist-item").click(function() {
		return $(this).toggleClass("tasklist-completed"), !1
	}), $(".sitemap-box a").hover(function() {
		$(this).find("i").addClass("scale-hover")
	}, function() {
		$(this).find("i").removeClass("scale-hover")
	}), $(".map-text, .overlay").click(function() {
		$(".map-text, .map-fullscreen .overlay").addClass("hide-map"), $(".deactivate-map").removeClass("hide-map")
	}), $(".deactivate-map").click(function() {
		$(".map-text, .map-fullscreen .overlay").removeClass("hide-map"), $(".deactivate-map").addClass("hide-map")
	}), $("#page-content-scroll").on("scroll", function() {
		var e = $("#page-content-scroll")[0].scrollHeight,
			t = $(this).scrollTop() <= 150,
			o = $(this).scrollTop() >= 0;
		$(this).scrollTop() >= e - ($(window).height() + 100);
		1 == t ? $(".back-to-top-badge").removeClass("back-to-top-badge-visible") : 1 == o && $(".back-to-top-badge").addClass("back-to-top-badge-visible")
	}), $(".back-to-top-badge, .back-to-top").click(function(e) {
		e.preventDefault(), $("#page-content-scroll").animate({
			scrollTop: 0
		}, 250)
	});
	var l = new Date,
		n = l.getMonth() + 1,
		c = l.getDate();
	10 > n && (n = "0" + n), 10 > c && (c = "0" + c);
	var d = l.getFullYear() + "-" + n + "-" + c;
	$(".set-today").val(d), $(".adaptive-one").click(function() {
		return $(".portfolio-switch").removeClass("active-adaptive"), $(this).addClass("active-adaptive"), $(".portfolio-adaptive").removeClass("portfolio-adaptive-two portfolio-adaptive-three"), $(".portfolio-adaptive").addClass("portfolio-adaptive-one"), !1
	}), $(".adaptive-two").click(function() {
		return $(".portfolio-switch").removeClass("active-adaptive"), $(this).addClass("active-adaptive"), $(".portfolio-adaptive").removeClass("portfolio-adaptive-one portfolio-adaptive-three"), $(".portfolio-adaptive").addClass("portfolio-adaptive-two"), !1
	}), $(".adaptive-three").click(function() {
		return $(".portfolio-switch").removeClass("active-adaptive"), $(this).addClass("active-adaptive"), $(".portfolio-adaptive").removeClass("portfolio-adaptive-two portfolio-adaptive-one"), $(".portfolio-adaptive").addClass("portfolio-adaptive-three"), !1
	}), $(".show-wide-text").click(function() {
		return $(this).parent().find(".wide-text").slideToggle(200), !1
	}), $(".portfolio-close").click(function() {
		return $(this).parent().parent().find(".wide-text").slideToggle(200), !1
	}), $("body").append('<div class="share-bottom-tap-close"></div>'), $(".show-share-bottom, .show-share-box").click(function() {
		return $(".share-bottom-tap-close").addClass("share-bottom-tap-close-active"), $(".share-bottom").toggleClass("active-share-bottom"), !1
	}), $(".close-share-bottom, .share-bottom-tap-close").click(function() {
		return $(".share-bottom-tap-close").removeClass("share-bottom-tap-close-active"), $(".share-bottom").removeClass("active-share-bottom"), !1
	});
	var p = "";
	if ($(".filter-category").click(function() {
			$(".portfolio-filter-categories a").removeClass("selected-filter"), $(this).addClass("selected-filter"), p = $(this).attr("data-rel"), $(".portfolio-filter-wrapper").slideDown(250), $(".portfolio-filter-wrapper div").not("." + p).delay(100).slideUp(250), setTimeout(function() {
				$("." + p).slideDown(250), $(".portfolio-filter-wrapper").slideDown(250)
			}, 0)
		}), t(), $("body").hasClass("has-cover")) {
		o(), $(window).resize(function() {
			o()
		}), i(), $(".error-page-layout-switch").click(function() {
			$(".cover-page-content").toggleClass("unboxed-layout, boxed-layout"), o()
		})
	}
	$(function() {
		$(".countdown-class").countdown({
			date: "June 7, 2087 15:03:26"
		})
	}), $("#copyright-year")[0] && document.getElementById("copyright-year").appendChild(document.createTextNode((new Date).getFullYear()));
	var h = {
			bg: "#c0392b", // e74c3c
			target: document.getElementById("myDivId"),
			id: "mynano"
		},
		v = new Nanobar(h);
	v.go(30), v.go(100), w();
});