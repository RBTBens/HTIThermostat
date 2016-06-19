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
			console.error("Fetch error: " + err);
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
	
	// Hook the slider load
	gl.hooks.index = function() {
		var value = gl.getTargetTemperature();
		slider.setValue(value);
		
		// And update the color
		var options = slider.options;
		updateSliderColor((value - options.min) / (options.max - options.min));
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
		slider.setValue(20);
		this.editing = false;
	}
		
}

// Change vacation mode
function changeMode(checkbox) {
	if (checkbox.checked)
	{
		slider.disable();
		slider.setValue(slider.options.min);
		gl.setTargetTemperature(slider.getValue());
		$(".temp-control").addClass("grayed");
	}
	else
	{
		slider.enable();
		$(".temp-control").removeClass("grayed");
	}
}	

// Change layout
function changeDayNight(checkbox) {
	app.changeDayTime(!checkbox.checked);
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

// Requests thermostat
gl.requestThermostat = function() {
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
gl.createThermostat = function() {
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
gl.deleteThermostat = function() {
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

gl.getTargetTemperature = function() {
	var t = gl.thermostat;
	return parseFloat(t.find("target_temperature").text());
}

gl.setTargetTemperature = function(value) {
	var t = gl.thermostat;
	t.find("target_temperature").text(value);
	
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
gl.getWeekProgram = function() {
    return this.requestData('weekProgram', function(data) { return data; });
}

// Uploads a given week program
gl.setWeekProgram = function(obj) {
    this.uploadData('weekProgram', obj);
}