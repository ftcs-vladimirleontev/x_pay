"use strict";

import requests from './library-requests.js';
import state from './library-state.js';
import local from './library-state-local.js';

export default function (responseObj, closureThis, dataForEv, changeModal) {
	let code = requests.responseIsNotOK(responseObj);
	if 	(	code >= 500 && code < 600) 
	{
		let cryptoValue = state.getStateValue.call(local, 'xpay_crypto');
		let cryptoCode = closureThis.variables.currencies.crypto[cryptoValue].displayCode;
		changeModal(true, 'destroyed', cryptoCode);
		closureThis.startEvent.call(closureThis, 'clean-transaction', dataForEv);
	} else {
		changeModal(true, 'server-not-available');
	}
}