/**
 * Created by cgspine on 16/9/10.
 */
import script from './script'
import {mixin} from '../../util'
import maruo from '../../maruo'
var uuid = 0;
const rquery = /\?/

var jsonp = {
    preprocess: function () {
        var opts = this.opts;
        var name = this.jsonpCallback = opts.jsonpCallback || 'ajax_jsonp_' + uuid++;
        opts.url = opts.url + (rquery.test(opts.url) ? "&" : "?") + opts.jsonp + "=" + "maruo." + name;
        //将后台返回的json保存在惰性函数中
        maruo[name] = function(json) {
            maruo[name] = json;
        };
        return "script"
    }
}
mixin(jsonp, script)

export default jsonp