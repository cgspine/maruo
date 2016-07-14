/**
 * Created by cgspine on 16/7/9.
 */
import {vmFactory} from './factory'

export default function mixinViewModel(maruo){
    maruo.define = function (definition) {
        var $id = definition.$id;
        if(!$id){
            maruo.warn('vm.$id must be defined')
        }
        if (maruo.vms[$id]) {
            throw Error('error: [' + $id + '] had been defined!')
        }
        var vm = vmFactory(definition)
    }
    
    maruo.scan = function (el) {
        
    }
}