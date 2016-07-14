/**
 * Created by cgspine on 16/7/9.
 */
import { rword } from '../util/const'

export default function (maruo) {

    /**
     * shadow copy
     * @param dest
     * @param source
     * @returns {*}
     */
    maruo.shadowCopy = function (dest, source) {
        for(var prop in source){
            dest[prop] = source[prop]
        }
        return dest
    }

    /**
     * a empty function
     */
    maruo.noop = function () {
        
    }
    
    
    maruo.rword = rword
}