/**
 * Created by cgspine on 16/7/23.
 */

import expr from './expr'
import text from './text'
import controller from './controller'

export default function mixinDirectives(maruo){
    maruo.directive('expr', expr)
    maruo.directive('text', text)
    maruo.directive('controller', controller)
}