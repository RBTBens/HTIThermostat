function fetchWeekProgram(callback) {
	$.ajax({
		type: "GET",
		url: "http://wwwis.win.tue.nl/2id40-ws/100/weekProgram",
		dataType: "xml",
		success: callback
	});
}

function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    alert(out);
}

function tswitch(type, state, hour, minute) {
	this.type = type;
	this.state = state;
	this.hour = hour;
	this.minute = minute;
}

function getNextSwitches(count) {
	if (count == undefined || count == null) count = 2;
	
	var next = new Array();
	if (got_weekProgram && got_time && got_date && got_state) {
		if (setting_state == "on") {
			var time = setting_time.split(":");
			var switches = setting_weekProgram[setting_date];
			var s;
			for (var i = 0; i < switches.length; i++) {
				s = switches[i];
				if ((s.hour > time[0]) || (s.hour == time[0] && s.minute > time[1])) {
					if (next.length < count) next.push(s);
					if (next.length == count) break;
				}
			}
		}
	}
	
	var newhtml = "";
	for (var i = 0; i < next.length; i++) {
		newhtml += "<div class=\"change\"><div class=\"change_image ";
		if (next[i].type == "day") newhtml += "sun";
		else newhtml += "moon";
		newhtml += "></div><div class=\"change_label\">";
		
		if (next[i].hour <= 9) nexthtml += "\xa0\xa0";
		nexthtml += next[i].hour + ":" + next[i].minute + " &rarr; ";
		if (next[i].type == "day") newhtml += setting_daytemp;
		else newhtml += setting_nighttemp;
		newhtml += " &deg;C</div></div>";
	}
	$("#home_changes").html(newhtml);
}