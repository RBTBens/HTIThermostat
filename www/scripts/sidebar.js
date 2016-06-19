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
		this.addMenuItem("Close", "#this", "times", true);
	this.endMenu();

	return this.endTemplate();
}

// Right sidebar
sidebar.loadRightSide = function() {
	this.beginTemplate();
	
	this.addDivider("DEBUGGING");
	this.addMenu();
		this.addMenuItem("Create Thermostat", "#this-createThermostat", "plus-circle");
		this.addMenuItem("Delete Thermostat", "#this-deleteThermostat", "minus-circle");
		this.addMenuItem("Request Thermostat", "#this-requestThermostat", "info-circle");
	this.endMenu();

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