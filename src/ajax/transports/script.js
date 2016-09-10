/**
 * Created by cgspine on 16/9/10.
 */
import browser from '../../dom/browser'

export default {
    request: function () {
        var opts = this.opts
        var self = this
        var node = this.fetcher = browser.document.createElement('script')
        if (opts.charset) {
            node.charset = opts.charset
        }
        node.onerror = function () {
            self.respond('error')
        }
        node.onload = function () {
            self.respond()
        }
        node.src = opts.url
        browser.document.head.appendChild(node)
    },
    respond: function (type) {
        var node = this.fetcher;
        if(!node){
            return
        }
        node.onerror = node.onload = null
        var parent = node.parentNode
        if (parent) {
            parent.removeChild(node)
        }
        // abort就什么都不做了
        if(type === 'error'){
            this.dispatch(404, 'error')
        } else if (type !== 'abort'){
            this.dispatch(200, 'success')
        }
    }
}