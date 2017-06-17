/**
 * Created by cgspine on 16/7/21.
 */

import browser from "../dom/browser";
import {isEmptyObject} from "../util";

var nextGuid = 1;

export default function mixinEvent(maruo) {
    maruo.on = function (el, type, fn) {
        var data = maruo.data.cache(el)
        if (!data.handlers) {
            data.handlers = {}
        }

        if (!data.handlers[type]) {
            data.handlers[type] = []
        }

        if (!fn.guid) {
            fn.guid = nextGuid++
        }
        data.handlers[type].push(fn)

        if (!data.dispatcher) {
            data.disabled = false
            data.dispatcher = function (event) {
                if (data.disabled) {
                    return
                }
                event = fixEvent(event)
                var handlers = data.handlers[event.type]
                if (handlers) {
                    var length = handlers.length
                    while (length--) {
                        handlers[length].call(el, event)
                    }
                }
            }
        }
        if (data.handlers[type].length === 1) {
            if (el.addEventListener) {
                el.addEventListener(type, data.dispatcher, false)
            } else if (el.attachEvent) {
                el.attachEvent("on" + type, data.dispatcher)
            }
        }
    }

    maruo.off = function (el, type, fn) {
        var data = maruo.data.cache(el)
        if (!data.handlers) {
            return
        }

        function removeType(type) {
            data.handlers[type] = []
            teardown(maruo, el, type)
        }

        if (!type) {
            for (var t in data.handlers) {
                removeType(t)
            }
            return
        }

        var handlers = data.handlers[type]
        if (!handlers) {
            return
        }
        if (!fn) {
            removeType(type)
            return
        }
        if (fn.guid) {
            var i = handlers.length
            while (i--) {
                if (handlers[i].guid === fn.guid) {
                    handlers.splice(i, 1)
                }
            }
        }
        teardown(el, type)
    }

    maruo.prototype.on = function (type, fn) {
        maruo.on(this[0], type, fn)
    }

    maruo.prototype.off = function (type, fn) {
        maruo.off(this[0], type, fn)
    }
}

/**
 * 清理资源
 * @param maruo
 * @param el
 * @param type
 */
function teardown(maruo, el, type) {
    var data = maruo.data.cache(el)

    if (data.handlers[type].length === 0) {
        delete data.handlers[type]
        if (el.removeEventListener) {
            el.removeEventListener(type, data.dispatcher, false)
        } else if (el.detachEvent) {
            el.detachEvent("on" + type, data.dispatcher)
        }
    }

    if (isEmptyObject(data.handlers)) {
        delete data.handlers
        delete data.dispatcher
    }

    if (isEmptyObject(data)) {
        maruo.data.remove(el)
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