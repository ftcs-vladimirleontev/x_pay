"use strict";

import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
// import stateGlobalLib from './library-state-global.js';
import modal from './logic_modal.js';
import requests from './library-requests.js';
import processingServerErrors from './logic_processingServerErrors.js';

// this = TARGETS
export default function(callback) {
	const changeModal = modal.bind(this);
	let unconfirmed = document.querySelectorAll('.transaction__confirm-button');
	if (unconfirmed) {
		for (let i = 0; i < unconfirmed.length; i++) {
			unconfirmed[i].addEventListener('click', ev => {
				changeModal(true);
				let dataToCallback = {
					resolve: callback.bind(this), 
					reject: processingServerErrors.bind(this), 
					toResolve: {type: 'confirm'},
					toReject: {type: 'confirm'},
				};
				let request = requests.sendPOSTRequest(
					requests.server, 
					'/user/transactions/confirm', 
					{tarnsaction: ev.target.dataset.transaction}, 
					stateLib.getStateValue.call(stateLocalLib, 'user')
				);
				requests.processingFetch(request, requests.processingResponse, dataToCallback);
			});
		}
	}
}