/**
 * Created by cgspine on 16/7/21.
 */

var browser = {
    window: global,
    document: { //方便在nodejs环境不会报错
        createElement: function () {
            return {}
        },
        createElementNS: function(){
            return {}
        },
        contains: Boolean
    },
    root: {
        outerHTML: 'x'
    },
    singletonDiv: {},
    singletonFragment: null
}

if(window.location && window.navigator && window.window){
    var document = window.document
    browser.document = document
    browser.root = document.documentElement
    browser.singletonDiv = document.createElement('div')
    browser.singletonFragment = document.createDocumentFragment()
}

export default browser