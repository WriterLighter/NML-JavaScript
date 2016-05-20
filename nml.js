(function() {
  module.exports = this.NML = (function() {
    var checkBlockquotes, checkBold, checkItalic, checkLine, checkLink, checkNewPage, checkNextLine, checkPunctuationNumber, checkPunctuationSymbol, checkReturn, checkRuby, checkSharp, checkSpace, checkStrikethrough, mode, multi_line, multi_line_mode;

    mode = 0;

    multi_line = "";

    multi_line_mode = 0;

    function NML(text1) {
      this.text = text1;
    }

    NML.prototype.to = function(t) {
      var body, s;
      switch (t) {
        case "html":
          mode = 1;
          s = '';
          body = this.text.split('\n');
          body.forEach(function(text1) {
            this.text = text1;
            return s = s + checkLine(this.text) + '\n';
          });
          return '<div class="page"><div>' + s + '</div></div>';
        case "plain":
          mode = 2;
          s = '';
          body = this.text.split('\n');
          body.forEach(function(text1) {
            this.text = text1;
            return s = s + checkLine(this.text) + '\n';
          });
          return s;
        default:
          return "Error!";
      }
    };

    checkLine = function(line) {
      line = checkSpace(line);
      line = checkReturn(line);
      line = checkRuby(line);
      line = checkNewPage(line);
      line = checkSharp(line);
      line = checkStrikethrough(line);
      line = checkItalic(line);
      line = checkBold(line);
      line = checkBlockquotes(line);
      line = checkLink(line);
      line = checkPunctuationNumber(line);
      line = checkPunctuationSymbol(line);
      line = checkNextLine(line);
      return line;
    };

    checkSpace = function(line) {
      if (line.match(/^[ \s]/)) {
        if (mode === 1) {
          line = '<p>' + line + '</p>';
        }
      }
      return line;
    };

    checkReturn = function(line) {
      if (line === '') {
        if (mode === 1) {
          line = '</div><div>';
        }
      }
      return line;
    };

    checkRuby = function(line) {
      var moji, myArray, myRe, ruby, text;
      myRe = /[\||].*?[\((].*?[\))]/g;
      myArray = void 0;
      while ((myArray = myRe.exec(line)) !== null) {
        text = myArray[0];
        if (mode === 1) {
          moji = text.match(/[\||].*?[\((]/)[0];
          moji = moji.substring(1, moji.length - 1);
          ruby = text.match(/[\((].*?[\))]/)[0];
          ruby = ruby.substring(1, ruby.length - 1);
          line = line.replace(text, '<ruby>' + moji + '<rt>' + ruby + '</rt></ruby>');
        } else {
          moji = text.match(/[\||].*?[\((]/)[0];
          moji = moji.substring(1, moji.length - 1);
          line = line.replace(text, moji);
        }
      }
      return line;
    };

    checkNewPage = function(line) {
      if (line.match(/^[-ーis]{3,}$/)) {
        if (mode === 1) {
          line = '</div></div><div class="page"><div>';
        } else if (mode === 2) {
          line = '';
        }
      }
      return line;
    };

    checkSharp = function(line) {
      var count, md;
      if (mode === 1) {
        md = void 0;
        if ((md = line.match(/^[##]*/)[0]) !== '') {
          count = md.length > 6 ? 6 : md.length;
          line = line.replace(/^[##]*/, '');
          line = '<h' + count + '>' + line + '</h' + count + '>';
        }
      } else if (mode === 2) {
        line = line.replace(/^[##]*/, '');
      }
      return line;
    };

    checkStrikethrough = function(line) {
      var myArray, myRe, text;
      myRe = /[\~〜]{2}.*?[\~〜]{2}/g;
      myArray = void 0;
      while ((myArray = myRe.exec(line)) !== null) {
        text = myArray[0];
        if (mode === 1) {
          line = line.replace(text, '<s>' + text.substring(2, text.length - 2) + '</s>');
        } else if (mode === 2) {
          line = line.replace(text, text.substring(2, text.length - 2));
        }
      }
      return line;
    };

    checkItalic = function(line) {
      var myArray, myRe, text;
      myRe = /[\__**]{1}.*?[\__**]{1}/g;
      myArray = void 0;
      while ((myArray = myRe.exec(line)) !== null) {
        text = myArray[0];
        if (mode === 1) {
          if (!text.match(/^[\__**]{2}$/)) {
            line = line.replace(text, '<i>' + text.substring(1, text.length - 1) + '</i>');
          }
        } else if (mode === 2) {
          if (!text.match(/^[\__**]{2}$/)) {
            line = line.replace(text, text.substring(1, text.length - 1));
          }
        }
      }
      return line;
    };

    checkBold = function(line) {
      var myArray, myRe, text;
      myRe = /[\__**]{2}.*?[\__**]{2}/g;
      myArray = void 0;
      while ((myArray = myRe.exec(line)) !== null) {
        text = myArray[0];
        if (mode === 1) {
          line = line.replace(text, '<b>' + text.substring(2, text.length - 2) + '</b>');
        } else if (mode === 2) {
          line = line.replace(text, text.substring(2, text.length - 2));
        }
      }
      return line;
    };

    checkBlockquotes = function(line) {
      if (line.match(/^[>>]/)) {
        if (mode === 1) {
          line = '<blockquote>' + line.substring(1) + '</blockquote>';
        }
      }
      return line;
    };

    checkLink = function(line) {
      var linkText, myArray, myRe, name, text, url;
      myRe = /[!!]*\[.*?\][\((].*?[\))]/g;
      myArray = void 0;
      while ((myArray = myRe.exec(line)) !== null) {
        text = myArray[0];
        if (text.match(/[!!]{1,}\[.*?\][\((].*?[\))]/)) {
          if (mode === 1) {
            if (text.match(/\".*\"/)) {
              linkText = line.match(/\[.*?\]/)[0];
              url = line.match(/[\((].*?[\"]/)[0].replace(RegExp(' ', 'g'), '');
              name = line.match(/[\"].*?[\"]/)[0];
              linkText = linkText.substring(1, linkText.length - 1);
              url = url.substring(1, url.length - 1);
              name = name.substring(1, name.length - 1);
              line = line.replace(text, '<img src="' + url + '" alt="' + linkText + '" title="' + name + '"/>');
            } else {
              linkText = line.match(/\[.*?\]/)[0];
              url = line.match(/[\((].*?[\))]/)[0].replace(RegExp(' ', 'g'), '');
              linkText = linkText.substring(1, linkText.length - 1);
              url = url.substring(1, url.length - 1);
              line = line.replace(text, '<img src="' + url + '" alt="' + linkText + '"/>');
            }
          } else if (mode === 2) {
            line = line.replace(text, "");
          }
        } else {
          if (mode === 1) {
            if (text.match(/\".*\"/)) {
              linkText = line.match(/\[.*?\]/)[0];
              url = line.match(/[\((].*?[\"]/)[0].replace(RegExp(' ', 'g'), '');
              name = line.match(/[\"].*?[\"]/)[0];
              linkText = linkText.substring(1, linkText.length - 1);
              url = url.substring(1, url.length - 1);
              name = name.substring(1, name.length - 1);
              line = line.replace(text, '<a href="' + url + '" title="' + name + '">' + linkText + '</a>');
            } else {
              linkText = line.match(/\[.*?\]/)[0];
              url = line.match(/[\((].*?[\))]/)[0].replace(RegExp(' ', 'g'), '');
              linkText = linkText.substring(1, linkText.length - 1);
              url = url.substring(1, url.length - 1);
              line = line.replace(text, '<a href="' + url + '">' + linkText + '</a>');
            }
          } else if (mode === 2) {
            line = line.replace(text, "");
          }
        }
      }
      return line;
    };

    checkPunctuationNumber = function(line) {
      if (line.match(/^[0-9]+\.$/)) {
        if (mode === 1) {
          line = '<hr class="number"/>';
        }
      }
      return line;
    };

    checkPunctuationSymbol = function(line) {
      if (line.match(/^[-*ー*]+\.$/)) {
        if (mode === 1) {
          line = '<hr class="symbol"/>';
        }
      }
      return line;
    };

    checkNextLine = function(line) {
      if (line.match(/[ \s]{3,}$/)) {
        line = line + "<br/>";
      }
      return line;
    };

    return NML;

  })();

}).call(this);
