// Add the object to our module array
var gl = {};
var slider;
gl.hooks = {};

// Variables
gl.groupId = 20;
gl.url = "http://wwwis.win.tue.nl/2id40-ws/" + gl.groupId + "/";
gl.defaultXml = '<thermostat><current_day>Monday</current_day><time>00:00</time><current_temperature>21.0</current_temperature><target_temperature>21.0</target_temperature><day_temperature>21.0</day_temperature><night_temperature>21.0</night_temperature><week_program_state>on</week_program_state><week_program state="on"><day name="Monday"><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch></day><day name="Tuesday"><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch></day><day name="Wednesday"><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch></day><day name="Thursday"><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch></day><day name="Friday"><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch></day><day name="Saturday"><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch></day><day name="Sunday"><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="night" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch><switch type="day" state="off">00:00</switch></day></week_program></thermostat>';

/*
 *
 * Server interaction
 * 
*/

// Starting point
gl.load = function() {
	$.ajax({
		type: "get",
		url: this.url,
		dataType: "xml",
		success: function(data) {
			if (!data)
				data = $.parseXML(gl.defaultXml);
			
			gl.parseData(data);
		},
		error: function(jq, txt, err) {
			app.loader.close();
			
			alert("The thermostat is currently not active. Create your thermostat by using the top left menu and pressing 'Create Thermostat'.");
		}
	});
	
	gl.loadHomepage();
}

// Synchronously fetch data from the server
gl.requestData = function(address, func, as) {
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
gl.uploadData = function(address, xml) {
    $.ajax({
        type: "put",
        url: this.url + address,
        contentType: 'application/xml',
        data: xml,
        async: false
    });
}

// Change XML to be uploadable
gl.parseXml = function(obj) {
	var xml = (new XMLSerializer()).serializeToString(obj);
	xml = xml.replace(' xmlns="http://www.w3.org/1999/xhtml"', '');
	return xml;
}

// Parse the received XML data
gl.parseData = function(data) {
	// Close the loader
	app.loader.close();
	
	// Find thermostat
	$obj = $(data);
	$main = $obj.find("thermostat");
	
	// Set thermostat
	gl.thermostat = $main;
	
	// Load hooks
	gl.runHooks();
	
	// Check if we have a custom starting page
	if (app.firstPage)
		app.loadPage(app.firstPage);
	
	// Check the time
	var time = $main.find("time");
	var arr = time.text().split(":");
	var hour = parseInt(arr[0]);
	app.changeDayTime(hour >= 6);
}

// Run the hooks
gl.runHooks = function() {
	// Trigger hooks
	for (var hook in gl.hooks) {
		if (hook == app.currentPage)
			gl.hooks[hook]();
	}
}

/*
 *
 * Index Interaction
 *
*/

gl.loadHomepage = function() {
	$("#slider-shape").roundSlider({
		value: 0,
		min: 5,
		max: 30,
		step: 0.1,
		startAngle: 20,
		endAngle: "+320",
		radius: 70,
		width: 20,
		sliderType: "min-range",
		handleSize: "34,10",
		tooltipFormat: function(args) {
			return args.value + " &deg;C";
		},
		drag: function(args) {
			updateSliderColor((args.value - args.options.min) / (args.options.max - args.options.min));
		},
		change: function(args) {
			gl.setTargetTemperature(args.value);
			updateSliderColor((args.value - args.options.min) / (args.options.max - args.options.min));
		}
	});
	
	// Get the slider object
	slider = $("#slider-shape").data("roundSlider");
	
	// Initialize the timer
	date_time("date_time");
	
	// Hook the slider load
	gl.hooks.index = function() {
		// Load homepage beforehand
		gl.loadHomepage();
		
		var value = gl.getTargetTemperature();
		slider.setValue(value);
		
		// And update the color
		var options = slider.options;
		updateSliderColor((value - options.min) / (options.max - options.min));
		
		// Now get the temperatures
		$("#inputdegree").val(gl.getTargetTemperature("night"));
		$("#inputdegree2").val(gl.getTargetTemperature("day"));
	}
}

function changeValue(dir) {
	if (slider._isReadOnly) return;
	slider.setValue(slider.getValue() + dir);
	gl.setTargetTemperature(slider.getValue());
	updateSliderColor((slider.getValue() - slider.options.min) / (slider.options.max - slider.options.min));
}

// Change day and night temperature (same for the whole week)
function editTempDayNight(edit) {
	if (!this.editing)
	{
		$("#temp-icon").removeClass("fa-pencil").addClass("fa-floppy-o");
		$("#inputdegree").removeAttr("readonly");
		$("#inputdegree2").removeAttr("readonly");
		$(".daynight-control").addClass("input");
		this.editing = true;
	}
	else
	{
		$("#temp-icon").removeClass("fa-floppy-o").addClass("fa-pencil");
		document.getElementById('inputdegree').readOnly = true;
		document.getElementById('inputdegree2').readOnly = true;
		$(".daynight-control").removeClass("input");
		this.editing = false;
		
		gl.setTargetTemperature($("#inputdegree").val(), "night");
		gl.setTargetTemperature($("#inputdegree2").val(), "day");
	}
		
}

// Change vacation mode
function changeMode(checkbox) {
	if (checkbox.checked)
	{
		slider.disable();
		slider.setValue(slider.options.min);
		$("#inputdegree").val(slider.getValue());
		$("#inputdegree2").val(slider.getValue());
		
		gl.setTargetTemperature(slider.getValue());
		gl.setTargetTemperature(slider.getValue(), "night");
		gl.setTargetTemperature(slider.getValue(), "day");
		
		$(".temp-control").addClass("grayed");
	}
	else
	{
		slider.enable();
		$(".temp-control").removeClass("grayed");
	}
}

// Update the color
function updateSliderColor(p) {
	if (!p && !slider) return;
	p = p || (slider.getValue() - slider.options.min) / (slider.options.max - slider.options.min);
	var lerp = function(a, b, p) { return (1 - p) * a + p * b; };
	$(".rs-range-color").css("background-color", "rgb(" + Math.round(lerp(43, 192, p)) + "," + Math.round(lerp(178, 57, p)) + "," + Math.round(lerp(192, 43, p)) + ")");
}

/*
 *
 * Thermostat Interaction
 *
*/

// Create thermostat
gl.createThermostat = function() {
	$.ajax({
		type: "PUT",
		url: this.url,
		success: function(xml) {
			var parse = $(xml).eq(0).text();
			if (parse == "Created")
			{
				navigator.notification.alert("Thermostat created!");
				window.location.reload();
			}
			else
				navigator.notification.alert("Failed to create thermostat; it might already exist");
		}
	});
}

// Delete thermostat
gl.deleteThermostat = function() {
	$.ajax({
		type: "DELETE",
		url: this.url,
		success: function(xml) {
			var parse = $(xml).eq(0).text();
			if (parse == "OK")
			{
				navigator.notification.alert("Thermostat deleted!");
				window.location.reload();
			}
			else
				navigator.notification.alert("Failed to delete thermostat; it might already be gone");
		}
	});
}

// Gets the target temperature
gl.getTargetTemperature = function(item) {
	var t = gl.thermostat;
	item = item || "target";
	return parseFloat(t.find(item + "_temperature").text());
}

// Sets the target temperature
gl.setTargetTemperature = function(value, item) {
	var t = gl.thermostat;
	item = item || "target";
	t.find(item + "_temperature").text(value);
	
	var obj = $("<" + item + "_temperature>").text(value);
	var xml = this.parseXml(obj[0]);
	this.uploadData(item + "Temperature", xml);
}

/*
 *
 * Week program interaction
 * 
*/

// Gets the current week program
gl.getWeekProgram = function() {
    return this.requestData('weekProgram', function(data) { return data; });
}

// Uploads a given week program
gl.setWeekProgram = function(obj) {
    this.uploadData('weekProgram', obj);
}