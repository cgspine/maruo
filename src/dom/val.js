/**
 * Created by cgspine on 16/8/9.
 */

export function getValType(el) {
    var ret = el.tagName.toLowerCase();
    return ret === 'input' && /checkbox|radio/.test(el.type) ? 'checked' : ret;
}