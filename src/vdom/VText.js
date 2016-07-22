/**
 * Created by cgspine on 16/7/22.
 */
import browser from '../dom/browser'

function VText(text) {
    if(typeof text === 'string'){
        this.type = 'text'
        this.nodeValue = text
        this.nodeType = 3
    } else {
        for(var i in text){
            if(text.hasOwnProperty(i)){
                this[i] = text[i]
            }
        }
    }
}

VText.prototype = {
    constructor: VText,
    toDOM: function () {
        browser.document.createTextNode(this.nodeValue)
    },
    toHTML: function () {
        return this.nodeValue
    }
}

export default VText