/**
 * Created by cgspine on 16/9/7.
 */
import { getRealXhr } from '../xhr'
import { err, noop } from '../../util'
import browser from '../../dom/browser'


const xhrSuccessStatusMap = {
        0       :   200,    // File protocol always yields status code 0, assume 200
        1223    :   204     // Support: IE <=9 only
    }


export default {
    request: function () {
        var self = this
        var opts = this.opts
        var fetcher = this.fetcher = getRealXhr()
        if(opts.crossDomain && !('withCredentials' in fetcher)) {
            err('browser does not support cross domain xhr')
        }
        if (opts.username) {
            fetcher.open(opts.type, opts.url, opts.async, opts.username, opts.password)
        } else {
            fetcher.open(opts.type, opts.url, opts.async)
        }

        // Override mime type if needed
        if (this.mimeType && fetcher.overrideMimeType) {
            fetcher.overrideMimeType(this.mimeType)
        }

        // Set headers
        if ( !opts.crossDomain && this.requestHeaders[ "X-Requested-With" ] ) {
            this.requestHeaders[ "X-Requested-With" ] = "XMLHttpRequest"
        }
        for (var i in this.requestHeaders) {
            fetcher.setRequestHeader(i, this.requestHeaders[i])
        }
        var dataType = opts.dataType
        if ("responseType" in fetcher && /^(blob|arraybuffer|text)$/.test(dataType)) {
            fetcher.responseType = dataType;
            this.useResponseType = true
        }
        var callback, errback

        callback = function (type) {
            return function () {
                if (callback) {
                    callback = errback = null
                    self.respond(type)
                }
            }
        }
        fetcher.onload = callback()
        errback = fetcher.onerror = callback('error')

        // Support: IE 9 only
        // Use onreadystatechange to replace onabort to handle uncaught aborts
        if ( fetcher.onabort !== void 0 ) {
            fetcher.onabort = errback
        } else {
            fetcher.onreadystatechange = function() {
                if ( fetcher.readyState === 4 ) {
                    // Allow onerror to be called first, but that will not handle a native abort
                    browser.window.setTimeout( function() {
                        if ( callback ) {
                            errback()
                        }
                    } )
                }
            }
        }

        // Create the abort callback
        callback = callback( "abort" )

        try {

            fetcher.send(opts.hasContent && this.querystring || null)
        } catch ( e ) {
            // Only rethrow if this hasn't been notified as an error yet
            if ( callback ) {
                throw e;
            }
        }


    },
    respond: function (type) {
        var fetcher = this.fetcher;
        if (!fetcher) {
            return;
        }
        fetcher.onerror = fetcher.onload = fetcher.onreadystatechange = noop;
        try{
            if (type === 'abort') {
                fetcher.abort()
            } else if(type === 'error') {
                // On a manual native abort, IE9 throws errors on any property access that is not readyState
                if ( typeof fetcher.status !== "number" ) {
                    this.dispatch( 0, "error")
                } else {
                    this.dispatch(fetcher.status, fetcher.statusText)
                }
            } else {
                var status = xhrSuccessStatusMap[ fetcher.status ] || fetcher.status
                this.responseText = fetcher.responseText;
                try {
                    //当responseXML为[Exception: DOMException]时，
                    //访问它会抛“An attempt was made to use an object that is not, or is no longer, usable”异常
                    var xml = fetcher.responseXML
                } catch (e) {
                }

                if (this.useResponseType) {
                    this.response = fetcher.response;
                }
                if (xml && xml.documentElement) {
                    this.responseXML = xml;
                }
                this.responseHeadersString = fetcher.getAllResponseHeaders();
                //火狐在跨城请求时访问statusText值会抛出异常
                try {
                    var statusText = fetcher.statusText;
                } catch (e) {
                    statusText = "firefoxAccessError";
                }
                this.dispatch(status, statusText)
            }
        } catch(e) {
            // 如果网络问题时访问XHR的属性，在FF会抛异常
            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
            if (type !== 'abort') {
                this.dispatch(500, e + "");
            }
        }
    }
}