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
        url: this.url + address,
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
        url: this.url + address,
        contentType: 'application/xml',
        data: xml,
        async: false
    });
}

/*
 *
 * Data interaction
 * 
*/

// Get the current program
obj.getProgram = function(day) {
    return this.program[day];
}

// Sorts and merges the heating periods
obj.sortMergeProgram = function(day) {
    var program = this.getProgram(day);
    program.sort(function(a, b){return parseTime(a[0])-parseTime(b[0])});
    for (var i = 0; i < program.length - 1; i++) {
        if (parseTime(program[i][1]) >= parseTime(program[i+1][0])) {
            var start = (program[i][0]);
            var end = (parseTime(program[i][1]) > parseTime(program[i+1][1])) ? program[i][1] : program[i+1][1];
            program.splice(i, 2);
            program.push([start, end]);
            this.sortMergeProgram(day);
            break;
        }
    }
}

// Gets the current week program
obj.getWeekProgram = function() {
    return this.requestData(
        '/weekProgram',
        function(data) {
            $(data).find('day').each(function() {
                var day = $(this).attr('name');
                Program[day] = [];
                $(this).find('switch').each(function() {
                    if ($(this).attr('state') == 'on') {
                        if ($(this).attr('type') == 'day') {
                            this.getProgram(day).push([$(this).text(), '00:00']);
                        } else {
                            this.getProgram(day)[this.getProgram(day).length - 1][1] = $(this).text();
                        }
                    }
                })
            });
            return Program;
        }
    );
}

// Uploads a given week program
obj.setWeekProgram = function(obj) {
    this.uploadData('/weekProgram', obj);
}

// Recreates the default week program
obj.setDefaultProgram = function() {
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
    this.uploadData('/weekProgram', (new XMLSerializer()).serializeToString(doc));
}

// Simple time parsing function
function parseTime(t) {
    return parseFloat(t.substr(0,2)) + parseFloat(t.substr(3,2))/60;
}