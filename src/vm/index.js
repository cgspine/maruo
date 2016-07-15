/**
 * Created by cgspine on 16/7/9.
 */
import { Observable } from './observable'
import { warn } from '../util/log'

export default function mixinViewModel(maruo){
    maruo.define = function (definition) {
        var $id = definition.$id;
        if(!$id){
            warn('vm.$id must be defined')
        }
        if (maruo.vms[$id]) {
            throw Error('error: [' + $id + '] had been defined!')
        }
        var vm = {}
        new Observable(vm,definition, {
            id:$id
        })
        return maruo.vms[$id] = vm
    }
    
    maruo.scan = function (el) {
        
    }
}