// Switches

// Constants
var day = {
	MONDAY: 0,
	TUESDAY: 1,
	WEDNESDAY: 2,
	THURSDAY: 3,
	FRIDAY: 4,
	SATURDAY: 5,
	SUNDAY: 6
}

var DAY = 0;
var NIGHT = 1;

var URL_DAY = "../img/sw_sun.png";
var URL_NIGHT = "../img/sw_moon.png";

var SWITCH_WIDTH = 21;

function createSwitch(pos) {
	var sw = $(document.createElement("div")).attr("class","switch").append($(document.createElement("img")).attr("src",URL_NIGHT));
	sw.css("left", pos);
	
	sw.on('dblclick', function(e) {
        $(this).remove();
    });
	
	return sw;
}

function checkFree(day, pos) {
	var sw = $("div.switch", $("div.switch-inner").eq(day));

	for (var s = 0; s < sw.length; s++) {
		if (Math.abs(sw.eq(s).position().left - pos) < SWITCH_WIDTH) {
			return false;
		}
	}
	
	return true;
}

$(document).ready(function(e) {
	$("div.switch-inner").each(function(day, element) {
        $(this).click(function(e) {
			if ($("div.switch", this).length < 5) {
				var pos = e.pageX - $(this).offset().left - (SWITCH_WIDTH / 2);

				if (checkFree(day, pos) == true) {
					$(this).append(createSwitch(pos));
				}
			}
        });
    });
});