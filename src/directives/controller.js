/**
 * Created by cgspine on 16/7/30.
 */

import maruo from '../maruo'

export default {
    parse: function (copy, src, binding){
        copy[binding.name] = binding.expr
    },
    
    diff (copy, src, name) {
        if (copy[name] !== src[name]) {
            var id = src[name] = copy[name]
            var scope = maruo.scopes[id]
            if (scope) {
                return
            }
            var vm = maruo.vms[id]
            maruo.scopes[id] = {
                vmodel: vm
            }
        }
    }
}