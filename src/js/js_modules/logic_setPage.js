"use strict";

// import impStateLib from './library-state.js';
// import impStateLocalLib from './library-state-local.js';
import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';

export default function(TARGETS) {
	for (let i = 0; i < TARGETS.tabs.length; i++) {
		TARGETS.tabs[i].classList.remove('active');
	}
	const tabCutain = document.getElementById('tab-cutain');
	let mode = stateLib.getStateValue.call(stateLocalLib, 'xpay_tab');
	if (mode == 'buy') {
		TARGETS.tabs[1].classList.add('active');
		tabCutain.classList.add('reverse');
	} else {
		TARGETS.tabs[0].classList.add('active');
		tabCutain.classList.remove('reverse');
	}

	// !!! костыль на старый калькулятор sell crypto
	// if (mode == 'sell') {
	// 	TARGETS.fiatQ.readOnly = true;
	// 	TARGETS.fiatQ.classList.add('not-changet');
	// } else {
	// 	TARGETS.fiatQ.readOnly = false;
	// 	TARGETS.fiatQ.classList.remove('not-changet');
	// }
	/************************************************/

	let disableAll = [
		'.to_toggle-sell', '.to_toggle-buy', 
		'.to_toggle-step-1', '.to_toggle-step-2', '.to_toggle-step-3',
		'.to_toggle-only-sell-3'
	];
	for (let i = 0; i < disableAll.length; i++) {
		let disableArray = document.querySelectorAll(disableAll[i]);
		for (let j = 0; j < disableArray.length; j++) {
			disableArray[j].classList.add('d-none');
		}
	}
	
	let to_enable = [];
	let slide = stateLib.getStateValue.call(stateLocalLib, 'xpay_slide');
	let add_to_enable = (slide == '1') ? '.to_toggle-step-1' :
											(slide == '2') ? '.to_toggle-step-2' : '.to_toggle-step-3';
	to_enable.push(add_to_enable);

	let tab = stateLib.getStateValue.call(stateLocalLib, 'xpay_tab');
	add_to_enable = (tab == 'sell') ? '.to_toggle-sell' : '.to_toggle-buy';
	to_enable.push(add_to_enable);
	if (slide == '3' && tab == 'sell') {
		to_enable.push('.to_toggle-only-sell-3');
	}
	for (let i = 0; i < to_enable.length; i++) {
		let enableArray = document.querySelectorAll(to_enable[i]);
		for (let j = 0; j < enableArray.length; j++) {
			enableArray[j].classList.remove('d-none');
		}
	}
}