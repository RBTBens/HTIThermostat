// Switches

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

var SWITCH_WIDTH;
var SWITCH_COUNT = 10;

var URL_DAY = "images/scheduler/sun.png";
var URL_NIGHT = "images/scheduler/moon.png";

function createSwitch(pos) {
	var sw = $(document.createElement("div")).attr("class", "switch").append($(document.createElement("img")));
	sw.css("left", pos).width(SWITCH_WIDTH);
	sw.on("tap", function(e) {
		$(this).remove();
    });
	sw.on("taphold", function(e) {
		$(this).css("background-color","#069");
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

function update() {
	$(".switch-inner").each(function(day, e) {
        $(".switch",this).each(function(i) {
            if (i % 2 == 0) {
				$("img",this).attr("src",URL_DAY);
			}
			else {
				$("img",this).attr("src",URL_NIGHT);
			}
        });
    });
}

$(document).ready(function(e) {
	
	for (var day in days) {
		var item = $("<li></li>");
		item.append("<div class=\"day-container\"><div class=\"day\"><h1>" + day + "</h1></div></div>");
		item.append("<div class=\"switch-container\"><div class=\"switch-inner\"></div></div>");
		
		$(".day-list").append(item);
	}
	
	// Determine switch width
	SWITCH_WIDTH = $(".switch-inner:first").height()/4;
	
	$(".switch-inner").each(function(day) {
        $(this).on("doubletap", function(e) {
			
			var sws = $(".switch", this);
			
			if (sws.length < SWITCH_COUNT) {
				var pos = e.pageX - $(this).offset().left - (SWITCH_WIDTH / 2);

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
						
						if (!b) $(this).append(createSwitch(pos));
					}
					else {
						$(this).append(createSwitch(pos));
					}
					update();
				}
			}
        });
    });
});