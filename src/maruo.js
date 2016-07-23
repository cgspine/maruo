/**
 * Created by cgspine on 16/7/23.
 */

function maruo(el) {
    return new maruo.init(el)
}

maruo.init = function (el) {
    this[0] = this.el = el
}

maruo.fn = maruo.prototype = maruo.init.prototype

maruo.vms = {}
maruo.scopes = {}
maruo.directives = {}

export default maruo