var globalSocket;

var message_library;
var redis_channels;

$(document).ready(function () {
  //connect to correct socket
  var socket = io.connect(window.location.protocol + "//" + window.location.host);
  globalSocket = socket;
  bindEvent(socket);
  

});

/*
 *	binds socket events to button clicks
 *	@param socket - socket object which connects to the server
 */
function bindEvent(socket) {
    socket.on('connected', function () {
        console.log('\n\n**connected');
        socket.emit("requesting_list_events");
        socket.emit("requesting_list_redis_channels");
    });
    //get list_events from the library (on load)
    socket.on("providing_list_events", function (data) {
      console.log("got the list of supported events:" + JSON.stringify(data));
      message_library = data;

      var select = document.getElementById("messageTypeList"); 
      for(var i = 0; i < message_library.length; i++) {
        var opt = message_library[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }
    });

    socket.on("providing_list_redis_channels", function (data) {
      console.log("got the list of redis channels:" + JSON.stringify(data));
      redis_channels = data;
      var select = document.getElementById("redisChannelList"); 
      for(var i = 0; i < redis_channels.length; i++) {
        var opt = redis_channels[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }
    });
    
}
//triggered when a user presses "Send" on any of the event forms
function sendJsonPressed(element) {
  console.log(element);
}
// formatJson() :: formats and indents JSON string FROM http://ketanjetty.com/coldfusion/javascript/format-json/
function formatJson(val) {
    var retval = '';
    var str = val;
    var pos = 0;
    var strLen = str.length;
    var indentStr = '&nbsp;&nbsp;&nbsp;&nbsp;';
    var newLine = '<br />';
    var char = '';

    for (var i = 0; i < strLen; i++) {
        char = str.substring(i, i + 1);

        if (char == '}' || char == ']') {
            retval = retval + newLine;
            pos = pos - 1;

            for (var j = 0; j < pos; j++) {
                retval = retval + indentStr;
            }
        }

        retval = retval + char;

        if (char == '{' || char == '[' || char == ',') {
            retval = retval + newLine;

            if (char == '{' || char == '[') {
                pos = pos + 1;
            }

            for (var k = 0; k < pos; k++) {
                retval = retval + indentStr;
            }
        }
    }

    return retval;
}
//triggered when a user selects what kind of event to be added/displayed
function pickEventFromList(element) {
  console.log("pickEventFromList selected");
  console.log(element);
}
//triggered when the user selects "Clear fields" under the Meeting Info section
function clearMeetingInfo() {
    document.getElementById("common_meeting_name").value = "";
    document.getElementById("common_meeting_id").value = "";
    document.getElementById("common_channel").value = "";
}


function messageTypeOnChange(selectedEventType) {
  console.log(selectedEventType);
  globalSocket.emit("prepare_json_for_event_type", {messageType: selectedEventType});
  
  
}

