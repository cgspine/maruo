/**
 * Created by cgspine on 16/7/24.
 */
import { noop, warn } from '../util'
import config from '../config'

export default {
    parse: noop,
    diff: function (copy, src) {
        var copyValue = copy.nodeValue + ''
        if (copyValue !== src.nodeValue) {
            var dom = src.dom
            if(dom){
                dom.nodeValue = copyValue
            } else {
               config.debug && warn(`找不到[${copy.nodeValue}]对应的节点`)
            }
        }
    }
}