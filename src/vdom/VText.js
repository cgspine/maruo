/**
 * Created by cgspine on 16/7/22.
 */
import browser from '../dom/browser'
import config from '../config'
import { parseExpr } from '../compiler/parseExpr'

export function VText(text) {
    if(typeof text === 'string'){
        this.type = 'text'
        this.nodeValue = text
        this.nodeType = 3
        this.expression = null
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
    },
    generate: function(vm) {
        var expr = this.expression;
        if(expr == null || expr.length == 0){
            return this
        }
        var nodeValue = expr.map(function (part) {
            if (!part.expr){
                return part.value
            }
            return parseExpr(part.value, false).getter(vm)
        }).join('');
        return new VText({
            type: '#text',
            nodeType: 3,
            dynamic: true,
            nodeValue: nodeValue,
            expression:expr
        })
    }
}