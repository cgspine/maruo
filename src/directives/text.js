/**
 * Created by cgspine on 16/7/23.
 */
import { VText } from '../vdom'
import { parseExpr } from '../compiler/parseExpr'

export default {
    parse: function (cur, src, binding,scope) {
        src.children = []
        cur.children = []
        cur.children.push(new VText({
            nodeType: 3,
            type: '#text',
            dynamic: true,
            nodeValue: parseExpr(binding.expr).getter(scope)
        }))
    },

    diff: function(copy, src){
        if(!src.children.length){
            var dom = src.dom
            if (dom && !src.isVoidTag ) {
                while (dom.firstChild) {
                    dom.removeChild(dom.firstChild)
                }
                var text = document.createTextNode('x')
                dom.appendChild(text)
                var a = {nodeType: 3, type:'#text', dom: text}
                src.children.push(new VText(a))
            }
        }
    }
}
