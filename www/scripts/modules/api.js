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
obj.requestData = function(address, func) {
    var result;
    $.ajax({
        type: "get",
        url: this.url + address,
        dataType: "xml",
        async: false,
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

// Recreates the default week program
obj.setDefaultProgram = function() {
    var doc = document.implementation.createDocument(null, null, null);
    var program = doc.createElement('week_program');
    program.setAttribute('state', ProgramState ? 'on' : 'off');
    for (var key in Program) {
        var day = doc.createElement('day');
        day.setAttribute('name', key);

        var daySwitches = [];
        var nightSwitches = [];

        var i, text, sw;

        for (i = 0; i < obj.switches; i++) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', 'night');
            sw.setAttribute('state', 'off');
            text = doc.createTextNode('00:00');
            sw.appendChild(text);
            day.appendChild(sw);
        }

        for (i = 0; i < obj.switches; i++) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', 'day');
            sw.setAttribute('state', 'off');
            text = doc.createTextNode('00:00');
            sw.appendChild(text);
            day.appendChild(sw);
        }

        program.appendChild(day);
    }
    doc.appendChild(program);
    this.uploadData('weekProgram', (new XMLSerializer()).serializeToString(doc));
}