/**
 * Created by cgspine on 16/7/23.
 */
import { VText } from '../vdom'
import { parseExpr } from '../compiler/parseExpr'

export default {
    parse: function (cur, src, binding,scope) {
        cur[binding.name] = 1
        src.children = []
        cur.children = []
        cur.children.push(new VText({
            nodeType: 3,
            type: '#text',
            dynamic: true,
            nodeValue: parseExpr(binding.expr).getter(scope)
        }))
    }
}
