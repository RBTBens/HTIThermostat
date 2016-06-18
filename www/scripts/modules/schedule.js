// Add the object to our module array
var obj = { id: "schedule", lib: true };
app.modules[obj.id] = obj;

// Constants
var MAX_SWITCHES = 10;
var MAX_HOURS = 24;
var MAX_MINUTES = 59;
var LIST_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Variables
obj.xml = "";
obj.day = 0;
obj.switchId = 0;

// Called when all scripts are ready
obj.load = function() {}

// Append switches
obj.appendSwitch = function() {	
	var id = this.switchId;
	if (id >= MAX_SWITCHES)
		return;
	
	var hour = id;
	var $prev = $("#schedule-control tbody tr.schedule:last-of-type td:first-child select");
	if ($prev.length > 0)
		hour = parseInt($prev.val()) + 1;
	
	this.addSwitch(pad(hour) + ":00");
	this.saveSwitches();
}

obj.addSwitch = function(time) {
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
	$("#schedule-control .schedule-buttons").before(item);
	
	$(".schedule-hour").unbind();
	$(".schedule-hour").on("change", function() {
		var min = $(this).parent().next().find(".schedule-slider").val();
		var val = $(this).val();
		$(this).parent().parent().find(".slider-display").html(pad(val) + ":" + pad(min));
		
		self.validatePositions();
		self.saveSwitches();
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
	
	updateOverview();
	this.reassignIcons();
	this.switchId++;
}

obj.removeSwitch = function(id, save) {
	$(".schedule-row[data-id=" + id + "]").remove();
	$(".schedule-row").each(function(i) {
		$(this).attr("data-id", i);
	});
	
	this.switchId--;
	this.reassignIcons();
	
	if (save)
		this.saveSwitches();
}

obj.loadSwitches = function(data) {
	var cur = this;
	var self = app.modules[this.id];
	if (data)
		self.xml = data;
	
	$("switch", $("day", self.xml).eq(this.day)).each(function(i) {
		if ($(this).attr("state") == "on") {
			cur.addSwitch($(this).text());
		}
	});

	// Update
	this.validatePositions();
}

obj.saveSwitches = function(force) {
	// Create the container
	var self = app.modules[this.id];
	var day = $("<day>").attr("name", LIST_DAYS[this.day]);
	
	// Check count
	if ($(".schedule-row").length == 0 && !force)
		return;
	
	// Iterate over our data rows
	$(".schedule-row").each(function(i) {
		day.append($("<switch>").attr("type", i % 2 == 0 ? "day" : "night").attr("state", "on").text(self.getTimestamp($(this), true)));
	});
	
	// Calculate current items
	var days = $(day).find("switch[type=day]").length;
	var nights = $(day).find("switch[type=night]").length;
	
	// Fill up with blanks
	for (i = 0; i < (MAX_SWITCHES / 2) - days; i++) day.append($("<switch>").attr("type", "day").attr("state", "off").text("00:00"));
	for (i = 0; i < (MAX_SWITCHES / 2) - nights; i++) day.append($("<switch>").attr("type", "night").attr("state", "off").text("00:00"));
	
	// Replace existing day with our new day setting
	$("day[name=" + LIST_DAYS[this.day] + "]", self.xml).eq(0).replaceWith(day);
	var xml = gl.parseXml(self.xml);
	gl.setWeekProgram(xml);
}

obj.resetSwitches = function() {
	$(".schedule-row").remove();
	$(".schedule-none").removeClass("schedule-hidden");
	$(".schedule-headers").addClass("schedule-hidden");
	
	this.switchId = 0;
}

obj.reassignIcons = function() {
	$(".schedule-row").each(function(i) {
		var $icon = $(this).find(".schedule-icon");
		$icon.removeClass("fa-sun-o");
		$icon.removeClass("fa-moon-o");
		$icon.addClass("fa-" + (i % 2 == 0 ? "sun" : "moon") + "-o");
	});
}

obj.validatePositions = function() {
	var data = [];
	var self = this;
	$(".schedule-row").each(function(i) {
		data[i] = { id: i, time: self.getTimestamp($(this)) };
	});
	
	var lastVal;
	for (i = 0; i < this.switchId; i++) {
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
			$("#schedule-control .schedule-buttons").before(data[i].obj);
		}
		
		$(".schedule-row").each(function(i) {
			$(this).attr("data-id", i);
		});
		
		this.reassignIcons();
	}
}

obj.switchDay = function(dir, mode) {
	this.saveSwitches();
	this.day += dir;
	
	if (this.day < 0)
		this.day = LIST_DAYS.length - 1;
	else if (this.day >= LIST_DAYS.length)
		this.day = 0;
	
	$(".schedule-day").html(LIST_DAYS[this.day]);
	
	this.resetSwitches();
	this.loadSwitches();
	
	if (mode == 0) $(".schedule-row").addClass("hidden-imp");
	updateOverview();
}

obj.resetDay = function() {
	this.resetSwitches();
	this.saveSwitches(true);
	updateOverview();
}

obj.toggleEdit = function() {
	if (!this.editing)
	{
		$(".schedule-icon").attr("class", "fa fa-times schedule-icon");
		this.editing = true;
	}
	else
	{
		this.reassignIcons();
		this.editing = false;
	}
}

updateOverview = function() {
	var sws = $(".schedule-row");
	var ov = $(".schedule-overview td ul li");
	
	ov.removeClass("on");
	
	sws.each(function() {
		var h = $("select", this).val();
		ov.eq(h).addClass("on");
    });
}

// Construction functions
obj.getTimestamp = function(item, format) {
	var $hour = item.find(".schedule-hour");
	var $min = item.find(".schedule-slider");
	
	if (format)
		return pad(parseInt($hour.val())) + ":" + pad(parseInt($min.val()));
	else
		return parseInt($hour.val()) * 60 + parseInt($min.val());
}

obj.getHours = function(sel) {
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