// Add the object to our module array
var obj = { id: "backend", lib: true };
app.modules[obj.id] = obj;

// Variables
obj.groupId = 20;
obj.url = "http://wwwis.win.tue.nl/2id40-ws/" + obj.groupId + "/";

// Called when all scripts are ready
obj.load = function() {}

// Requests
obj.requestThermostat = function() {
	$.ajax({
		type: "GET",
		url: this.url,
		dataType: "xml",
		success: function(xml) {
			$(xml).find("thermostat").children().each(function() {
				var key = this.tagName;
				var value = $(this).text();
				
				if (key == "week_program")
				{
					$(this).find("day").each(function() {
						var day = $(this).attr("name");
						$(this).children().each(function() {
							console.log($(this).attr("type") + " - " + $(this).attr("state") + " -> " + $(this).text());
						});
					});
				}
				else
					console.log("[" + key + "] -> " + value);
			});
			
			navigator.notification.alert("Check your console for the data!");
		},
		error: function(jq, txt, err) {
			navigator.notification.alert("Error: " + err);
		}
	});
}

// Create
obj.createThermostat = function() {
	$.ajax({
		type: "PUT",
		url: this.url,
		success: function(xml) {
			var parse = $(xml).eq(0).text();
			if (parse == "Created")
				navigator.notification.alert("Thermostat created!");
			else
				navigator.notification.alert("Failed to create thermostat; it might already exist");
		}
	});
}

// Delete
obj.deleteThermostat = function() {
	$.ajax({
		type: "DELETE",
		url: this.url,
		success: function(xml) {
			var parse = $(xml).eq(0).text();
			if (parse == "OK")
				navigator.notification.alert("Thermostat deleted!");
			else
				navigator.notification.alert("Failed to delete thermostat; it might already be gone");
		}
	});
}