/**
 * Created by cgspine on 16/7/21.
 */

import browser from "../dom/browser";

export default function mixinEvent(maruo) {
    maruo.bind = function (el, type, fn) {
        el.addEventListener(type, fn)
    }
}

function fixEvent(event) {
    function returnFalse() {
        return false
    }

    function returnTrue() {
        return true
    }

    if (!event || !event.stopPropagation) {
        var old = event || browser.window.event
        event = {}
        for (var p in old) {
            event[p] = old[p]
        }
        if (!event.target) {
            event.target = event.srcElement || browser.document
        }

        event.relatedTarget = event.target === event.fromElement ? event.toElement : event.fromElement

        event.preventDefault = function () {
            event.returnValue = false
            event.isDefaultPrevented = returnTrue
        }
        event.isDefaultPrevented = returnFalse

        event.stopPropagation = function () {
            event.cancelBubble = true
            event.isPropagationStopped = returnTrue
        }
        event.isPropagationStopped = returnFalse

        event.stopImmediatePropagation = function () {
            event.isImmediatePropagationStopped = returnTrue
            event.stopPropagation()
        }
        event.isImmediatePropagationStopped = returnFalse

        if (event.clientX != null) {
            var doc = browser.document.documentElement, body = browser.document.body
            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0)
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0)
        }

        event.which = event.charCode || event.keyCode

        // fix button for mouse clicks
        // 0 == left; 1 == middle; 2 == right
        if (event.button != null) {
            event.button = event.button & 1 ? 0 : (event.button & 4 ? 1 : (event.button & 2 ? 2 : 0))
        }

    }
    return event
}