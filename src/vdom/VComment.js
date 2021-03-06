/**
 * Created by cgspine on 16/7/22.
 */
import browser from '../dom/browser'

export function VComment(text) {
    if (typeof text === 'string') {
        this.type = '#comment'
        this.nodeValue = text
        this.skipContent = true
        this.nodeType = 8
    } else{
        for(var i in text){
            if(text.hasOwnProperty(i)){
                this[i] = text[i]
            }
        }
    }
}

VComment.prototype = {
    constructor: VComment,
    toDOM: function () {
        browser.document.createComment(this.nodeValue)
    },
    toHTML: function () {
        return `<!-- ${this.nodeValue} -->`
    },
    generate: function(vm){
        return this
    }
}