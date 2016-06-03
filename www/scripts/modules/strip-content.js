// Add the object to our module array
var obj = { id: "strip-content" };
app.modules[obj.id] = obj;

// Called when all scripts are ready
obj.load = function() {
	var data = '<h1 class="center-text">jQuery rocks!</h1>\
	<p class="center-text">\
		All content is in separate Javascript files, allowing easy modularity.\
		This helps with Git and stimulates simultaneous group work!\
	</p>\
	<a class="large-strip-button" href="#example">Ik vind mooi</a>';

	return data;
}