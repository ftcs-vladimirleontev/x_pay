"use strict";

import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
import requests from './library-requests.js';
import getURLParametr from './method_getURLParametr.js';
import noUserDataAction from './logic_noUserDataAction.js';
import processingServerErrors from './logic_processingServerErrors.js';
import processingResponseBodyErrors from './logic_processingResponseBodyErrors.js';

export default function() {
	let userData = getURLParametr('data');
	// console.log(userData);
	if (userData) {
		let dataToCallback = {
			resolve: ifResponseOk.bind(this), 
			reject: processingServerErrors.bind(this),
			toResolve: {type: 'verification',},
			toReject: {type: 'verification',},
		};
		let request = requests.sendGETRequest(requests.server, '/user/verification', userData);
		requests.processingFetch(request, requests.processingResponse, dataToCallback);
	} else {
		noUserDataAction.call(this, 'verification');
	}

	function ifResponseOk(responseObj, data) {
		if (!responseObj.body.hasOwnProperty('errors')) {
			stateLib.setStateValue.call(stateLocalLib, 'xpay_user', responseObj.body.token, stateLib.getTime());
			stateLib.synch.call(stateLib, stateGlobalLib, stateLocalLib);
			location.href = '../account.html';
		} else {
			processingResponseBodyErrors.call(this, responseObj, data);
		}
	}
}