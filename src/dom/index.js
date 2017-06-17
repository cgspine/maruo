/**
 * Created by cgspine on 16/7/21.
 */
import ready from "./ready";
import scan from "./scan";
import {css, offset, offsetParent, position, scroll, WH} from "./css";
import {attr, prop} from "./attr";
import {val} from "./val";

export default function mixinDom(maruo) {
    maruo.ready = ready
    maruo.shadowCopy(maruo.fn, WH)
    maruo.shadowCopy(maruo.fn, scroll)
    maruo.shadowCopy(maruo.fn, {
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
        },
        prop: function (name, val) {
            return prop(this[0], name, val)
        },
        attr: function (name, val) {
            return attr(this[0], name, val)
        },
        val: function (value) {
            if (value !== void 0) {
                val(this[0], value)
                return this
            } else {
                return val(this[0])
            }

        }
    })
    ready(function () {
        scan(document.body, maruo)
    })
    maruo.scan = scan
}