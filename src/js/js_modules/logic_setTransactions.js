"use strict";

import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
import modal from './logic_modal.js';
import setTransactions from './logic_setTransactions.js';

import setTemplate from './logic_setTemplate.js';
import getDataForTransTempl from './logic_getDataForTransTemplate.js';
import setShowButtonListeners from './logic_setTransShowButtonListeners.js';
import setConfirmButtonListeners from './logic_setTransConfirmButtonListeners.js';
import processingResponseBodyErrors from './logic_processingResponseBodyErrors.js';
// import noUserDataAction from './logic_noUserDataAction.js';

export default function(responseObj, data) {
	const changeModal = modal.bind(this);
	// console.log(responseObj);
	// console.log(data);

	if (!responseObj.body.hasOwnProperty('errors')) {
		if (data.type == 'account') {setTransactionSynch();}
		setTemplate('transaction-item', getDataForTransTempl(responseObj.body), 'transactions');
		setShowButtonListeners('.transaction__show-details-button', 'active');
		setConfirmButtonListeners.call(this, setTransactions);
		correctingLayoutOfTheDateField();
		setTimeout(() => {
			changeModal(false);
		}, 1000);
		// changeModal(false);
	} else {
		processingResponseBodyErrors.call(this, responseObj, data);
		// noUserDataAction.call(this, data.type);
	}


	function setTransactionSynch() {
		window.addEventListener('focus', ev => {
			let transactionCompleted = stateLib.getStateValue.call(stateGlobalLib, 'xpay_transaction_completed');
			if (transactionCompleted) {
				let time = stateLib.getTime();
				stateLib.setStateValue.call(stateLocalLib, 'xpay_transaction_completed', false, time);
				stateLib.setStateValue.call(stateGlobalLib, 'xpay_transaction_completed', false, time);
				document.location.reload(true);
			}
		});
	}

	function correctingLayoutOfTheDateField() {
		let allDateField = document.querySelectorAll('.date');
		allDateField.forEach(function(item) {
			let text = item.innerHTML;
			let components = text.split('.');
			item.innerHTML = components[0] + '.' + components[1] + '.<wbr>' + components[2];
		});
	}
}