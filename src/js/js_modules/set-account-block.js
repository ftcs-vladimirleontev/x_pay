"use strict";

import requests from './library-requests.js';
import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
// import modal from './logic_modal.js';
import setTransactions from './logic_setTransactions.js';
import noUserDataAction from './logic_noUserDataAction.js';
import processingServerErrors from './logic_processingServerErrors.js';
// import processingResponseBodyErrors from './logic_processingResponseBodyErrors.js';
import testTransactions from './test_getTransactions.js';


// this = TARGETS
export default function() {
	// const changeModal = modal.bind(this);
	let user = stateLib.getStateValue.call(stateLocalLib, 'xpay_user');
	this.account_acName.innerHTML = (user) ? JSON.parse(window.atob(user.split('.')[1])).username : '';
	// console.log(user);
	if (user) {
		// console.log('Вошел');
		let dataToCallback = {
			resolve: setTransactions.bind(this), 
			reject: processingServerErrors.bind(this), 
			toResolve: {type: 'account'},
			toReject: {type: 'account'},
		};
		let request = requests.sendGETRequest(requests.server, '/user/transactions', user);
		requests.processingFetch(request, requests.processingResponse, dataToCallback);
	} else {
		noUserDataAction.call(this, 'account');
		// processingResponseBodyErrors.call(this, 
		// 	{status: 200, body: {status: 401, errors: {userData: ['No user data']}}}, {type: 'account'}
		// );
	}
	// setTransactions.call(this, testTransactions(), {type: 'account'});
}