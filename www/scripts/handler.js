// Main application object
var app = {
	// Variables
	binds: [],
	modules: [],
	moduleHelper: { count: 0, list: {} },
	
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
app.binds["sidebar"] = "__lib";
app.binds["sidebar-right"] = ".sidebar-right .sidebar-scroll";

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
				for (obj in app.moduleHelper.list)
				{
					console.log("Object: " + obj.id);
					// Get the stored data
					var name = app.moduleHelper.list[obj];
					var target = app.modules[name] || {};
					
					// And find functions to copy
					for (key in target)
					{
						if (key != "load" && $.isFunction(target[key]))
						{
							obj[key] = target[key];
							console.log("From " + obj.id + " (" + key + ") to " + target.id + " (" + key + ")");
						}
					}
				}
				
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
						$(target + ' div[dynamic="replace"]').replaceWith(content);
				}
			}
		});
	}
});

// Helper functions
app.moduleHelper.inherit = function(target, namespace) {
	// Save the inheritance
	app.moduleHelper.list[target] = namespace;
	console.log(app.moduleHelper.list);
	console.log(target.id);
}