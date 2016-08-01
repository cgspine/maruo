/**
 * Created by cgspine on 16/7/23.
 */

import maruo from '../maruo'

var emptyArr = []
var emptyObj = function () {
    return {
        children: [], props: {}
    }
}

var directives = maruo.directives

function diff(copys, sources) {
    for (var i= 0; i < copys.length; i++) {
        var copy = copys[i]
        var src = sources[i] || emptyObj()

        switch (copy.nodeType) {
            case 3:
                if (copy.dynamic) {
                    directives['expr'].diff(copy,src)
                }
                break
            case 8:
                break
            case 1:
                diffElementBindings(copy, src)
                
                if (!copy.skipContent && !copy.isVoidTag ) {
                    diff(copy.children, src.children || emptyArr, copy)
                }
        }
    }
}

function diffElementBindings(copy, src) {
    var bindings = src.bindings
    if(bindings){
        bindings.forEach(function(binding){
            directives[binding.type].diff(copy,src, binding.name)
        })
    }
    
}

export default diff