/**
 * Created by cgspine on 16/7/23.
 */

import maruo from '../maruo'

var needRenderIds = []
var renderingId = false

function batch(id) {
    if (renderingId) {
        return needRenderIds.ensure(id)
    } else {
        renderingId = id
    }
    var scope = maruo.scopes[id]
    if (!scope) {
        return renderingId = null
    }
    var vm = scope.vmodel
    var dom = vm.$el
    var source = dom.vtree || []
    var copy = vm.$render(vm)
    if (scope.isTemp) {

    }
}

export default batch