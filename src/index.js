/**
 * Created by cgspine on 16/7/9.
 */

require('./lang')

import mixinCore from './core'
import mixinViewModel from './vm'
import mixinEvent from  './event'
import mixinDom from './dom'




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
mixinEvent(maruo)
mixinDom(maruo)

export default maruo