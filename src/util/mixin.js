/**
 * Created by cgspine on 16/9/4.
 */
import { hasOwn } from './const'

export function mixin(target, source) {
    var args = Array.slice.call(arguments),
        i = 1,
        key,
        ride = typeof args[args.length - 1] === 'boolean' ? args.pop() : true // 如果最后参数是布尔，判定是否覆写同名属性
    if (args.length === 1) {
        target = this.window ? {} : this
        i = 0
    }
    while ((source = args[i++])) {
        for (key in source) {
            if (hasOwn.call(source, key) && (ride || !(key in target))) {
                target[key] = source[key]
            } 
        }
    }
    return target
}