/**
 * Created by cgspine on 16/7/21.
 */

import browser from  './browser'

var document = browser.document
var window = browser.window

var readyList = [], isReady
var fireReady = function (fn) {
    isReady = true
    while (fn = readyList.shift()) {
        fn()
    }
}

if(document.readyState === 'complete'){
    setTimeout(fireReady)
}else {
    document.addEventListener('DOMContentLoaded', fireReady)
}

window.addEventListener('load', fireReady)

export default function ready(fn) {
    if(!isReady){
        readyList.push(fn)
    }else{
        fn()
    }
}