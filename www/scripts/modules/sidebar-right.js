// Add the object to our module array
var obj = { id: "sidebar-right" };
app.modules[obj.id] = obj;
app.moduleHelper.inherit(obj.id, "sidebar");

// Called when all scripts are ready
obj.load = function() {
	this.beginTemplate();
	
	this.addDivider("LET'S GET SOCIAL");
	this.addMenu();
		this.addMenuItem("Facebook", "#", "facebook");
		this.addMenuItem("Twitter", "#", "twitter");
		this.addMenuItem("Google+", "#", "google-plus");
	this.endMenu();
	
	this.addDivider("GET IN TOUCH");
	this.addMenu();
		this.addMenuItem("Call Us", "#", "phone");
		this.addMenuItem("Fax Us", "#", "fax");
		this.addMenuItem("Mail Us", "#", "envelope-o");
	this.endMenu();
	
	this.addDivider("THE END");
	
	return this.endTemplate();
}