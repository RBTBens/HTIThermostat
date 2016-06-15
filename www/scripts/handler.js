// Main application object
var gl = {};
var app = {
	// Variables
	binds: [],
	modules: [],
	moduleHelper: { count: 0, list: [] },
	currentPage: "index",
	isMobile: document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1,
	
	// Constructor
    initialize: function() {
        this.bindEvents();
    },
	
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
	
	// Function delegate
    onDeviceReady: function() {
        app.receivedEvent("deviceready");
    },

	// DOM editing
    receivedEvent: function(id) {
		if (id == "deviceready")
		{
			
		}
    }
};

// Module binds
app.binds["api"] = "__lib";
app.binds["sidebar"] = "__lib";
app.binds["schedule"] = "__lib";
app.binds["sidebar-left"] = ".sidebar-left .sidebar-scroll";
app.binds["sidebar-right"] = ".sidebar-right .sidebar-scroll";
app.binds["time-indicator"] = ".large-strip.time-indicator";

// Page requester
app.requestPage = function(page) {
	// Replace the #
	page = page.replace("#", "");
	
	// Check if it's something
	if (page == "")
		page = "index";

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
			
			// Load the page!
			app.loadPage();
		},
		error: function(jq, txt, err) {
			console.error("Error: " + err);
		}
	});
}

// Page loader
app.loadPage = function() {
	// Run the load function on each module
	for (key in app.binds)
	{
		// Check the target
		var target = app.binds[key];
		if (target == "__lib")
			continue;
		
		// Attempt to load module
		var content = app.modules[key].load();
		if (content)
			$(target + " div[dynamic=\"replace\"]").replaceWith(content);
	}
	
	// Include extra scripts again
	var src = "scripts/custom.js";
	$("script[src=\"" + src + "\"]").remove();
	$("<script>").attr("src", src).appendTo("head");
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

// Initializer
$(document).ready(function() {
	// Load all modules
	var path = "scripts/modules/";
	for (module in app.binds)
	{
		$.getScript(path + module + ".js").fail(function(err, desc, ex) {
			// Find causing module
			var target = "unknown module";
			for (item in app.binds)
			{
				if (!app.modules[item])
				{
					target = item;
					break;
				}
			}
			
			// Print in console
			console.error("Failed to load module '" + target + "' -> " + ex);
			console.log(err);
		}).done(function() {
			// Check if all modules are loaded
			if (++app.moduleHelper.count >= Object.keys(app.binds).length)
			{
				// Loop over each module
				for (i = 0; i < app.moduleHelper.list.length; i++)
				{
					// Get the value pair
					var pair = app.moduleHelper.list[i];
					
					// Get the stored data
					var obj = app.modules[pair[0]] || {};
					var target = app.modules[pair[1]] || {};
					
					// And find functions to copy
					for (key in target)
					{
						if (key != "load" && $.isFunction(target[key]))
							obj[key] = target[key];
					}
				}
				
				// Load all libraries into gl
				for (key in app.binds)
				{
					// Check the target
					var target = app.binds[key];
					if (target == "__lib")
					{
						if (app.modules[key].lib)
						{
							for (name in app.modules[key])
							{
								if (name != "load")
									gl[name] = app.modules[key][name];
							}
						}
					}
				}
				
				// Run index load
				var loc = window.location.hash;
				app.requestPage(loc == "" ? "#index" : loc);
			}
		});
	}
});

// Linking
$(window).bind("hashchange", function() {
	app.requestPage(window.location.hash);
});

// Helper functions
app.moduleHelper.inherit = function(target, namespace) {
	// Save the link between the classes
	app.moduleHelper.list.push([target, namespace]);
}