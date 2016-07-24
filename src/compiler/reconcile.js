/**
 * Created by cgspine on 16/7/24.
 * 节点对齐算法
 */

import { oneObject } from '../util'
import browser from '../dom/browser'

var rforHolder = /^m\-for/
var rwhiteRetain = /[\S\xA0]/
var plainTag = oneObject('script,style,template,noscript,textarea')

function reconcile(nodes, vnodes, parent) {
    vnodes = flatten(vnodes)
    var vl = vnodes.length
    if (vl === 0){
        return
    }
    var map = {}
    vnodes.forEach(function (el, index) {
        map[index] = getType(el)
    })
    var newNodes = [], change = false, el, i=0
    while (true) {
        el = nodes[i++]
        var vtype = el && getType(el)
        var nl = newNodes.length
        if (map[nl] === vtype) {
            newNodes.push(el)
            var vnode = vnodes[nl]

            if (vnode.dynamic) {
               vnode.dom = el
            }

            if (el.nodeType === 1 && !vnode.isVoidTag && !plainTag[vnode.type]) {
                if(el.type === 'select-one') {
                    //在chrome与firefox下删掉select中的空白节点，会影响到selectedIndex
                    var fixedIndex = el.selectedIndex
                }
                reconcile(el.childNodes, vnodes.children, el)
                if(el.type === 'select-one') {
                    el.selectedIndex = fixedIndex
                }
            }
        }else{
            change = true
            if(map[v] === '8true') {
                var vv = vnodes[v]
                var comment = document.createComment(vv.nodeValue)
                vv.dom = comment
                newNodes.push(comment)
                // comment是在lexer的时候被插进来的?
                i = Math.max(0, --i)
            }
        }
        if (newNodes.length === vl) {
           break 
        }
    }
    
    if (change) {
        var f = browser.document.createDocumentFragment(), i = 0
        while (el = newNodes[i++]) {
            f.appendChild(el)
        }
        while (el = parent.firstChild) {
            parent.removeChild(el)
        }
        parent.appendChild(f)
    }
}

function flatten(nodes) {
    var arr = []
    for (var i = 0, el; el = nodes[i]; i++) {
        if (Array.isArray(el)) {
            arr = arr.concat(flatten(el))
        } else {
            arr.push(el)
        }
    }
    return arr
}

function getType(node) {
    switch (node.nodeType) {
        case 3:
            return '3' + rwhiteRetain.test(node.nodeValue)
        case 1:
            return '1' + (node.nodeName || node.type).toLowerCase()
        case 8:
            return '8' + rforHolder.test(node.nodeValue)
    }
}

export default reconcile
