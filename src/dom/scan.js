/**
 * Created by cgspine on 16/7/21.
 */
import cls from './class'
import { warn, log } from '../util'
import { lexer, optimizate } from '../compiler/lexer'
import { render } from '../compiler/render'
import batch from '../compiler/batch'
import config from '../config'

function getController(a) {
    return a.getAttribute('m-controller') || a.getAttribute('m-important')
}

function scan(els,maruo) {
    // 不能这样玩, el.childNodes返回nodeList(类数组),并不是Array
    // els = Array.isArray(els) ? els : [els]
    maruo = maruo || this
    for (var i=0, el; el = els[i++];) {
       if (el.nodeType === 1) {
           var $id = getController(el)
           var vm = maruo.vms[$id]
           if (vm && !vm.$el) {
               cls.removeClass(el, 'm-controller')
               vm.$el = el
               var now = new Date()
               el.vtree = lexer(el.outerHTML)
               optimizate(el.vtree)
               var now2 = new Date()
               config.debug && log(`构建虚拟DOM耗时${now2 - now}ms`)
               vm.$render = render(el.vtree, vm)
               maruo.scopes[vm.$id] = {
                   vmodel: vm,
                   isTemp: true
               }
               var now3 = new Date()
               config.debug && log(`构建当前vm的$render方法用时${now3 - now2}ms`)
               batch($id)
           } else if (!$id) {
               scan(el.childNodes, maruo)
           }
       }
    }
}

export default function (els, maruo) {
    if (!els || !els.nodeType) {
        warn('[avalon.scan] first argument must be element , documentFragment, or document')
        return
    }
    scan([els], maruo)
}

