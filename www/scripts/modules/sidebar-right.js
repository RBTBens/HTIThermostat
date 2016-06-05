// Add the object to our module array
var obj = { id: "sidebar-right" };
app.modules[obj.id] = obj;
app.moduleHelper.inherit(obj.id, "sidebar");

// Called when all scripts are ready
obj.load = function() {
	this.beginTemplate();
	
	this.addDivider("DEBUGGING");
	this.addMenu();
		this.addMenuItem("Create Thermostat", "#this-createThermostat", "plus-circle");
		this.addMenuItem("Delete Thermostat", "#this-deleteThermostat", "minus-circle");
		this.addMenuItem("Request Thermostat", "#this-requestThermostat", "info-circle");
	this.endMenu();

	return this.endTemplate();
}