/**
 * Created by cgspine on 16/7/9.
 */

import { oneObject } from '../util'
import config from '../config'

var $$skipArray = config.$$skipArray

export function vmFactory(definition) {
    var $skipArray = {}
    if (definition.$skipArray) {
       $skipArray =  oneObject(definition.$skipArray)
        delete definition.$skipArray
    }
    var accessors = {},
        key,val
    for (key in definition) {
        if ($$skipArray[key]) {
            continue
        }
        val = definition
    }
}