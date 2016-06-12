// Switches

// Constants
var days = {
	Monday: 0,
	Tuesday: 1,
	Wednesday: 2,
	Thursday: 3,
	Friday: 4,
	Saturday: 5,
	Sunday: 6
}

var DAY = 0;
var NIGHT = 1;
var SWITCH_WIDTH = 21;

var URL_DAY = "images/scheduler/sun.png";
var URL_NIGHT = "images/scheduler/moon.png";

function createSwitch(pos) {
	var sw = $(document.createElement("div")).attr("class", "switch").append($(document.createElement("img")).attr("src", URL_NIGHT));
	sw.css("left", pos);
	sw.on("tap", function(e) {
        $(this).remove();
    });
	
	return sw;
}

function checkFree(day, pos) {
	var sw = $(".switch", $(".switch-inner").eq(day));

	for (var s = 0; s < sw.length; s++) {
		if (Math.abs(sw.eq(s).position().left - pos) < SWITCH_WIDTH) {
			return false;
		}
	}
	
	return true;
}

$(document).ready(function(e) {
	for (var day in days) {
		var item = $("<li></li>");
		item.append("<div class=\"day-container\"><div class=\"day\"><h1>" + day + "</h1></div></div>");
		item.append("<div class=\"switch-container\"><div class=\"switch-inner\"></div></div>");
		
		$(".day-list").append(item);
	}
	
	$(".switch-inner").each(function(day, element) {
        $(this).on("doubletap", function(e) {
			if ($(".switch", this).length < 5) {
				var pos = e.pageX - $(this).offset().left - (SWITCH_WIDTH / 2);

				if (checkFree(day, pos) == true && pos > 10) {
					$(this).append(createSwitch(pos));
				}
			}
        });
    });
});