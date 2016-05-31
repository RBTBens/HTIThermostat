// JavaScript Document

var switches = [
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

var offset = 50;

$(document).ready(function(e) {
	
	$(".switch-inner").each(function(index, element) {
        $(this).click(function(e) {
			var sw = $('<div class="switch">');
            $(this).append(sw);
			sw.css({left: e.pageX - $(this).offset().left}).css({top: e.pageY - $(this).offset().top});
        });
    });
	
	
	/*
	$(".switch-inner").each(function(day, element) {
		
		$(this).append("<ul>");
		var ul = $("ul", this);
		for (var i = 0; i < 24; i++) ul.append("<li>");
		
	});
	*/
});

function update() {
	$(".switch-inner ul").each(function(day, e) {
        
		var t = 0; // Night
		
		$("li", this).each(function(hour, element) {
			if (switches[day][hour] == 1) {
				t = 1 - t; // Switch
				$(this).css('background-color','#DD6F00');
			}
			else {
	            if (t == 0) {
					$(this).css('background-color','#00C');
				}
				else {
					$(this).css('background-color','#0CF');
				}
			}
        });
		
    }); 
}