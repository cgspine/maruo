/**
 * Created by cgspine on 16/7/9.
 */

require('./lang')

import maruo from './maruo'
import mixinCore from './core'
import mixinViewModel from './vm'
import mixinEvent from  './event'
import mixinDom from './dom'
import mixinAjax from './ajax'
import mixinDirectives from './directives'


mixinCore(maruo)
mixinViewModel(maruo)
mixinEvent(maruo)
mixinDom(maruo)
mixinAjax(maruo)
mixinDirectives(maruo)

export default maruo