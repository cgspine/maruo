/**
 * Created by cgspine on 16/8/9.
 */

export function attr(el, name, value) {
    if(el){
        if (arguments.length === 3) {
            el.setAttribute(name, value)
        } else {
            el.getAttribute(name)
        }
    }
}