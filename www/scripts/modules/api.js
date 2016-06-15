// Add the object to our module array
var obj = { id: "api", lib: true };
app.modules[obj.id] = obj;

// Variables
obj.groupId = 20;
obj.url = "http://wwwis.win.tue.nl/2id40-ws/" + obj.groupId + "/";

// Called when all scripts are ready
obj.load = function() {}

/*
 *
 * Server interaction
 * 
*/

// Synchronously fetch data from the server
obj.requestData = function(address, func, as) {
    var result;
    $.ajax({
        type: "get",
        url: this.url + address,
        dataType: "xml",
        async: !!as,
        success: function(data) {
            result = func(data);
        }
    });
	
    return result;
}

// Update the data on the server
obj.uploadData = function(address, xml) {
    $.ajax({
        type: "put",
        url: this.url + address,
        contentType: 'application/xml',
        data: xml,
        async: false
    });
}

// Change XML to be uploadable
obj.parseXml = function(obj) {
	var xml = (new XMLSerializer()).serializeToString(obj);
	xml = xml.replace(' xmlns="http://www.w3.org/1999/xhtml"', '');
	return xml;
}

/*
 *
 * Thermostat Interaction
 *
*/

// Requests thermostat
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

// Create thermostat
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

// Delete thermostat
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

obj.getTargetTemperature = function() {
    return this.requestData('targetTemperature', function(data) {
		return parseFloat($(data).text());
	});
}

obj.setTargetTemperature = function(value) {
	var obj = $("<target_temperature>").text(value);
	var xml = this.parseXml(obj[0]);
	this.uploadData('targetTemperature', xml);
}

/*
 *
 * Week program interaction
 * 
*/

// Gets the current week program
obj.getWeekProgram = function() {
    return this.requestData('weekProgram', function(data) { return data; });
}

// Uploads a given week program
obj.setWeekProgram = function(obj) {
    this.uploadData('weekProgram', obj);
}