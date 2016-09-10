/**
 * Created by cgspine on 16/9/4.
 */
import converters from './converters'

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
        if(!this.fetcher){
            return
        }
        this.readyState = 4
        var eventType= 'error'
        if (status >= 200 && status < 300 || status === 304) {
            eventType = 'success'
            if (status === 204) {
               statusText = 'no content'
            } else if (status === 304) {
                statusText = 'not modified'
            } else {
                if (typeof this.response === 'undefined') {
                    var dataType = this.opts.dataType || this.opts.mimeType
                    if (!dataType) {
                        dataType = this.getResponseHeader('Content-Type') || ''
                        dataType = dataType.match(/json|xml|xml|script|html/) || ['text']
                        dataType = dataType[0]
                    }
                    try {
                        this.response = converters[dataType].call(this, this.responseText, this.responseXML)
                    } catch (e) {
                        eventType = 'error'
                        statusText = 'parser error: ' + e
                    }
                }
            }
        }
        this.status = status
        this.statusText = statusText
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
            delete this.timeoutId
        }
        if (eventType === 'success') {
            this.fire(eventType, this.response, statusText, this)
        } else {
            this.fire(eventType, this, statusText)
        }
        this.fire('complete', this, statusText)
        delete  this.fetcher
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