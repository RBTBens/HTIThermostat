/**
 * Authors: HTI students, Spring 2013, Adjusted by N.Stash
 */
/* Initialization step */
$(document).ready(function() {
	
	$('#getdata').click(function() {
		//update();
		window.setTimeout('update()', 30);
	});

	$('#putdata').click(function() {
		console.log("hey");
		putdata("time", "<time>07:07</time>");
		window.setTimeout('update()', 30);
	});
	
});

var currentDay="Monday";

/* Retrieving data from the server */

function getdata(attribute, callback) {
	$.ajax({
		type: "GET",
		url: "http://wwwis.win.tue.nl/2id40-ws/100/"+attribute,
		dataType: "xml",
		success: function(xml) {
			var val = $(xml).eq(0).text();
			callback(val);
		}
	});
}

function thisisatest() {
	$.ajax({
		type: "PUT",
		url: "http://wwwis.win.tue.nl/2id40-ws/100/",
		success: function(xml) {
			console.log("Yeah sup");
			console.log(xml);
		}
	});
}

/* Uploading data to the server */
function putdata(attribute, content) {			
	$.ajax({
		type: "POST",
		url: "proxy/putData.php",
		data: {attribute: attribute, content: content},
		success: function(data, status) {
			$('#status').text(status+" Data: "+data);
		},
		error: function(xhr, desc, err) {
			console.log(xhr);
			console.log("Details: " + desc + "\nError:" + err);
		}
	});
}

/* Updating data fields */
function update() {
	getdata("day", function(result) {
	        $('#day').text(result);
	});	
	getdata("time", function(result) {
	        $('#time').text(result);
	});		
	getdata("currentTemperature", function(result) {
	        $('#currentTemperature').text(result);
	});	
	getdata("targetTemperature", function(result) {
	        $('#targetTemperature').text(result);
	});		
	getdata("dayTemperature", function(result) {
	        $('#dayTemperature').text(result);
	});					
	getdata("nightTemperature", function(result) {
	        $('#nightTemperature').text(result);
	});	
	getdata("weekProgramState", function(result) {
	        $('#weekProgramState').text(result);
	});		
}