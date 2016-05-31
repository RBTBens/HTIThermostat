// Add the object to our module array
var obj = { id: "sidebar-right" };
app.modules[obj.id] = obj;
app.moduleHelper.inherit(obj, "sidebar");

// Variables
obj.vars = true;

// Called when all scripts are ready
obj.load = function() {
	this.beginTemplate();
	this.addDivider("Hey!");
	console.log(getTemplate());
	
	var content = "";
	content += "Hey!";
	content += "<br />My name is peter.";
	
	return content;
}