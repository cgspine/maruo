/**
 * Created by cgspine on 16/8/13.
 */
import browser from './browser'

var support = {}


var input = browser.document.createElement('input')
input.type = "checkbox";

// Support: Android <=4.3 only
// Default value for a checkbox should be "on"
support.checkOn = input.value !== "";

export default support