module.exports = class @NML

  mode = 0
  # mode
  # 1:html
  # 2:plain

  constructor: (@text) ->

  to: (t) ->
    switch t
      when "html"
        mode = 1
        s = ''
        body = @text.split('\n')
        body.forEach (@text) ->
          s = s + checkLine(@text) + '\n'
        return '<div class="page"><div>' + s + '</div></div>'
      when "plain"
        mode = 2
        s = ''
        body = @text.split('\n')
        body.forEach (@text) ->
          s = s + checkLine(@text) + '\n'
        return s
      else
        "Error!"

  checkLine = (line) ->
    line = checkSpace(line)
    line = checkReturn(line)
    line = checkRuby(line)
    line = checkNewPage(line)
    line = checkSharp(line)
    line = checkStrikethrough(line)
    line = checkItalic(line)
    line = checkBold(line)
    line = checkBlockquotes(line)
    line = checkLink(line)
    line = checkPunctuationNumber(line)
    line = checkPunctuationSymbol(line)
    line = checkNextLine(line)
    line

  #形式段落
  checkSpace = (line) ->
    if line.match(/^[ \s]/)
      if mode is 1
        line = '<p>' + line + '</p>'
    line

  #意味段落
  checkReturn = (line) ->
    if line is ''
      if mode is 1
        line = '</div><div>'
    line

  #ルビ
  checkRuby = (line) ->
    myRe = /[\||].*?[\((].*?[\))]/g
    myArray = undefined
    while (myArray = myRe.exec(line)) != null
      text = myArray[0]
      if mode is 1
        moji = text.match(/[\||].*?[\((]/)[0]
        moji = moji.substring(1, moji.length - 1)
        ruby = text.match(/[\((].*?[\))]/)[0]
        ruby = ruby.substring(1, ruby.length - 1)
        line = line.replace(text, '<ruby>' + moji + '<rt>' + ruby + '</rt></ruby>')
      else
        moji = text.match(/[\||].*?[\((]/)[0]
        moji = moji.substring(1, moji.length - 1)
        line = line.replace(text, moji)
    line

  #改ページ
  checkNewPage = (line) ->
    if line.match(/^[-ーis]{3,}$/)
      if mode is 1
        line = '</div></div><div class="page"><div>'
      else if mode is 2
        line = ''
    line

  #見出し
  checkSharp = (line) ->
    if mode is 1
      md = undefined
      if (md = line.match(/^[##]*/)[0]) != ''
        count = if md.length > 6 then 6 else md.length
        line = line.replace(/^[##]*/, '')
        line = '<h' + count + '>' + line + '</h' + count + '>'
    else if mode is 2
      line = line.replace(/^[##]*/, '')
    line

  #打ち消し線
  checkStrikethrough = (line) ->
    myRe = /[\~〜]{2}.*?[\~〜]{2}/g
    myArray = undefined
    while (myArray = myRe.exec(line)) != null
      text = myArray[0]
      if mode is 1
        line = line.replace(text, '<s>' + text.substring(2, text.length - 2) + '</s>')
      else if mode is 2
        line = line.replace(text, text.substring(2, text.length - 2))
    line

  #斜体

  checkItalic = (line) ->
    myRe = /[\__**]{1}.*?[\__**]{1}/g
    myArray = undefined
    while (myArray = myRe.exec(line)) != null
      text = myArray[0]
      if mode is 1
        if !text.match(/^[\__**]{2}$/)
          line = line.replace(text, '<i>' + text.substring(1, text.length - 1) + '</i>')
      else if mode is 2
        if !text.match(/^[\__**]{2}$/)
          line = line.replace(text, text.substring(1, text.length - 1))
    line

  #太字
  checkBold = (line) ->
    myRe = /[\__**]{2}.*?[\__**]{2}/g
    myArray = undefined
    while (myArray = myRe.exec(line)) != null
      text = myArray[0]
      if mode is 1
        line = line.replace(text, '<b>' + text.substring(2, text.length - 2) + '</b>')
      else if mode is 2
        line = line.replace(text, text.substring(2, text.length - 2))
    line

  #引用
  checkBlockquotes = (line) ->
    if line.match(/^[>>]/)
      if mode is 1
        line = '<blockquote>' + line.substring(1) + '</blockquote>'
    line

  #リンク/画像
  checkLink = (line) ->
    myRe = /[!!]*\[.*?\][\((].*?[\))]/g
    myArray = undefined
    while (myArray = myRe.exec(line)) != null
      text = myArray[0]
      if text.match(/[!!]{1,}\[.*?\][\((].*?[\))]/)
        if mode is 1
          if text.match(/\".*\"/)
            linkText = line.match(/\[.*?\]/)[0]
            url = line.match(/[\((].*?[\"]/)[0].replace(RegExp(' ', 'g'), '')
            name = line.match(/[\"].*?[\"]/)[0]
            linkText = linkText.substring(1, linkText.length - 1)
            url = url.substring(1, url.length - 1)
            name = name.substring(1, name.length - 1)
            line = line.replace(text, '<img src="' + url + '" alt="' + linkText + '" title="' + name + '">')
          else
            linkText = line.match(/\[.*?\]/)[0]
            url = line.match(/[\((].*?[\))]/)[0].replace(RegExp(' ', 'g'), '')
            linkText = linkText.substring(1, linkText.length - 1)
            url = url.substring(1, url.length - 1)
            line = line.replace(text, '<img src="' + url + '" alt="' + linkText + '">')
        else if mode is 2
          line = line.replace(text, "")

      else
        if mode is 1
          if text.match(/\".*\"/)
            linkText = line.match(/\[.*?\]/)[0]
            url = line.match(/[\((].*?[\"]/)[0].replace(RegExp(' ', 'g'), '')
            name = line.match(/[\"].*?[\"]/)[0]
            linkText = linkText.substring(1, linkText.length - 1)
            url = url.substring(1, url.length - 1)
            name = name.substring(1, name.length - 1)
            line = line.replace(text, '<a href="' + url + '" title="' + name + '">' + linkText + '</a>')
          else
            linkText = line.match(/\[.*?\]/)[0]
            url = line.match(/[\((].*?[\))]/)[0].replace(RegExp(' ', 'g'), '')
            linkText = linkText.substring(1, linkText.length - 1)
            url = url.substring(1, url.length - 1)
            line = line.replace(text, '<a href="' + url + '">' + linkText + '</a>')
        else if mode is 2
          line = line.replace(text, "")
    line

  #数字区切り
  checkPunctuationNumber = (line) ->
    if line.match(/^[0-9]+\.$/)
      if mode is 1
        line = '<hr class="number">'
    line

  #記号区切り
  checkPunctuationSymbol = (line) ->
    if line.match(/^[-*ー*]+\.$/)
      if mode is 1
        line = '<hr class="symbol">'
    line

  #改行
  checkNextLine = (line) ->
    if line.match(/[ \s]{3,}$/)
      line = line + "<br>"
    line
