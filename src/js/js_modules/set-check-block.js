"use strict";

import requests from './library-requests.js';
// import modal from './logic_modal.js';
import setTransactions from './logic_setTransactions.js';
import noUserDataAction from './logic_noUserDataAction.js';
import getURLParam from './method_getURLParametr.js';
import processingServerErrors from './logic_processingServerErrors.js';
import testTransaction from './test_getTransaction.js';


export default function() {
	// const changeModal = modal.bind(this);

	let transaction = getURLParam('transaction');
		if (transaction) {
			let dataToCallback = {
				resolve: setTransactions.bind(this), 
				reject: processingServerErrors.bind(this), 
				toResolve: {type: 'check'},
				toReject: {type: 'check'},
			};
			let request = requests.sendPOSTRequest(requests.server, '/user/check', {}, transaction);
			requests.processingFetch(request, requests.processingResponse, dataToCallback);

		// setTransactions(
		// 	testTransaction(), 
		// 	{type: 'check', context: this}
		// );
	} else {
		noUserDataAction.call(this, 'check');
	}
}