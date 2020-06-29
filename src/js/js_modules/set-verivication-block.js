import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
import requests from './library-requests.js';
import getURLParametr from './method_getURLParametr.js';
import processingServerErrors from './logic_processingServerErrors.js';
import processingResponseBodyErrors from './logic_processingResponseBodyErrors.js';

export default function() {
	let dataToCallback = {
		resolve: ifResponseOk.bind(this), 
		reject: processingServerErrors.bind(this),
		toResolve: {type: 'verification',},
		toReject: {type: 'verification',},
	};
	let request = requests.sendGETRequestWithToken(requests.server, '/user/verification', getURLParametr('data'));
	requests.processingFetch(request, requests.processingResponse, dataToCallback);
	

	function ifResponseOk(responseObj, data) {
		if (responseObj.status = 200) {
			stateLib.setStateValue.call(stateLocalLib, 'xpay_user', responseObj.body.token, stateLib.getTime());
			stateLib.synch.call(stateLib, stateGlobalLib, stateLocalLib);
			location.href = '../account.html'
		} else {
			processingResponseBodyErrors.call(this, responseObj, data);
		}
	}
}