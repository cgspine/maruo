/**
 * Created by cgspine on 16/9/10.
 */
import xmlParser from './parser/xml'
import htmlParser from './parser/html'
import scriptParser from './parser/script'
import maro from '../maruo'

export default {
    text: function (text) {
        return text || ''
    },
    xml: function (text, xml) {
        return xml !== void 0 ? xml : xmlParser(text)
    },
    html: function (text) {
        htmlParser(text)
    },
    json: function (text) {
        return JSON.parse(text)
    },
    script: function (text) {
        return scriptParser(text)
    },
    jsonp: function () {
        var json = maro[this.jsonpCallback]
        delete maro[this.jsonpCallback]
        return json
    }
}