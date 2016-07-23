/**
 * Created by cgspine on 16/7/23.
 */

import maruo from '../maruo'
import { oneObject } from '../util'

var directives = maruo.directives
var eventMap = oneObject('animationend,blur,change,input,click,dblclick,focus,keydown,keypress,' +
    'keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit')
var rbinding = /^m-(\w+)-?(.*)/

function extractBinds(cur, props) {
    var bindings = []
    var skip = 'm-skip' in props
    var uniqSave = {}

    for(var i in props) {
        var val = props[i], match
        if (!skip && (match = i.match(rbinding))){
            var type = match[1]
            var param = match[2] || ''
            var name = i
            if (eventMap[type]) {
               var order = parseFloat(param) || 0
                param = type
                type = 'on'
            }
            name = 'm-' + type + (param ? '-' + param : '')
            if(i !== name) {
                delete props[i]
                props[name] = val
            }
            if(directives[type]){
                var binding = {
                    type: type,
                    param: param,
                    name: name,
                    expr: val,
                    priority: directives[type].priority || type.charCodeAt(0) * 100
                }
                if (type === 'on') {
                    order = order || 0
                    binding.name += '-' + order //绑定多次事件
                    binding.priority = param.charCodeAt(0) * 100 + order
                }
                if (!uniqSave[binding.name]) {
                    uniqSave[binding.name] = 1
                    bindings.push(binding)
                }
            }
        } else {
            cur.props[i] = props[i]
        }
    }
    bindings.sort(byPriority)
    return bindings
}

function byPriority(a, b) {
    return a.priority - b.priority
}

export default extractBinds