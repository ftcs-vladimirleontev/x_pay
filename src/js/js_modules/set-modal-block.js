"use strict";

import modal from './logic_modal.js';

// this = TARGETS
export default function(customEvents) {
	const changeModal = modal.bind(this);

	this.modal_bc.addEventListener('click', ev => {changeModal(false);});

	this.modal_bd.addEventListener('click', ev => {
		this.ex_bn.innerText = customEvents.buttonText.next;
		let dataForEv = {targets: this, variables: customEvents.variables};
		dataForEv.type = stateLib.getStateValue.call(stateLocalLib, 'xpay_tab');
		let key = (dataForEv.type == 'sell') ? 'end-timer' : 'clean-transaction';
		customEvents.startEvent.call(customEvents, key, dataForEv);
		changeModal(true, 'deleted');
	});
}