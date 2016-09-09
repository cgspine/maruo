/**
 * Created by cgspine on 16/9/4.
 */

export function getRealXhr() {
    try {
        return new window.XMLHttpRequest();
    } catch ( e ) {}
}


var uniqueId = 1

const rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg

export function XHR(opts) {
    this._events = {};
    this.opts = opts || {}

    this.responseHeadersString = ''
    this.responseHeaders = {}
    this.requestHeaders = {}
    this.querystring = this.opts.querystring
    this.readyState = 0
    this.uniqueId = uniqueId++
    this.status = 0
    this.addEventListener = this.bind;
    this.removeEventListener = this.unbind;
}

XHR.prototype = {
    constructor: XHR,
    
    setRequestHeader: function (name, value) {
        this.requestHeaders[name] = value
        return this
    },
    getAllResponseHeaders: function () {
        return this.readyState === 4 ? this. responseHeadersString : null
    },
    getResponseHeader: function (name, match) {
        if (this.readyState === 4) {
            while ((match = rheaders.exec(this.responseHeadersString))) {
                this.responseHeaders[match[1]] = match[2]
            }
            match = this.responseHeaders[name]
        }
        return match === void 0 ? null : match
    },
    overrideMimeType:  function (type) {
        this.mimeType = type
        return this
    },
    abort: function () {
        this.respond('abort')
        return this
    },

    dispatch(status, statusText){
        console.log(status)
        console.log(statusText)
    },
    
    bind: function (type, callback) {
        var listeners = this._events[type]
        if (listeners) {
            listeners.push(callback)
        } else {
            this._events[type] = [callback]
        }
        return this
    },
    unbind: function (type,callback) {
        var n = arguments.length
        if (n === 0) {
            this._events = {}
        } else if (n === 1) {
            this._events[type] = []
        } else {
            var listeners = this._events[type] || [],
                i = listeners.length
            while (--i >= 0) {
                if (listeners[i] === callback) {
                    listeners.splice(i, 1)
                    break
                }
            }
        }
        return this
    },
    once: function (type, callback) {
        var self = this
        var wrapper = function () {
            callback.apply(self, arguments)
            self.unbind(type, wrapper)
        }
        this.bind(type, wrapper)
        return this
    },
    fire: function (type) {
        var listeners = (this._events[type] || []).concat(); // 防止影响原数组
        if (listeners.length) {
            var args = Array.prototype.slice.call(arguments, 1)
            for (var i = 0, callback; callback = listeners[i++];) {
                callback.apply(this, args)
            }
        }
    },
    toString: function () {
        return '[object XHR]'
    }
}