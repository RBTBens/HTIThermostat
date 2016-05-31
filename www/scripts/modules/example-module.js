// Add the object to our module array
var obj = { id: "example-module" };
app.modules[obj.id] = obj;

// Variables
obj.someVariable = "Yes";

// Called when all scripts are ready
obj.load = function() {
	var content = "";
	content += "Example (" + this.someVariable + ")";
	
	console.log("Variable: " + this.someVariable);
	console.log("Function: " + this.someFunction());
	
	return content;
}

// Other functions
obj.someFunction = function() { return "Yeah"; }