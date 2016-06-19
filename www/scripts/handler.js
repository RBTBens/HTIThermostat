// Main application object
var app = {
	// Variables
	currentPage: "index",
	isMobile: document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1,
	
	// Constructor
    initialize: function() {
		// Load the loader
		this.loader = $("#loader-overlay").contentloader();
		
		// Load the sidebars
		sidebar.load();
    }
};

// Page requester
app.loadPage = function(page) {
	// Replace the #
	page = page.replace("#", "");
	
	// Check if it's something
	if (page == "")
		page = "index";
		
	// Save the location
	app.currentPage = page;

	// Fetch the data
	$.ajax({
		type: "GET",
		url: "pages/" + page + ".html",
		success: function(html) {
			// Remove all current items except for header-mask
			$("#page-content-scroll").children().each(function() {
				if (!$(this).hasClass("header-mask"))
					$(this).remove();
			});
			
			// Add the new content
			$("#page-content-scroll").append(html);
			
			// Run hooks
			gl.runHooks();
		},
		error: function(jq, txt, err) {
			console.error("Error: " + err);
		}
	});
}

// Time style changing
app.changeDayTime = function(day) {
	if (day)
	{
		$(".header-logo").css("color", "#1F1F1F");
		$(".header-fixed").css("background-color", "#FFF");
		$(".header-fixed").css("color", "#1F1F1F");
		$(".header-fixed a").css("color", "#1F1F1F");
		$("#control-time-indicator").removeClass("fa-moon-o").addClass("fa-sun-o");
	}
	else
	{
		$(".header-logo").css("color", "#FFF");
		$(".header-fixed").css("background-color", "#3B3B3B");
		$(".header-fixed").css("color", "#FFF");
		$(".header-fixed a").css("color", "#FFF");
		$("#control-time-indicator").removeClass("fa-sun-o").addClass("fa-moon-o");
	}
}

// Linking
$(window).bind("hashchange", function() {
	app.loadPage(window.location.hash);
});

// Loading
$(document).ready(function() {
	gl.load();
});