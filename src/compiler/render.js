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
export function render(vtree) {
    vtree = Array.isArray(vtree) ? vtree : [vtree]
    return function (scope) {
        scope = scope || this
        return parseNodes(vtree, scope)
    }
}

function parseNodes(vtree, scope) {
    var vnodes = []
    var vnode
    for (var i =0, el; el = vtree[i++];) {
        vnode = parseNode(el, scope)
        vnodes.push(vnode)
    }
    return vnodes
}

function parseNode(vdom, scope) {
    switch (vdom.nodeType) {
        case 3:
            return parseText(vdom, scope)
        case 8:
            return vdom
        case 1:
            var copy = {
                props: {},
                type: vdom.type,
                nodeType: 1
            }
            var bindings = extractBinding(copy, vdom.props)
            bindings.forEach(function (binding) {
                maruo.directives[binding.type].parse(copy, vdom, binding,scope)
            })
            if (vdom.isVoidTag) {
               copy.isVoidTag = true
            } else {
                if (!('children' in copy)) { // directive或许或许会赋值给copy children属性
                    var children = vdom.children
                    if (children.length) {
                        copy.children = parseNodes(children, scope)
                    }else {
                        copy.children = []
                    }
                }
            }

            if (vdom.skipContent)
                copy.skipContent = true
            if (vdom.skipAttrs)
                copy.skipAttrs = true

            return new VElement(copy)
            
        default:
            if (Array.isArray(vdom)) {

            }
    }
}

function parseText(vtext, scope) {
    var array = extractExpr(vtext.nodeValue)//返回一个数组
    var nodeValue = array.map(function (part) {
        if (!part.expr){
            return part.value
        }
        return parseExpr(part.value, false).getter(scope)
    }).join('');
    return new VText({
        type: '#text',
        nodeType: 3,
        dynamic: true,
        nodeValue: nodeValue
    })
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
