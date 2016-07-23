/**
 * Created by cgspine on 16/7/23.
 */
import browser from '../dom/browser'

var reunescapeHTML = /&(?:amp|lt|gt|quot|#39|#96);/g
var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
}
export function unescapeHTML(string) {
    var str = '' + string
    return str.replace(reunescapeHTML, function (c) {
        return htmlUnescapes[c]
    })
}

var rescapeHTML = /["'&<>]/
//https://github.com/nthtran/vdom-to-html
//将字符串经过 str 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt 
export  function escapeHTML(string) {
    var str = '' + string
    var match = rescapeHTML.exec(str)

    if (!match) {
        return str
    }

    var escape
    var html = ''
    var index = 0
    var lastIndex = 0

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;'
                break
            case 38: // &
                escape = '&amp;'
                break
            case 39: // '
                escape = '&#39;'
                break
            case 60: // <
                escape = '&lt;'
                break
            case 62: // >
                escape = '&gt;'
                break
            default:
                continue
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index)
        }

        lastIndex = index + 1
        html += escape
    }

    return lastIndex !== index
        ? html + str.substring(lastIndex, index)
        : html
}

export const commonTmpDiv = browser.document.createElement('div')