import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import getPageName from './method_getPageName.js';

export default function() {
	let user = stateLib.getStateValue.call(stateLocalLib, 'xpay_user');

	this.login_button.innerHTML = (getPageName() == 'account.html') ? 'log-out' : 
		(user) ? 'to see transactions' : 'log-in';
}