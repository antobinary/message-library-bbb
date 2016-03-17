var globalSocket = null;
var message_library = null;
var redis_channels = null;
var unformattedJsonString = null;

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
    
    socket.on("use_this_json", function (data) {
      // console.log(data.jsonString)
      unformattedJsonString = data.jsonString;
      displayJsonInField();
    });
}

function displayJsonInField() {
  document.getElementById("jsonEditArea").innerHTML = formatJson(unformattedJsonString);
}

function messageTypeOnChange(selectedEventType) {
  console.log(selectedEventType);
  globalSocket.emit("prepare_json_for_event_type", {messageType: selectedEventType});
}

function plugCommonValues() {
  // console.log("unformattedJsonString="+unformattedJsonString);
  var jsonObj = JSON.parse(unformattedJsonString);
  jsonObj.payload.meeting_id = document.getElementById("common_meeting_id").value;
  if(undefined != jsonObj.payload.userid) {
    jsonObj.payload.userid = document.getElementById("common_user_id").value;
  }
  // console.log(jsonObj);
  unformattedJsonString = JSON.stringify(jsonObj);
  displayJsonInField();
}

function sendToRedis() {
  var channelToSendTo = document.getElementById("redisChannelList").value;
  
  //avoid the default option
  if("redis channel" != channelToSendTo) {
    console.log("sending to redis on channel:" + channelToSendTo);
    globalSocket.emit("send_to_redis", {
      "channel": channelToSendTo,
      "json":unformattedJsonString
    });
  }
}