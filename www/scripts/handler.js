// Main application object
var app = {
	// Variables
	binds: [],
	modules: [],
	moduleHelper: { count: 0, list: [] },
	
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
			$(".status-indicator").removeClass("fa-desktop");
			$(".status-indicator").addClass("fa-mobile");
		}
    }
};

// Module binds
app.binds["backend"] = "__lib";
app.binds["sidebar"] = "__lib";
app.binds["sidebar-left"] = ".sidebar-left .sidebar-scroll";
app.binds["sidebar-right"] = ".sidebar-right .sidebar-scroll";
app.binds["strip-content"] = ".large-strip .strip-content";

// Initializer
var gl = {};
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
				
				// Run the load function on each module
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
						
						continue;
					}
					
					// Attempt to load module
					var content = app.modules[key].load();
					if (content)
						$(target + ' div[dynamic="replace"]').replaceWith(content);
				}
				
				// Include extra scripts again
				var src = "scripts/custom.js";
				$('script[src="' + src + '"]').remove();
				$('<script>').attr('src', src).appendTo('head');
			}
		});
	}
	
	// Load the slider
	$("#slider-shape").roundSlider({
		value: 20,
		startAngle: 20,
		endAngle: "+320",
		radius: 70,
		width: 10,
		sliderType: "min-range",
		handleSize: "34,10",
		
		create: function(e) {
			$("#slider-shape").find(".rs-inner").css("background-color", $("#page-content").css("background-color"));
		}
	});
});

// Helper functions
app.moduleHelper.inherit = function(target, namespace) {
	// Save the link between the classes
	app.moduleHelper.list.push([target, namespace]);
}