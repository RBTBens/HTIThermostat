// Add the object to our module array
var obj = { id: "sidebar" };
app.modules[obj.id] = obj;

// Called when all scripts are ready
obj.load = function() {}

// Template functions
obj.beginTemplate = function() { this.template = ""; }
obj.endTemplate = function() { return this.template; }

// Menu constructors
obj.addDivider = function(txt) {
	this.template += '<div class="sidebar-divider">' + txt + '</div>';
}
obj.addMenu = function() {
	this.template += '<div class="sidebar-menu">';
}
obj.addMenuItem = function(name, target, icon, active, close) {
	this.template += '<a class="' + (close ? 'close-sidebar ' : '') + 'menu-item' + (active ? ' active-item' : '') + '" href="' + target + '">';
	this.template += '<i class="fa fa-' + icon + '"></i>' + name + '<i class="fa fa-circle"></i></a>';
}
obj.addSubMenu = function(name, icon) {
	this.template += '<div class="has-submenu"><a class="menu-item open-submenu" href="#"><i class="fa fa-' + icon + '"></i>' + name + '<i class="fa fa-plus"></i></a><div class="submenu">';
}
obj.addSubMenuItem = function(name, target) {
	this.template += '<a class="menu-item" href="' + target + '"><i class="fa fa-angle-right"></i>' + name + '<i class="fa fa-circle"></i></a>';
}
obj.endMenu = function() {
	this.template += '</div>';
}
obj.endSubMenu = function() {
	this.template += '</div></div>';
}