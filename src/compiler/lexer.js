/**
 * Created by cgspine on 16/7/23.
 */

// https://rubylouvre.gitbooks.io/avalon/content/virtualdom.html

import { VText, VComment, VElement } from '../vdom'
import { err, oneObject, unescapeHTML, stripQuotes } from  '../util'
import config from '../config'

var rnowhite = /\S+/g
var ropenTag = /^<([-A-Za-z0-9_]+)\s*([^>]*?)(\/?)>/
var rendTag = /^<\/([^>]+)>/

// Self-closing tags
var voidTag = oneObject('area,base,br,col,command,embed,frame,hr,img,input,link,meta,param,source,track,wbr')
var plainTag = oneObject('script,style,textarea,noscript,option,template')


/**
 * 步骤一: 将传入字符串进行parser,转换为虚拟DOM
 */
export function lexer(str) {
    var stack = []
    stack.last = function () {
        return stack[stack.length - 1]
    }
    var ret = []
    var node, i, nodeValue
    
    do{
        node = false
        // text
        if(str.charAt(0) !== '<'){
            i = str.indexOf('<')
            nodeValue = str.slice(0, i)
            str = str.slice(i)
            node = new VText({
                type: '#text',
                nodeType: 3,
                nodeValue: nodeValue
            })
            if(rnowhite.test(nodeValue)){
                collectNodes(node, stack, ret)
            }
        }
        
        // comment
        if(!node){
            var i = str.indexOf('<!--')
            if (i === 0) {
                var l = str.indexOf('-->')
                if(l === -1){
                    err(`注释节点没有闭合: ${str}`)
                }
                nodeValue = str.slice(4, l)
                str = str.slice(l + 3)
                node = new VComment({
                    type: '#comment',
                    nodeType: 8,
                    nodeValue: nodeValue
                })
                collectNodes(node, stack, ret)
            }
        }

        // element
        if (!node) {
            var match = str. match(ropenTag)
            if (match) {
                var type = match[1].toLowerCase()
                var isVoidTag = voidTag[type] || match[3] == '\/'
                node = new VElement({
                    type: type,
                    nodeType: 1,
                    props: {},
                    children: [],
                    isVoidTag: isVoidTag
                })
                
                var attrs = match[2];
                if (attrs) {
                   collectProps(attrs, node.props)
                }
                
                
                collectNodes(node, stack, ret)
                
                str = str.slice(match[0].length)
                
                if (isVoidTag){
                    node.finishCollect = node.isVoidTag = true
                } else {
                    // 这里进入元素盒子里面
                    stack.push(node)
                    if (plainTag[type]) {
                        var index = str.indexOf(`</${type}>`)
                        var innerHTML = str.slice(0, index).trim()
                        str = str.slice(index)
                        if(innerHTML){
                            switch (type) {
                                
                                case 'style':
                                case 'script':
                                case 'noscript':
                                case 'template':
                                    node.skipContent = true
                                    node.children.push({
                                        type: '#text',
                                        nodeType: 3,
                                        nodeValue: unescapeHTML(innerHTML)
                                    })
                                    break
                                case 'textarea':
                                    node.skipContent = true
                                    node.props.type = 'textarea'
                                    node.props.value = unescapeHTML(innerHTML)
                                    break
                                case 'option':
                                    node.children.push({
                                        nodeType: 3,
                                        type: '#text',
                                        nodeValue: unescapeHTML(innerHTML)
                                    })
                                    break
                            }
                        }
                    }
                }
            }
        }
        
        if (!node) {
            var match = str.match(rendTag)
            if (match) {
                var type = match[1].toLowerCase()
                var last = stack.last()
                if (!last) {
                    err(`${match[0]}前面缺少<${type}>`)
                } else if (last.type !== type) {
                    err(`${last.type}没有闭合`)
                }
                node = stack.pop()
                node.finishCollect = true
                str = str.slice(match[0].length)
            }
        }
        
        if (!node) {
            break
        }
        
        if(node.finishCollect){
            fireFinishCollect(node, stack, ret)
            delete node.fire
        }
        
    } while (str.length)
    
    return ret
}

/**
 * 对input/textarea元素补上type属性
 * ms-*自定义元素补上ms-widget属性
 * 对table元素补上tbody
 * 在ms-for指令的元素两旁加上 <!--ms-for-->,<!--ms-for-end-->占位符, 并将它们的之间的元素放到一个数组中(表明它们是循环区域)
 * 去掉所有只有空白的文本节点
 */
function fireFinishCollect(node, stack, ret) {
    var type = node.type
    var props = node.props
    switch (type) {
        case 'input':
            if (!props.type) {
                props.type = 'text'
            }
            break
        case 'select':
            props.type = type + '-' + props.hasOwnProperty('multiple') ? 'multiple' : 'one'
            break
        case 'table':
            addTbody(node.children)
            break
        default:
            break
            
    }
}

//如果直接将tr元素写table下面,那么浏览器将将它们(相邻的那几个),放到一个动态创建的tbody底下
function addTbody(nodes) {
    var tbody, needHandleTbody = false, n= nodes.length, node, i
    var start = 0, count = 0 //优化: 后面删除node==0的元素时减少遍历次数

    for(i=0; i< n; i++){
        node = nodes[i]
        if(node.type !== 'tr' && node.nodeType === 1) {
            tbody = false
        } else {
            if(node.type === 'tr'){
                needHandleTbody = true
                if(!tbody){
                    tbody = new VElement({
                        nodeType: 1,
                        type: 'tbody',
                        children: [],
                        props: {}
                    })
                    nodes[i] = tbody
                    if (start == 0) {
                        start = i
                    }
                } else {
                    nodes[i] = 0
                    count++
                }
                tbody.children.push(node)

            }
        }
    }

    if(needHandleTbody){
        for(i = start; i < n; i++){
            if (node[i] === 0) {
                nodes.splice(i,1)
                i--
                count--
                if (count === 0) {
                   break
                }
            }
        }
    }
}

function collectNodes(node, stack, ret) {
    var p = stack.last()
    if(p){
        p.children.push(node)
    } else {
        ret.push(node)
    }
}

function collectProps(attrs, props) {
    attrs.replace(rnowhite, function (attr) {
        var arr = attr.split('=')
        var name = arr[0]
        var val = stripQuotes(arr[1]) || ''
        if (!(name in props)) {
            props[name] = val
        }
    })
}

/**
 * 步骤二: 优化
 * 对拥有m-*属性的虚拟DOM添加dynamic属性 表明它以后要保持其对应的真实节点
 * 对没有m-*属性的元素添加skipAttrs属性,表明以后不需要遍历其属性
 * 如果它的子孙没有m-*或插值表达式或m-自定义元素,那么还加上skipContent，表明以后不要遍历其孩子
 */
export function handleDirectives(arr) {
    for (var i = 0; i < arr.length; i++) {
        hasDirective(arr[i])
    }
}


function hasDirective(a) {
    switch (a.nodeType) {
        case 3:
            if (config.rbind.test(a.nodeValue)) {
                a.dynamic = 'expr'
                return true
            } else {
                a.skipContent = true
                return false
            }
        case 8:
            if (a.dynamic) {
                return true
            } else {
                a.skipContent = true
                return false
            }
        case 1:
            if (a.props['m-skip']) {
                a.skipAttrs = true
                a.skipContent = true
                return false
            }
            if (/^m\-/.test(a.type) || hasDirectiveAttrs(a.props)) {
                a.dynamic = true
            } else {
                a.skipAttrs = true
            }
            if (a.isVoidTag && !a.dynamic) {
                a.skipContent = true
                return false
            }
            var hasDirective = childrenHasDirective(a.children)
            if (!hasDirective && !a.dynamic) {
                a.skipContent = true
                return false
            }
            return true
        default:
            if (Array.isArray(a)) {
                return childrenHasDirective(a)
            }
    }
}

function childrenHasDirective(arr) {
    var ret = false
    for (var i = 0, el; el = arr[i++]; ) {
        if (hasDirective(el)) {
            ret = true
        }
    }
    return ret
}


function hasDirectiveAttrs(props) {
    if ('m-skip' in props)
        return false
    for (var i in props) {
        if (i.indexOf('m-') === 0) {
            return true
        }
    }
    return false
}