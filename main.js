NML = require("./out/nml")

window.convert = function() {

  var textarea = document.getElementsByTagName('textarea')[0];
  var mode = document.getElementById('mode');

  var novel = new NML(textarea.value)
  var output = document.getElementById("output");

  if (mode.options[mode.selectedIndex].value === "plain"){
    output.innerHTML = "<pre>" + novel.to(mode.options[mode.selectedIndex].value) + "</pre>";
  }else{
    output.innerHTML = novel.to(mode.options[mode.selectedIndex].value);
  }


}

$(function(){
  convert();
});

$(function(){
  $("#textarea").bind("keyup", function(){
    convert();
  });
});
