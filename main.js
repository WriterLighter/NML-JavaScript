NML = require("./out/nml")

function convert() {

  var textarea = document.getElementsByTagName('textarea')[0];

  var novel = new NML(textarea.value)
  var output = document.getElementById("output");
  output.innerHTML = novel.to("html");
}
