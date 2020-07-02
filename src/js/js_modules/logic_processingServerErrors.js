"use strict";

import modal from './logic_modal.js';

// this = TARGETS
export default function(responseObj, data) {
	// console.log(responseObj);
	// console.log(data);
	const changeModal = modal.bind(this);
	let text;
	let flag = (responseObj.status >= 400 && responseObj.status < 500) ? 400 : 500;
	switch(flag){
		case 400:
			text = 'Sorry, but the server is unavailable';
			break;
		default:
			text = 'Sorry, there was an internal server error';
			break;
	}
	// console.log(text);
	// console.log(data.type);
	if (data.type) {
		if (data.type == 'login' || data.type == 'create' || data.type == 'exchanger' || data.type == 'account') {
			changeModal(true,'custom-message', text);
		} else {
			changeModal(true, 'deferred-redirect-to-home', {text: text, timer: 15});
		}
	}
}