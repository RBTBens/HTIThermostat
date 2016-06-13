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

// Variables
var SWITCH_WIDTH;
var SWITCH_COUNT = 10;

var EDITING = false;

// Images
var URL_DAY = "images/scheduler/sun.png";
var URL_NIGHT = "images/scheduler/moon.png";

// Create a new switch
function createSwitch(pos) {
	// Create the element
	var sw = $(document.createElement("div")).attr("class", "switch").append($(document.createElement("img")));
	sw.css("left", pos).width(SWITCH_WIDTH);
	
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

// Switch container click handler
function onContainerClick(container, day, e) {
	var sws = $(".switch", container);
	if (sws.length < SWITCH_COUNT) {
		var pos = e.pageX - $(container).offset().left - (SWITCH_WIDTH / 2);
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

// Fill up the container with alll days
for (var day in days) {
	var item = $("<li></li>");
	item.append("<div class=\"day-container\"><div class=\"day\"><h1>" + day + "</h1></div></div>");
	item.append("<div class=\"switch-container\"><div class=\"switch-inner\"></div></div>");
	
	$(".day-list").append(item);
}

// When the document is ready
$(document).ready(function(e) {
	
	// Determine switch width (4 = ratio height:width)
	// Timeout fixes bug where height() is 0.
	setTimeout(function() {
		SWITCH_WIDTH = $(".switch-inner:first").height() / 4;
	}, 1);
	
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