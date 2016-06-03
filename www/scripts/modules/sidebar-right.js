// Add the object to our module array
var obj = { id: "sidebar-right" };
app.modules[obj.id] = obj;
app.moduleHelper.inherit(obj.id, "sidebar");

// Called when all scripts are ready
obj.load = function() {
	this.beginTemplate();
	
	this.addDivider("DEBUGGING");
	this.addMenu();
		this.addMenuItem("Create Thermostat", "#func-createThermostat", "plus-circle");
		this.addMenuItem("Delete Thermostat", "#func-deleteThermostat", "minus-circle");
		this.addMenuItem("Request Thermostat", "#func-requestThermostat", "info-circle");
	this.endMenu();

	return this.endTemplate();
}