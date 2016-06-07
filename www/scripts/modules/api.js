// Add the object to our module array
var obj = { id: "api", lib: true };
app.modules[obj.id] = obj;

// Variables
obj.groupId = 20;
obj.url = "http://wwwis.win.tue.nl/2id40-ws/" + obj.groupId + "/";

// Settings
obj.state = true;
obj.switches = 5;
obj.program = {
	Monday: [],
	Tuesday: [],
	Wednesday: [],
	Thursday: [],
	Friday: [],
	Saturday: [],
	Sunday: []
};

// Called when all scripts are ready
obj.load = function() {}

/*
 *
 * Server interaction
 * 
*/

// Synchronously fetch data from the server
obj.requestData = function(address, func) {
    var result;
    $.ajax({
        type: "get",
        url: obj.url + address,
        dataType: "xml",
        async: false,
        success: function(data) {
            result = func(data);
        }
    });
	
    return result;
}

// Update the data on the server
obj.uploadData = function(address, xml) {
    $.ajax({
        type: "put",
        url: obj.url + address,
        contentType: 'application/xml',
        data: xml,
        async: false
    });
}

// Retrieves data from the server as specified
/* To-Do: Not used!
function get(attribute_name, xml_tag) {
    return obj.requestData(
        "/"+attribute_name,
        function(data) {
            return $(data).find(xml_tag).text();
        }
    );
}
*/

// Uploads data to the server as specified
/* To-Do: Not currently used!
function put(attribute_name, xml_tag, value){
    obj.uploadData("/"+attribute_name, "<" + xml_tag + ">"+ value + "</" + xml_tag + ">");
}
*/


/*
 *
 * Data interaction
 * 
*/

// Get the current program
function getProgram(day) {
    return obj.program[day];
}





/* Sorts the heating periods (the periods when the heating is on) and merges overlapping ones
*/
function sortMergeProgram(day) {
    var program = getProgram(day);
    program.sort(function(a, b){return parseTime(a[0])-parseTime(b[0])});
    for (var i = 0; i < program.length - 1; i++) {
        if (parseTime(program[i][1]) >= parseTime(program[i+1][0])) {
            var start = (program[i][0]);
            var end = (parseTime(program[i][1]) > parseTime(program[i+1][1])) ? program[i][1] : program[i+1][1];
            program.splice(i, 2);
            program.push([start, end]);
            sortMergeProgram(day);
            break;
        }
    }
}

/* Retrieves the week program
*/
function getWeekProgram() {
    return obj.requestData(
        '/weekProgram',
        function(data) {
            $(data).find('day').each(function() {
                var day = $(this).attr('name');
                Program[day] = [];
                $(this).find('switch').each(function() {
                    if ($(this).attr('state') == 'on') {
                        if ($(this).attr('type') == 'day') {
                            getProgram(day).push([$(this).text(), '00:00']);
                        } else {
                            getProgram(day)[getProgram(day).length - 1][1] = $(this).text();
                        }
                    }
                })
            });
            return Program;
        }
    );
}

/* Uploads the week program
*/
function setWeekProgram() {
    var doc = document.implementation.createDocument(null, null, null);
    var program = doc.createElement('week_program');
    program.setAttribute('state', ProgramState ? 'on' : 'off');
    for (var key in Program) {
        var day = doc.createElement('day');
        day.setAttribute('name', key);

        var daySwitches = [];
        var nightSwitches = [];

        var i, text, sw;
        var periods = getProgram(key);
        for (i = 0; i < periods.length; i++ ) {
            daySwitches.push(periods[i][0]);
            nightSwitches.push(periods[i][1]);
        }

        for (i = 0; i < obj.switches; i++) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', 'day');

            if (i < daySwitches.length) {
                sw.setAttribute('state', 'on');
                text = doc.createTextNode(daySwitches[i]);
            } else {
                sw.setAttribute('state', 'off');
                text = doc.createTextNode('00:00');
            }
            sw.appendChild(text);
            day.appendChild(sw);
        }

        for (i = 0; i < obj.switches; i++ ) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', 'night');

            if (i < nightSwitches.length) {
                sw.setAttribute('state', 'on');
                text = doc.createTextNode(nightSwitches[i]);
            } else {
                sw.setAttribute('state', 'off');
                text = doc.createTextNode('00:00');
            }
            sw.appendChild(text);
            day.appendChild(sw);
        }
        program.appendChild(day);
    }
    doc.appendChild(program);
    obj.uploadData('/weekProgram', (new XMLSerializer()).serializeToString(doc));
}

/* Creates the default week program
*/
function setDefault() {
    var doc = document.implementation.createDocument(null, null, null);
    var program = doc.createElement('week_program');
    program.setAttribute('state', ProgramState ? 'on' : 'off');
    for (var key in Program) {
        var day = doc.createElement('day');
        day.setAttribute('name', key);

        var daySwitches = [];
        var nightSwitches = [];

        var i, text, sw;

        for (i = 0; i < obj.switches; i++) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', 'night');
            sw.setAttribute('state', 'off');
            text = doc.createTextNode('00:00');
            sw.appendChild(text);
            day.appendChild(sw);
        }

        for (i = 0; i < obj.switches; i++) {
            sw = doc.createElement('switch');
            sw.setAttribute('type', 'day');
            sw.setAttribute('state', 'off');
            text = doc.createTextNode('00:00');
            sw.appendChild(text);
            day.appendChild(sw);
        }

        program.appendChild(day);
    }
    doc.appendChild(program);
    obj.uploadData('/weekProgram', (new XMLSerializer()).serializeToString(doc));
}

function parseTime(t) {
    return parseFloat(t.substr(0,2)) + parseFloat(t.substr(3,2))/60;
}

/* Adds a heating period for a specific day
*/
function addPeriod(day, start, end) {
    var program = getWeekProgram()[day];
    program.push([start, end]);
    sortMergeProgram(day);
    setWeekProgram();
}

/* Removes a heating period from a specific day.
   idx is the idex of the period with values from 0 to 4
*/
function removePeriod(day, idx) {
    var program = getWeekProgram()[day];
    var start = program[idx][0];
    var end = program[idx][1];
    program.splice(idx,1);
    setWeekProgram();
}