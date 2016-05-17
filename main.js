NML = require("./out/nml")

window.convert = function() {

  var textarea = document.getElementsByTagName('textarea')[0];
  var mode = document.getElementById('mode');

  var novel = new NML(textarea.value)
  var output = document.getElementById("output");

  if (mode.options[mode.selectedIndex].value === "htmlpre"){
    $("#output").replaceWith("<div id=\"output\" class=\"out\">" + novel.to("html") + "</div>");
  }else if (mode.options[mode.selectedIndex].value === "html"){
    var text = novel.to(mode.options[mode.selectedIndex].value);
    text = text.replace( /\n/g , "" ) ;
    $("#output").replaceWith("<textarea readonly id=\"output\" class=\"out\">" + format_xml(text) + "</textarea>");
    var pre = document.querySelectorAll('pre');
    for(var i = 0; i < pre.length; i++) {
      pre[i].innerHTML = escapeHtml(pre[i].innerHTML);
    }
  }else{
    $("#output").replaceWith("<div id=\"output\" class=\"out\">" + "<pre>" + novel.to(mode.options[mode.selectedIndex].value) + "</pre>" + "</div>");
  }
}
function spaces(len)
{
	var s = '';
	var indent = len*4;
	for (i=0;i<indent;i++) {s += " ";}

	return s;
}

function format_xml(str)
{
	var xml = '';

	// add newlines
	str = str.replace(/(>)(<)(\/*)/g,"$1\r$2$3");

	// add indents
	var pad = 0;
	var indent;
	var node;

	// split the string
	var strArr = str.split("\r");

	// check the various tag states
	for (var i = 0; i < strArr.length; i++) {
		indent = 0;
		node = strArr[i];

		if(node.match(/.+<\/\w[^>]*>$/)){ //open and closing in the same line
			indent = 0;
		} else if(node.match(/^<\/\w/)){ // closing tag
			if (pad > 0){pad -= 1;}
		} else if (node.match(/^<\w[^>]*[^\/]>.*$/)){ //opening tag
			indent = 1;
		} else
			indent = 0;
		//}

		xml += spaces(pad) + node + "\r";
		pad += indent;
	}

	return xml;
}

var escapeHtml = (function (String) {
  var escapeMap = {
    '&': '&amp;',
    "'": '&#x27;',
    '`': '&#x60;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;'
  };
  var escapeReg = '[';
  var reg;
  for (var p in escapeMap) {
    if (escapeMap.hasOwnProperty(p)) {
      escapeReg += p;
    }
  }
  escapeReg += ']';
  reg = new RegExp(escapeReg, 'g');
  return function escapeHtml (str) {
    str = (str === null || str === undefined) ? '' : '' + str;
    return str.replace(reg, function (match) {
      return escapeMap[match];
    });
  };
}(String));


$(function(){
  convert();
});

$(function(){
  $("#textarea").bind("keyup", function(){
    convert();
  });
});
