(function() {
  this.NML = (function() {
    function NML(text) {
      this.text = text;
    }

    NML.prototype.to = function(t) {
      return console.log(t);
    };

    return NML;

  })();

}).call(this);
