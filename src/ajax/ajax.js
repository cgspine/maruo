/**
 * Created by cgspine on 16/9/4.
 */
import { err, mixin, param, rword } from '../util'
import browser from '../dom/browser'
import { getRealXhr, XHR} from './xhr'
import transports from './transports'

const defaults = {
    type: 'GET',
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    async: true,
    jsonp: "callback"
}

const rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
    curl = browser.document.URL,
    segments = rurl.exec(curl.toLowerCase()) || [],
    rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    isLocal = rlocalProtocol.test(segments[1]),
    rnoContent = /^(?:GET|HEAD)$/,
    rhash = /#.*$/,
    rts = /([?&])_=[^&]*/,
    rprotocol = /^\/\//,
    rquery = /\?/


export function ajax(opts) {
    if (!opts || !opts.url) {
       err("argument must be object which has a property named url") 
    }
    opts = setOptions(opts)
    var xhr = new XHR(opts)
    'complete,success,error'.replace(rword, function (name) {
        if (typeof opts[name] === 'function') {
            xhr.bind(name, opts[name])
            delete opts[name]
        }
    })
    var dataType = opts.dataType // 目标返回数据类型
    var name = opts.form ? 'upload': dataType
    var transport = transports[name] || transports.xhr
    
}

function setOptions(opts) {
    opts = mixin({}, defaults, opts)
    if (typeof opts.crossDomain !== 'boolean') { // 是否跨域
        var parts = rurl.exec(opts.url.toLowerCase())
        opts.crossDomain = !!(parts && (parts[1] !== segments[1] || parts[2] !== segments[2] ||
        (parts[3] || (parts[1] === 'http:' ? 80 : 443)) !== (segments[3] || (segments[1] === 'http:' ? 80 : 443))))
    }
    if (opts.data && typeof opts.data !== 'object') {
       err('data must be a object')
    }
    var querystring = param(opts.data)
    opts.querystring = querystring || ''
    opts.url = opts.url.replace(/#.*$/, '').replace(/^\/\//, segments[1] + '//')
    opts.type = opts.type.toUpperCase()
    opts.hasContent = !rnoContent.test(opts.type)
    if (!opts.hasContent){
        if (querystring) {
            opts.url += (rquery.test(opts.url) ? '&' : '?') + querystring
        }
        if (opts.cache === false) {
            opts.url += (rquery.test(opts.url) ? '&' : '?') + 'maruo_timestamp' + Date.now()
        }
    }
    return opts
}