/**
 * Created by cgspine on 16/7/23.
 */

import maruo from '../maruo'
import reconcile from './reconcile'
import browser from '../dom/browser'
import diff from './diff'

var needRenderIds = []
var renderingId = false

function batch(id) {
    if (renderingId) {
        return needRenderIds.ensure(id)
    } else {
        renderingId = id
    }
    var scope = maruo.scopes[id]
    if (!scope || !browser.document.nodeName) {
        return renderingId = null
    }
    var vm = scope.vmodel
    var dom = vm.$el
    var source = dom.vtree || []
    var copy = vm.$render(vm)
    if (scope.isTemp) {
        //在最开始时,替换作用域的所有节点,确保虚拟DOM与真实DOM是对齐的
        reconcile([dom], source, dom.parentNode)
        delete maruo.scopes[id]
    }
    
    diff(copy,source)
    
    var index = needRenderIds.indexOf(renderingId)
    renderingId =0
    if (index > -1) {
       var removed = needRenderIds.splice(index, 1)
        return batch(removed[0])
    }
    
    var more = needRenderIds.shift()
    if (more) {
       batch(more) 
    }
}

export default batch