/**
 * Created by cgspine on 16/7/23.
 */
import config from '../config'
import { unescapeHTML, commonTmpDiv } from '../util'
import { VElement, VText, VComment } from  '../vdom'
import { parseExpr } from './parseExpr'
import maruo from '../maruo'
import extractBinding from './extractBinding'


const rlineSp = /\n\s*/g
const rentities = /&[a-z0-9#]{2,10};/

/**
 * 将虚拟DOM树转换为一个$render方法
 */
export function render(vtree, vm) {
    vtree = Array.isArray(vtree) ? vtree : [vtree]
    parseNodes(vtree, vm)
    return function () {
        var vnodes = []
        for (var i=0, el; el =vtree[i++];) {
            vnodes.push(el.generate(vm))
        }
        return vnodes
    }
}

function parseNodes(vtree) {
    for (var i =0, el; el = vtree[i++];) {
        parseNode(el)
    }
}

function parseNode(vdom) {
    switch (vdom.nodeType) {
        case 3:
            vdom.expression = extractExpr(vdom.nodeValue)
            break
        case 8:
            break
        case 1:
            vdom.bindings = extractBinding(vdom.copyProto, vdom.props)
            if(!vdom.isVoidTag){
                parseNodes(vdom.children)
            }
            break
    }
}

/**
 * 拆分字符串中的非表达式和表达式
 * @param str
 * @returns {Array}
 */
function extractExpr(str) {
    var ret = []
    var val, index
    do{
        index = str.indexOf(config.openTag)
        index = index === -1 ? str.length : index
        val = str. slice(0, index)
        if(/\S/.test(val)){
            ret.push({
                value: decode(val),
                epxr: false
            })
            if (index === str.length) {
                break
            }
        }
        str = str.slice(index+ config.openTag.length)
        if (str) {
           index = str.indexOf(config.closeTag)
            val = str.slice(0, index)
            ret.push({
                value: unescapeHTML(val.replace(rlineSp, '')),
                expr: true
            })
            str = str.slice(index + config.openTag.length)
        }
    }while (str.length)
    return ret
}

function decode(str) {
    if(rentities.test(str)) {
        commonTmpDiv.innerHTML = str 
        return commonTmpDiv.innerText || commonTmpDiv.textContent
    }
    return str
}
