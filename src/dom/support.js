/**
 * Created by cgspine on 16/8/13.
 */
import browser from './browser'

var support = {}


var input = browser.document.createElement('input'),
    select = browser.document.createElement( "select" ),
    opt = select.appendChild( browser.document.createElement( "option" ) )
input.type = "checkbox";

// Support: Android <=4.3 only
// Default value for a checkbox should be "on"
support.checkOn = input.value !== "";

// Support: IE <=11 only
// Must access selectedIndex to make default options select
support.optSelectedDefault = opt.selected;


// Support: IE <=11 only
// An input loses its value after becoming a radio
input = browser.document.createElement( "input" );
input.value = "t";
input.type = "radio";
support.radioValue = input.value === "t";


export default support