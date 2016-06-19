// Add the object to our module array
var schedule = { mode: 0 };

// Constants
var MAX_SWITCHES = 10;
var MAX_HOURS = 24;
var MAX_MINUTES = 59;
var LIST_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Variables
schedule.day = 0;
schedule.copy = -1;
schedule.switchId = 0;

// Get the program object
schedule.getProgram = function() {
	return gl.thermostat.find("week_program");
}

// Append switches
schedule.appendSwitch = function() {	
	var id = this.switchId;
	if (id >= MAX_SWITCHES)
		return;
	
	var hour = id;
	var $prev = $("#schedule-control tbody tr:last-child td:first-child select");
	if ($prev.length > 0)
		hour = parseInt($prev.val()) + 1;
	
	this.addSwitch(pad(hour) + ":00");
	this.saveSwitches();
}

// Adds a switch at a given time
schedule.addSwitch = function(time) {
	// Parse time
	var digits = time.split(":");
	var hour = parseInt(digits[0]);
	var mins = parseInt(digits[1]);
	
	var self = this;
	var id = this.switchId;
	var item = $("<tr>").attr("data-id", id).addClass("schedule-row");
	item.append($("<td>").html('<select class="schedule-hour">' + this.getHours(hour) + '</select>'));
	item.append($("<td>").html('<input type="range" class="schedule-slider" min="0" max="' + MAX_MINUTES + '" value="' + mins + '">'));
	item.append($("<td>").html('<span class="slider-display">' + pad(hour) + ':' + pad(mins) + '</span> <i class="fa fa-' + (id % 2 == 0 ? 'sun' : 'moon') + '-o schedule-icon"></i>'));
	$("#schedule-control").append(item);
	
	$(".schedule-hour").unbind();
	$(".schedule-hour").on("change", function() {
		var min = $(this).parent().next().find(".schedule-slider").val();
		var val = $(this).val();
		$(this).parent().parent().find(".slider-display").html(pad(val) + ":" + pad(min));
		
		self.validatePositions();
		self.saveSwitches();
		self.updateOverview();
	});
	
	$(".schedule-slider").unbind();
	$(".schedule-slider").on("change mousemove touchmove", function(e) {
		var hour = $(this).parent().prev().find(".schedule-hour").val();
		var val = $(this).val();
		$(this).parent().parent().find(".slider-display").html(pad(hour) + ":" + pad(val));
		
		if (e.type == "change") {
			self.validatePositions();
			self.saveSwitches();
		}
	});
	
	$(".schedule-icon").unbind();
	$(".schedule-icon").click(function() {
		if ($(this).hasClass("fa-times")) {
			self.removeSwitch($(this).parent().parent().attr("data-id"), true);
		}
	});
	
	$(".schedule-none").addClass("schedule-hidden");
	$(".schedule-headers").removeClass("schedule-hidden");
	
	this.reassignIcons();
	this.switchId++;
}

// Removes a specific switch
schedule.removeSwitch = function(id, save) {
	$(".schedule-row[data-id=" + id + "]").remove();
	$(".schedule-row").each(function(i) {
		$(this).attr("data-id", i);
	});
	
	this.switchId--;
	this.reassignIcons();
	
	if (save)
		this.saveSwitches();
}

// Load all switches
schedule.loadSwitches = function(day) {
	var d = this.day;
	if (day >= 0)
		d = day;
	
	$("switch", $("day", this.getProgram()).eq(d)).each(function(i) {
		if ($(this).attr("state") == "on") {
			schedule.addSwitch($(this).text());
		}
	});

	// Update
	this.validatePositions();
	this.updateOverview();
}

// Saves the switches to the server
schedule.saveSwitches = function(force) {
	// Create the container
	var day = $("<day>").attr("name", LIST_DAYS[this.day]);
	
	// Check count
	if ($(".schedule-row").length == 0 && !force)
		return;
	
	// Iterate over our data rows
	$(".schedule-row").each(function(i) {
		day.append($("<switch>").attr("type", i % 2 == 0 ? "day" : "night").attr("state", "on").text(schedule.getTimestamp($(this), true)));
	});
	
	// Calculate current items
	var days = $(day).find("switch[type=day]").length;
	var nights = $(day).find("switch[type=night]").length;
	
	// Fill up with blanks
	for (i = 0; i < (MAX_SWITCHES / 2) - days; i++) day.append($("<switch>").attr("type", "day").attr("state", "off").text("00:00"));
	for (i = 0; i < (MAX_SWITCHES / 2) - nights; i++) day.append($("<switch>").attr("type", "night").attr("state", "off").text("00:00"));
	
	// Replace existing day with our new day setting
	$("day[name=" + LIST_DAYS[this.day] + "]", this.getProgram()).eq(0).replaceWith(day);
	var xml = gl.parseXml(this.getProgram()[0]);
	gl.setWeekProgram(xml);
	
	this.updateOverview();
}

// Resets all switches
schedule.resetSwitches = function() {
	$(".schedule-row").remove();
	$(".schedule-none").removeClass("schedule-hidden");
	$(".schedule-headers").addClass("schedule-hidden");
	
	this.switchId = 0;
}

// Reloads the icons to match with the order
schedule.reassignIcons = function() {
	$(".schedule-row").each(function(i) {
		var $icon = $(this).find(".schedule-icon");
		$icon.removeClass("fa-sun-o");
		$icon.removeClass("fa-moon-o");
		$icon.addClass("fa-" + (i % 2 == 0 ? "sun" : "moon") + "-o");
	});
}

// Validates the positions of each row
schedule.validatePositions = function() {
	var data = [];
	var self = this;
	$(".schedule-row").each(function(i) {
		data[i] = { id: i, time: self.getTimestamp($(this)) };
	});
	
	var lastVal;
	for (i = 0; i < this.switchId; i++) {
		if (!data[i])
			return;
		
		if (data[i].time == lastVal) {
			this.removeSwitch(i);
			navigator.notification.alert("Colliding switch! Removed one of the two duplicates.");
			
			return;
		}
		
		lastVal = data[i].time;
	}
	
	data.sort(function(a, b) {
		if (a.time < b.time)
			return -1;
		if (a.time > b.time)
			return 1;
		
		return 0;
	});
	
	var shuffle = false;
	for (i = 0; i < this.switchId; i++) {
		if (i != data[i].id)
			shuffle = true;
	}
	
	if (shuffle)
	{
		for (i = 0; i < this.switchId; i++) {
			data[i].obj = $(".schedule-row[data-id=" + data[i].id + "]").detach();
		}
		
		for (i = 0; i < this.switchId; i++) {
			$("#schedule-control").append(data[i].obj);
		}
		
		$(".schedule-row").each(function(i) {
			$(this).attr("data-id", i);
		});
		
		this.reassignIcons();
	}
}

// Changes the day displayed
schedule.switchDay = function(dir) {
	this.saveSwitches();
	this.day += dir;
	
	if (this.day < 0)
		this.day = LIST_DAYS.length - 1;
	else if (this.day >= LIST_DAYS.length)
		this.day = 0;
	
	$(".schedule-day span").html(LIST_DAYS[this.day]);
	
	this.resetSwitches();
	this.loadSwitches(-1);
	
	if (schedule.mode == 0)
		$(".schedule-row").addClass("hidden-imp");
}

// Resets a full day
schedule.resetDay = function() {
	var y = confirm("Are you sure? This action can not be undone.");
	
	if (y) {
		this.resetSwitches();
		this.saveSwitches(true);
	}
}

// Copies a day
schedule.copyDay = function() {
	if (this.copy == -1)
		$(".schedule-buttons a:last").removeClass("button-grey").addClass("button-red");
	
	this.copy = this.day;
}

// Pastes a day
schedule.pasteDay = function() {
	if (this.copy != -1) {
		this.resetSwitches();
		this.loadSwitches(this.copy);
		this.saveSwitches(true);
	}
}

// Toggles editing mode
schedule.toggleEdit = function() {
	if (!this.editing)
	{
		navigator.notification.alert("You can now remove switches by pressing the 'x' on the right of an item.");
		$(".schedule-icon").attr("class", "fa fa-times schedule-icon");
		this.editing = true;
	}
	else
	{
		this.reassignIcons();
		this.editing = false;
	}
}

// Updates the whole overview
schedule.updateOverview = function() {
	var sws = $(".schedule-row");
	var ov = $(".schedule-overview td ul li");
	
	ov.removeClass("on");
	
	sws.each(function() {
		var h = $("select", this).val();
		ov.eq(h).addClass("on");
    });
	
	// Night = 0, day = 1
	var t = 0;
	
	ov.each(function() {
		if (t == 0) {
			if ($(this).hasClass("on")) {
				t = 1 - t;
				$(this).attr("class", "nd");
			}
			else {
				$(this).attr("class", "n");
			}
		}
		else {
			if ($(this).hasClass("on")) {
				t = 1 - t;
				$(this).attr("class", "dn");
			}
			else {
				$(this).attr("class", "d");
			}
		}
	});
}

// Construction functions
schedule.getTimestamp = function(item, format) {
	var $hour = item.find(".schedule-hour");
	var $min = item.find(".schedule-slider");
	
	if (format)
		return pad(parseInt($hour.val())) + ":" + pad(parseInt($min.val()));
	else
		return parseInt($hour.val()) * 60 + parseInt($min.val());
}

// Gets all hours for in combo boxes
schedule.getHours = function(sel) {
	if (sel < 0 || sel >= MAX_HOURS)
		sel = 0;
	
	var ret = "";
	for (i = 0; i < MAX_HOURS; i++)
		ret += '<option value="' + i + '"' + (i == sel ? 'selected' : '') + '>' + pad(i) + ':00</option>';
	
	return ret;
}

function pad(n) {
	return (n < 10) ? ("0" + n) : n;
}