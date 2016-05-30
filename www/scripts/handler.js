var app = {
	// constructor
    initialize: function() {
        this.bindEvents();
    },
	
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
	
	// function delegate
    onDeviceReady: function() {
        app.receivedEvent("deviceready");
    },

	// DOM editing
    receivedEvent: function(id) {
		if (id == "deviceready")
		{
			$(".status-indicator").removeClass("fa-times");
			$(".status-indicator").addClass("fa-check");
		}
		else if (id == "computerready")
		{
			$(".status-indicator").removeClass("fa-times");
			$(".status-indicator").addClass("fa-desktop");
		}
    }
};

$(document).ready(function() {
	// this will get called on load regardless if it's a phone or not (for debugging on PC)
	app.receivedEvent("computerready");
});