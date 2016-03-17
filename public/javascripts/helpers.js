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

//triggered when a user presses "Send" on any of the event forms
function sendJsonPressed(element) {
  console.log(element);
}

//triggered when the user selects "Clear fields" under the Meeting Info section
function clearMeetingInfo() {
  document.getElementById("common_meeting_id").value = "";
  document.getElementById("common_user_id").value = "";
}
