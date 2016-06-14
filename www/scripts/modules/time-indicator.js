// Add the object to our module array
var obj = { id: "time-indicator" };
app.modules[obj.id] = obj;

// Called when all scripts are ready
obj.load = function() {
	var data = '\
	<div class="strip-content">\
		<h1 class="center-text">Settings</h1>\
		<p class="center-text">Change thermostat settings.</p>\
		<a class="large-strip-button" href="#scheduler">View week program</a>\
	</div>\
	\
	<div class="overlay"></div>\
	<img class="strip-image" src="images/pictures/day.jpg" alt="img" />';
	
	this.loadThermostatState();

	return data;
}

obj.loadThermostatState = function() {
	// Run backend request here to check what state we're in
}