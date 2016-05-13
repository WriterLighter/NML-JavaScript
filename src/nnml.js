// たし算モジュールを定義
module.exports = function (t) {
  var s = "";
  var body = t.split("\n");

  body.forEach(function(t) {
    s = s + checkLine(t) + "\n";
  });

  return "<div class=\"page\"><div>" + s + "</div></div>";
}


function checkLine(line) {
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

  return line;
}

//形式段落
function checkSpace(line) {
  if (line.match(/^[ \s]/)) line = "<p>" + line + "</p>";
  return line;
}

//意味段落
function checkReturn(line) {
  if (line === '') line = '</div><div>';
  return line;
}

//ルビ
function checkRuby(line) {
  var myRe = /[\||].*?[\((].*?[\))]/g;
  var myArray;
  while ((myArray = myRe.exec(line)) !== null) {

    var text = myArray[0];

    moji = text.match(/[\||].*?[\((]/)[0];
    moji = moji.substring(1, moji.length - 1);

    ruby = text.match(/[\((].*?[\))]/)[0];
    ruby = ruby.substring(1, ruby.length - 1);

    line = line.replace(text, "<ruby>" + moji + "<rt>" + ruby + "</rt></ruby>");
  }

  return line;
}

//改ページ
function checkNewPage(line) {
  if (line.match(/^[-ー==]{3,}$/)) line = '</div></div><div class="page"><div>';
  return line;
}

//見出し
function checkSharp(line) {
  if ((md = line.match(/^[##]*/)[0]) !== "") {
    var count = md.length > 6 ? 6 : md.length;
    line = line.replace(/^[##]*/, '');
    line = "<h" + count + ">" + line + "</h" + count + ">";
  }
  return line;
}

//打ち消し線
function checkStrikethrough(line) {
  var myRe = /[\~〜]{2}.*?[\~〜]{2}/g;
  var myArray;
  while ((myArray = myRe.exec(line)) !== null) {
    var text = myArray[0];
    line = line.replace(text, "<s>" + text.substring(2, text.length - 2) + "</s>");
  }

  return line;
}

//斜体
function checkItalic(line) {
  var myRe = /[\__**]{1}.*?[\__**]{1}/g;
  var myArray;
  while ((myArray = myRe.exec(line)) !== null) {
    var text = myArray[0];
    if (!text.match(/^[\__**]{2}$/)) line = line.replace(text, "<i>" + text.substring(1, text.length - 1) + "</i>");
  }

  return line;
}

//太字
function checkBold(line) {
  var myRe = /[\__**]{2}.*?[\__**]{2}/g;
  var myArray;
  while ((myArray = myRe.exec(line)) !== null) {
    var text = myArray[0];
    line = line.replace(text, "<b>" + text.substring(2, text.length - 2) + "</b>");
  }

  return line;
}

//引用
function checkBlockquotes(line) {
  if (line.match(/^[>>]/)) line = '<blockquote>' + line.substring(1) + '</blockquote>';
  return line;
}

//リンク/画像
function checkLink(line) {
  var myRe = /[!!]*\[.*?\][\((].*?[\))]/g;
  var myArray;
  while ((myArray = myRe.exec(line)) !== null) {
    var text = myArray[0];

    if (text.match(/[!!]{1,}\[.*?\][\((].*?[\))]/)) {
      if (text.match(/\".*\"/)) {
        linkText = line.match(/\[.*?\]/)[0];
        url = line.match(/[\((].*?[\"]/)[0].replace(/ /g, "");
        name = line.match(/[\"].*?[\"]/)[0];

        linkText = linkText.substring(1, linkText.length - 1);
        url = url.substring(1, url.length - 1);
        name = name.substring(1, name.length - 1);

        line = line.replace(text, "<img src=\"" + url + "\" alt=\"" + linkText + "\" title=\"" + name + "\">");
      } else {
        linkText = line.match(/\[.*?\]/)[0];
        url = line.match(/[\((].*?[\))]/)[0].replace(/ /g, "");

        linkText = linkText.substring(1, linkText.length - 1);
        url = url.substring(1, url.length - 1);

        line = line.replace(text, "<img src=\"" + url + "\" alt=\"" + linkText + "\">");
      }
    } else {
      if (text.match(/\".*\"/)) {
        linkText = line.match(/\[.*?\]/)[0];
        url = line.match(/[\((].*?[\"]/)[0].replace(/ /g, "");
        name = line.match(/[\"].*?[\"]/)[0];

        linkText = linkText.substring(1, linkText.length - 1);
        url = url.substring(1, url.length - 1);
        name = name.substring(1, name.length - 1);

        line = line.replace(text, "<a href=\"" + url + "\" title=\"" + name + "\">" + linkText + "</a>");
      } else {
        linkText = line.match(/\[.*?\]/)[0];
        url = line.match(/[\((].*?[\))]/)[0].replace(/ /g, "");

        linkText = linkText.substring(1, linkText.length - 1);
        url = url.substring(1, url.length - 1);

        line = line.replace(text, "<a href=\"" + url + "\">" + linkText + "</a>");
      }
    }
  }

  return line;
}

//数字区切り
function checkPunctuationNumber(line) {
  if (line.match(/^[0-9]+\.$/)) line = "<hr class=\"number\">";
  return line;
}

//記号区切り
function checkPunctuationSymbol(line) {
  if (line.match(/^[-*ー*]+\.$/)) line = "<hr class=\"symbol\">";
  return line;
}
