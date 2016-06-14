// Constants
var days = {
	Mo: 0,
	Tu: 1,
	We: 2,
	Th: 3,
	Fr: 4,
	Sa: 5,
	Su: 6
}

var daysfull = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Variables
var SWITCH_WIDTH;
var INNER_WIDTH;
var SWITCH_COUNT = 10;

var EDITING = false;

// Images
var URL_DAY = "images/scheduler/sun.png";
var URL_NIGHT = "images/scheduler/moon.png";

// Sets SWITCH_WIDTH and INNER_WIDTH
function setWidths() {
	SWITCH_WIDTH = $(".switch-inner:first").height() / 4;
	INNER_WIDTH = $(".switch-inner:first").width();
}

// Convert position to time
function ptot(pos) {
	var t = (pos/INNER_WIDTH)*24;
	var h = Math.floor(t);
	if (h < 10) h = "0" + h;
	var m = Math.round((t - h) * 60);
	if (m < 10) m = "0" + m;
	return (h + ":" + m);
}

// Convert time to position
function ttop(time) {
	var p = time.indexOf(':');
	var h = parseInt(time.substring(0, p));
	var m = parseInt(time.substring(p+1, time.length));
	return (h/24 + m /1440) * INNER_WIDTH;
}

// Create switches from program
function initSwitches(program) {
	$("day", program).each(function(day) {
		var inner = $(".switch-inner").eq(day);
		
		$("switch", this).each(function(i) {
			if ($(this).attr("state") == "on") {
				inner.append(createSwitch(ttop($(this).text())));
			}
		});
    });
	
	update();
}

// Creates program from switches
function saveSwitches() {
	
	var program = $("<week_program>").attr("state","on");
	
	$(".switch-inner").each(function(day) {

		var d = $("<day>").attr("name",daysfull[day]);
		
		var sws = $(".switch", this);
		
		var l = (10 - sws.length)/2;
		
		for (var i = 0; i < Math.floor(l); i++) {
			d.append($("<switch>").attr("type","day").attr("state","off").text("00:00"));
		}
		
		for (var i = 0; i < Math.ceil(l); i++) {
			d.append($("<switch>").attr("type","night").attr("state","off").text("00:00"));
		}
		
		$(".switch", this).each(function(i) {
			var sw = $("<switch>").attr("type", (i % 2 == 0)?("day"):("night")).attr("state", "on");
			sw.text(ptot(parseInt($(this).css("left"))));
			d.append(sw);
		});
		
		program.append(d);
	});
	
	var xml = new XMLSerializer().serializeToString(program[0]);
	gl.setWeekProgram(xml);
}

// Create a new switch
function createSwitch(pos) {
	// Create the element
	var sw = $(document.createElement("div")).attr("class", "switch").append($(document.createElement("img")));
	sw.css("left", (((pos-(SWITCH_WIDTH/2))/INNER_WIDTH) * 100).toFixed(2) + '%').width(SWITCH_WIDTH);
	
	// Make sure the items aren't instantly removed after being spawned
	setTimeout(function(){
		sw.on("doubletap", function(e) {
			$(this).remove();
		});
		sw.on("taphold", function(e) {
			if ($(".options",this).length > 0) {
				$(".options",this).remove();
				EDITING = false;
			}
			else {
				if (!EDITING) {
					$(this).append(createSwitchMenu($(this)));
					EDITING = true;
				}
			}
		});
	}, 100);

	return sw;
}

// Create an option menu around a switch
function createSwitchMenu(sw) {
	var m = $(document.createElement("div")).attr("class","options");
	
	var rb = $(document.createElement("div")).attr("class","remove-button").on("tap", function(e) {
		sw.remove();
		EDITING = false;
	});
	
	var RB_HEIGHT = 20;
	var RB_WIDTH = 20;
	
	rb.css("top",sw.height() - RB_HEIGHT).css("left",(SWITCH_WIDTH - RB_WIDTH) / 2);
	
	m.append(rb);
	
	return m;
}

// When the document is ready
$(document).ready(function(e) {
	
	// Fill up the container with all days
	for (var day in days) {
		var item = $("<li></li>");
		item.append("<div class=\"day-container\"><div class=\"day\"><h1>" + day + "</h1></div></div>");
		item.append("<div class=\"switch-container\"><div class=\"switch-inner\"></div></div>");
		
		$(".day-list").append(item);
	}
	
	// Determine widths of containers
	setTimeout(function() {
		setWidths();
		initSwitches(gl.getWeekProgram());
	}, 1);
		
	// Also when sizes change
	$(window).on("orientationchange", function(e) {
		setTimeout(function() {setWidths();}, 100);
	});
	
	// Go over the switches
	$(".switch-inner").each(function(day) {
		if (!app.isMobile)
			$(this).on("click", function(e) {
				if (!EDITING) onContainerClick(this, day, e); 
			});
		else 
			$(this).on("doubletap", function(e) {
				if (!EDITING) onContainerClick(this, day, e); 
			});
    });
});

// Switch container click handler
function onContainerClick(container, day, e) {
	var sws = $(".switch", container);
	if (sws.length < SWITCH_COUNT) {
		var pos = e.pageX - $(container).offset().left;
		if (checkFree(day, pos) == true) {
			if (sws.length > 0) {
				var b = false;
				sws.each(function() {
					if (pos < $(this).position().left) {
						b = true;
						$(this).before(createSwitch(pos));
						return false;
					}
				});
				
				if (!b)
					$(container).append(createSwitch(pos));
			} else {
				$(container).append(createSwitch(pos));
			}
			
			update();
		}
	}
}

// Check if we can actually place it here
function checkFree(day, pos) {
	var sw = $(".switch", $(".switch-inner").eq(day));

	for (var s = 0; s < sw.length; s++) {
		if (Math.abs(sw.eq(s).position().left - pos) < SWITCH_WIDTH) {
			return false;
		}
	}
	
	return true;
}

// Update the icons
function update() {
	$(".switch-inner").each(function(day, e) {
        $(".switch",this).each(function(i) {
            if (i % 2 == 0) {
				$("img", this).attr("src", URL_DAY);
			} else {
				$("img", this).attr("src", URL_NIGHT);
			}
        });
    });
}