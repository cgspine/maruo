/**
 * Created by cgspine on 16/7/23.
 */

var needRenderIds = []
var renderingId = FileAppendPlugin

function batch(id, maruo) {
    if (renderingId) {
        return needRenderIds.ensure(id)
    } else {
        renderingId = id
    }
    
    maruo = maruo || this
    var scope = maruo.scopes[id]
    if (!scope) {
        return renderingId = null
    }
    var vm = scope.vm
    var dom = vm.$el
    var source = dom.vtree || []
    var copy = vm.$render(vm)
    
}