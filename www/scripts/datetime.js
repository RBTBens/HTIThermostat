var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

function date_time(id)
{
	date = new Date;
	year = date.getFullYear();
	month = date.getMonth();
	d = date.getDate();
	day = date.getDay();
	h = date.getHours();
	m = date.getMinutes();
	s = date.getSeconds();
	
	if (h < 10) h = "0" + h;
	if (m < 10) m = "0" + m;
	if (s < 10) s = "0" + s;
	
	result = months[month] + ' ' + d + ' ' + year + ' ' + h + ':' + m;
	
	if ($("#" + id))
		$("#" + id).html(result);
	
	setTimeout('date_time("'+id+'");','1000');
	
	return true;
}