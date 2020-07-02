"use strict";

// this = TARGETS
import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
import modal from './logic_modal.js';
import setSlide from './logic_setSlide.js';
import getErrors from './logic_getErrors.js';
import setErrors from './logic_setErrors.js';

export default function(customEvents) {
	const changeModal = modal.bind(this);

	this.ex_bb.addEventListener('click', ev => {
		let time = stateLib.getTime();
		stateLib.setStateValue.call(stateLocalLib, 'xpay_slide', 1, time);
		stateLib.setStateValue.call(stateGlobalLib, 'xpay_slide', 1, time);
		this.ex_bn.innerText = customEvents.buttonText.next;
		setSlide(1, this);
	});

	this.ex_bc.addEventListener('click', ev => {
		changeModal(true, 'confirm');
	});

	this.ex_bn.addEventListener('click', ev => {
		let tab = stateLib.getStateValue.call(stateLocalLib, 'xpay_tab');
		let slide = stateLib.getStateValue.call(stateLocalLib, 'xpay_slide');

		if (+slide == 1) {
			if (parseFloat(this.cryptoQ.value) && parseFloat(this.fiatQ.value)) {
				let time = stateLib.getTime();
				stateLib.setStateValue.call(stateLocalLib, 'xpay_slide', 2, time);
				stateLib.setStateValue.call(stateGlobalLib, 'xpay_slide', 2, time);
				this.ex_bn.innerText = customEvents.buttonText.send;
				setSlide(2, this);
			} else {
				if (parseFloat(this.cryptoQ.value) === 0 || parseFloat(this.fiatQ.value) === 0) {
					changeModal(true, 'null-data');
				} else {
					changeModal(true, 'no-data-of-numbers');
				}
			}
		} else if (+slide == 2) {
			let errors = getErrors.call(this, 'exchanger', {tab: tab});
			if (!errors) {
				if (tab == 'sell' && !this.accept_si.checked) {
					changeModal(true, 'accept_si');
					return;
				}
				let dataForEv = {targets: this, variables: customEvents.variables, type: tab};
				customEvents.startEvent.call(customEvents, 'to-server-validation', dataForEv);
			} else {
				setErrors.call(this, 'exchanger', {tab: tab, errors: errors});
			}
		} else {
				let dataForEv = {targets: this, variables: customEvents.variables, type: tab};
				customEvents.startEvent.call(customEvents, 'finish-transaction', dataForEv);
		}
	});

	/* copy buttons */
	for (let i = 0; i < this.copy.length; i++) {
		this.copy[i].addEventListener('click', ev => {
			let target = document.getElementById(ev.target.dataset.id);
			getValueInBufer(target);
			let elemCopied = ev.target.previousElementSibling;
			if (!elemCopied.classList.contains('active')) {
				elemCopied.classList.add('active');
				setTimeout(elemCopied => {
					elemCopied.classList.remove('active');
				}, 2000, elemCopied);
			}

			function getValueInBufer(target) {
				target.select();
				document.execCommand("copy");
				clearSelection();

				function clearSelection() {
					if (window.getSelection) {
						window.getSelection().removeAllRanges();
					} else { // old IE
						document.selection.empty();
					}
				}
			}
		});	
	}
}