// this = TARGETS
import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
import setSlide from './logic_setSlide.js';
import modal from './logic_modal.js';
import getErrors from './logic_getErrors.js';
import setErrors from './logic_setErrors.js';

export default function(customEvents) {
	const changeModal = modal.bind(this);

	this.ex_bb.addEventListener('click', ev => {
		let time = stateLib.getTime();
		stateLib.setStateValue.call(stateLocalLib, 'xpay_slide', 1, time);
		stateLib.setStateValue.call(stateGlobalLib, 'xpay_slide', 1, time);
		setSlide(1, this);
		// window.scrollTo(0, 200);
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
				setSlide(2, this);
			} else {
				changeModal(true, 'no-data-of-numbers');
			}
		} else if (+slide == 2) {
			let errors = getErrors.call(this, tab);
			if (!errors) {
				if (tab == 'sell' && !this.accept_si.checked) {
					changeModal(true, 'accept_si');
					return;
				}
				let dataForEv = {targets: this, variables: customEvents.variables, type: tab};
				let cusEv = customEvents.CreateCustomEvent('to-server-validation', dataForEv);
				customEvents.startCustomEvent(cusEv);
			} else {
				setErrors.call(this, tab, errors);
			}
		} else {
				let dataForEv = {targets: this, variables: customEvents.variables, type: tab};
				let cusEv = customEvents.CreateCustomEvent('finish-transaction', dataForEv);
				customEvents.startCustomEvent(cusEv);
		}
	});

	this.modal_bc.addEventListener('click', ev => {changeModal(false);});

	this.modal_bd.addEventListener('click', ev => {
		this.ex_bn.innerText = customEvents.buttonText.next;
		let dataForEv = {targets: this, variables: customEvents.variables};
		dataForEv.type = stateLib.getStateValue.call(stateLocalLib, 'xpay_tab');
		let key = (dataForEv.type == 'sell') ? 'end-timer' : 'clean-transaction';
		let cusEv = customEvents.CreateCustomEvent(key, dataForEv);
		customEvents.startCustomEvent(cusEv);
		changeModal(true, 'deleted');
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