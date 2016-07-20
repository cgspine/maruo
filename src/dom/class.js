/**
 * Created by cgspine on 16/7/21.
 */

import { rword } from '../util/const'

var o = Object.create(null)

var rnoWhite = /\S+/g
'add, remove'.replace(rword, function (method) {
    o[method + 'Class'] = function (el, cls) {
        if (cls && typeof cls === 'string' && el.nodeType === 1) {
            cls.replace(rnoWhite, function (c) {
                el.classList[method](c)
            })
        }
    }
})

o.hasClass = function (el, cls) {
    return el.nodeType === 1 && el.classList.contains(cls)
}

o.toggleClass = function (el, val, stateVal) {
    var isBool = typeof stateVal === 'boolean'
    String(val).replace(rnoWhite, function (c) {
        var state = isBool ? stateVal : !o.hasClass(el, c)
        o[state ? 'addClass' : 'removeClass'](el, c)
    })
}

export default o