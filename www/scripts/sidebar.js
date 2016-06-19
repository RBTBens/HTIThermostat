// Add the object to our module array
var sidebar = {};
sidebar.left = ".sidebar-left .sidebar-scroll";
sidebar.right = ".sidebar-right .sidebar-scroll";

// Called when all scripts are ready
sidebar.load = function() {
	$(this.left + " div[dynamic=\"replace\"]").replaceWith(this.loadLeftSide());
	$(this.right + " div[dynamic=\"replace\"]").replaceWith(this.loadRightSide());
}

// Template functions
sidebar.beginTemplate = function() { this.template = ""; }
sidebar.endTemplate = function() { return this.template; }

// Menu constructors
sidebar.addDivider = function(txt) {
	this.template += '<div class="sidebar-divider">' + txt + '</div>';
}
sidebar.addHeader = function(txt) {
	this.template += '<h3 class="cs-doc">' + txt + '</h3>';
}
sidebar.addText = function(txt) {
	this.template += '<p class="cs-doc">' + txt + '</p>';
}
sidebar.addMenu = function() {
	this.template += '<div class="sidebar-menu">';
}
sidebar.addMenuItem = function(name, target, icon, close) {
	this.template += '<a class="' + (close ? 'close-sidebar ' : '') + 'menu-item" href="' + target + '" onclick="onMenuClick(this)">';
	this.template += '<i class="fa fa-' + icon + '"></i>' + name + '<i class="fa fa-circle"></i></a>';
}
sidebar.addSubMenu = function(name, icon) {
	this.template += '<div class="has-submenu"><a class="menu-item open-submenu" href="#"><i class="fa fa-' + icon + '"></i>' + name + '<i class="fa fa-plus"></i></a><div class="submenu">';
}
sidebar.addSubMenuItem = function(name, target) {
	this.template += '<a class="menu-item" href="' + target + '"><i class="fa fa-angle-right"></i>' + name + '<i class="fa fa-circle"></i></a>';
}
sidebar.endMenu = function() {
	this.template += '</div>';
}
sidebar.endSubMenu = function() {
	this.template += '</div></div>';
}

// Left sidebar
sidebar.loadLeftSide = function() {
	this.beginTemplate();
	
	this.addMenu();
		this.addMenuItem("Homepage", "#index", "home");
		this.addMenuItem("Schedule", "#schedule", "calendar");
	this.endMenu();
	
	this.addDivider("Control");
	
	this.addMenu();
		this.addMenuItem("Create Thermostat", "javascript:gl.createThermostat();", "plus-circle");
		this.addMenuItem("Delete Thermostat", "javascript:gl.deleteThermostat();", "minus-circle");
		this.addMenuItem("Close", "#this", "times", true);
	this.endMenu();

	return this.endTemplate();
}

// Right sidebar
sidebar.loadRightSide = function() {
	this.beginTemplate();
	
	this.addDivider("Thermostat");
	this.addHeader("Adjusting temperature settings");
	this.addText("You can adjust the temperature using either the slider, the plus/minus buttons, or by pressing the temperature indicator in the middle of the slider.");
	this.addText("You can adjust the day and night temperatures by pressing the edit button between the sun and moon indicators. After editing, press the save button to store the new temperatures.");
	this.addHeader("Vacation mode");
	this.addText("Optionally, you can enable vacation mode using the bottom button. This will permanently set the temperature to the lowest possible value until vacation mode is disabled again by pressing the button.");
	this.addHeader("Switch editing");
	this.addText("Press the 'View week program' button to open the switch editor. Here you can set up a program for the thermostat to automatically switch between day and night temperature.");
	
	this.addDivider("Switch editing");
	this.addHeader("Overview");
	this.addText("The overview displays when the thermostat will use the day temperature and night temperature on a given day. Dark-grey indicates night temperature and light-grey indicates day temperature.");
	this.addText("You can use the arrow-buttons to view a different day. You can use the edit button to switch to editing mode.");
	this.addHeader("Editing");
	this.addText("In editing mode, the table shows all switches on the current day. You can change the time of a switch using the hour dropdown menu and the minute slider.");
	this.addText("Pressing the 'clear' button will remove all switches on this day. Pressing the 'add switch' button will add a new switch. Pressing the edit button will allow individual switch removal.");
	this.addText("You can copy the switches of an entire day using the 'copy this schedule' button. You can then paste it in any other day using the 'paste' button.");
	return this.endTemplate();
}

// Item clicking
function onMenuClick(obj) {
	$(".menu-item").each(function() {
		$(this).removeClass("active-item");
	});
	
	$(obj).addClass("active-item");
	
	$("#page-content, .header-fixed, .footer-fixed").removeClass("body-left body-right"), $(".sidebar-left, .sidebar-right, .sidebar-left-fix, .sidebar-right-fix").removeClass("active-sidebar-box"), $(".sidebar-tap-close").removeClass("active-tap-close"), $(".header-fixed").removeClass("hide-header");
}