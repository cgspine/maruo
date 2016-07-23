/**
 * Created by cgspine on 16/7/23.
 */

import maruo from '../maruo'
import { oneObject } from '../util'

var directives = maruo.directives
var eventMap = oneObject('animationend,blur,change,input,click,dblclick,focus,keydown,keypress,' +
    'keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit')

function extractBinds(cur, props) {
    
}