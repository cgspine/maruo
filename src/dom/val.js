/**
 * Created by cgspine on 16/8/9.
 */
import { attr } from './attr'
import { trim } from '../util'

var rspaces = /[\x20\t\r\n\f]+/g


export function getValType(el) {
    var ret = el.tagName.toLowerCase();
    return ret === 'input' && /checkbox|radio/.test(el.type) ? 'checked' : ret;
}

var valHooks = {
    'option:get': function (node) {
        var val = attr(node, "value");
        return val != null ? val :

            // Support: IE <=10 - 11 only
            // option.text throws exceptions (#14686, #14858)
            // Strip and collapse whitespace
            // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
            trim(node.text).replace(rspaces, " ");
    },
    'select:get': function self(node, ret, index, singleton) {
        var nodes = node.children, value,
            getter = valHooks['option:get']
        index = ret ? index : node.selectedIndex
        singleton = ret ? singleton : node.type === 'select-one' || index < 0
        ret = ret || []
        for (var i = 0, el; el = nodes[i++]; ) {
            if (!el.disabled) {
                switch (el.nodeName.toLowerCase()) {
                    case 'option':
                        if ((el.selected || el.index === index)) {
                            value = el.value
                            if (singleton) {
                                return value
                            } else {
                                ret.push(value)
                            }
                        }
                        break
                    case 'optgroup':
                        value = self(el, ret, index, singleton)
                        if (typeof value === 'string') {
                            return value
                        }
                        break
                }
            }
        }
        return singleton ? null : ret
    },
    'select:set': function (node, values, optionSet) {
        values = [].concat(values) //强制转换为数组
        for (var i = 0, el; el = node.options[i++]; ) {
            if ((el.selected = values.indexOf(el.value) > -1)) {
                optionSet = true
            }
        }
        if (!optionSet) {
            node.selectedIndex = -1
        }
    }
}

export function val(value) {
    var node = this[0]
    if (node && node.nodeType === 1) {
        var get = arguments.length === 0
        var access = get ? ':get' : ':set'
        var fn = valHooks[getValType(node) + access]
        if (fn) {
            var val = fn(node, value)
        } else if (get) {
            return (node.value || '').replace(/\r/g, '')
        } else {
            node.value = value
        }
    }
    return get ? val : this
}