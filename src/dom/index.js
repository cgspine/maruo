/**
 * Created by cgspine on 16/7/21.
 */
import ready from './ready'
import scan from './scan'
import { WH, scroll, css, offset, offsetParent, position } from './css'

export default function mixinDom(maruo) {
    maruo.shadowCopy(maruo.fn,WH)
    maruo.shadowCopy(maruo.fn, scroll)
    maruo.shadowCopy(maruo.fn,{
        offset: function () {
            return offset(this[0])
        },
        css: function (name, val) {
            return css(this[0], name, val)
        },
        offsetParent: function () {
            return offsetParent(this[0])
        },
        position: function () {
            return position(this[0])
        }
    })
    ready(function () {
        scan(document.body, maruo)
    })
    maruo.scan = scan
}