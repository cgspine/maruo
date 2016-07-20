/**
 * Created by cgspine on 16/7/21.
 */

export default function mixinEvent(maruo) {
    maruo.bind = function (el, type, fn) {
        el.addEventListener(type, fn)
    }
}