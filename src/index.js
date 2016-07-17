/**
 * Created by cgspine on 16/7/9.
 */

require('./lang')

import mixinCore from './core/index'
import mixinViewModel from './vm/index'




function maruo(el) {
    return new maruo.init(el)
}

maruo.init = function (el) {
    this[0] = this.el = el
}

maruo.fn = maruo.prototype = maruo.init.prototype

maruo.vms = {}

mixinCore(maruo)
mixinViewModel(maruo)

export default maruo