// Add the object to our module array
var obj = { id: "sidebar-left" };
app.modules[obj.id] = obj;
app.moduleHelper.inherit(obj.id, "sidebar");

// Called when all scripts are ready
obj.load = function() {
	this.beginTemplate();
	
	this.addMenu();
		this.addMenuItem("Homepage", "#index", "home");
		this.addMenuItem("Schedule", "#schedule", "calendar");
		this.addMenuItem("Other Scheduler", "#scheduler", "calendar-plus-o");
		this.addMenuItem("Close", "#this", "times", true);
	this.endMenu();

	return this.endTemplate();
}