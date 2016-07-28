/**
 * Created by cgspine on 16/7/22.
 */

import browser from '../dom/browser'
import maruo from '../maruo'

export function VElement(type, props, children) {
    if (typeof type === 'object') {
        for (var i in type) {
            this[i] = type[i]
        }
    } else {
        this.nodeType = 1
        this.type = type
        this.props = props
        this.children = children
        this.template = ''
        this.isVoidTag = false
    }
    this.bindings = []
    this.copyProto = {
        props: {},
        type: this.type,
        nodeType: 1
    }
}

function skipFalseOrFunc(obj) {
    return obj !== false && (Object(obj) !== obj)
}


VElement.prototype = {
    constructor: VElement,
    toDOM: function () {
        var tagName = this.type
        var dom = browser.document.createElement(tagName)
        for(var i in this.props){
            var val = this.props[i]
            if(skipFalseOrFunc(val)){
                dom.setAttribute(i, val + '')
            }
        }
        switch (this.type) {
            case 'script':
                dom.text = this.template
                break
            case 'style':
                if ('styleSheet' in dom) {
                    dom.setAttribute('type', 'text/css')
                    dom.styleSheet.cssText = this.template
                } else {
                    dom.innerHTML = this.template
                }
                break
            case 'template':
                dom.innerHTML = this.template
                break
            case 'noscript':
                dom.textContent = this.template
                break
            default:
                if (!this.isVoidTag) {
                    this.children.forEach(function (c) {
                        c && dom.appendChild(c.toDOM())
                    })
                }
                break
        }
        return dom
    },
    toHTML: function () {
        var arr = []
        for (var i in this.props) {
            var val = this.props[i]
            if (skipFalseOrFunc(val)) {
                arr.push(i + '=' + JSON.stringify(val + ''))
            }
        }
        arr = arr.length ? ' ' + arr.join(' ') : ''
        var str = '<' + this.type + arr
        if (this.isVoidTag) {
            return str + '/>'
        }
        str += '>'
        if (this.children.length) {
            str += this.children.map(function (c) {
                return c ? c.toHTML() : ''
            }).join('')
        } else {
            str += this.template || ''
        }
        return str + '</' + this.type + '>'
    },
    generate: function(vm){
        var copy = {}
        maruo.shadowCopy(copy, this.copyProto)
        var bindings = this.bindings || []
        var self = this
        bindings.forEach(function(binding){
            maruo.directives[binding.type].parse(copy, self, binding, vm)
        })

        if (this.isVoidTag) {
            copy.isVoidTag = true
        } else {
            if (!('children' in copy)) { // directive或许或许会赋值给copy children属性
                var children = this.children
                if (children.length) {
                    copy.children = children.map(function(el){
                        return el.generate(vm)
                    })
                }else {
                    copy.children = []
                }
            }
        }

        if (this.skipContent)
            copy.skipContent = true
        if (this.skipAttrs)
            copy.skipAttrs = true

        return new VElement(copy)
    }
}
