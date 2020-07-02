"use strict";

/* libraries for state */
import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
/* library for events */
import callback from './library-cust-ev-callbacks.js';
/* methods */
import modal from './logic_modal.js';
import initPage from './logic_initPage.js';
import setCurrencies from './set-exchanger-currencies.js';
import setCountryLists from './set-exchanger-country-lists.js';
import setExTabs from './set-exchanger-tabs.js';
import setExDrops from './set-exchanger-dropdowns.js';
import setExQInp from './set-exchanger-quan-inputs.js';
import setExForm2 from './set-exchanger-form2.js';
import setExButtons from './set-exchanger-buttons.js';
import setSlide from './logic_setSlide.js';



export default function (values, customEvents, VERSION) {
	const changeModal = modal.bind(this);

	let dataForCurrencies = values[0];
	let dataForCountries = values[1];

	/* set currencies */
	setCurrencies.call(this, dataForCurrencies, customEvents);

	/* set country lists */
	setCountryLists.call(this, dataForCountries);

	/* set element listeners */
	/* tabs */
	setExTabs.call(this, customEvents);
	/* dropdowns */
	setExDrops.call(this, customEvents);
	/* quantity inputs */
	setExQInp.call(this, customEvents);
	/* form2 */
	setExForm2.call(this);
	/* exchanger buttons */
	setExButtons.call(this, customEvents);

	/* set listeners for custom events */
	for (const name of customEvents.events) {
		document.addEventListener(name, ev => {
			callback[name].call(customEvents, ev);
		});
	}

	/* init page */
	initPage.call(this, customEvents);

	/* set synchronization with the global state */
	window.addEventListener('blur', ev => {
		if(customEvents.checkRate) {
			customEvents.checkRate.stop();
		}
	});
	window.addEventListener('focus', ev => {
		stateLib.synchLocal.call(stateLib, stateGlobalLib, stateLocalLib);
		setTimeout(() => {
			initPage.call(this, customEvents);
		}, 100);
	});


	// setSlide(3, this);
	/* open page */
	changeModal(false);
}