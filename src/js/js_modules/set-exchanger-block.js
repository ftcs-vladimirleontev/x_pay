/* libraries for state */
import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
/* library for events */
import callback from './library-cust-ev-callbacks.js';
/* methods */
import initPage from './logic_initPage.js';
import setCurrencies from './set-exchanger-currencies.js';
import setCountryLists from './set-exchanger-country-lists.js';
import setExTabs from './set-exchanger-tabs.js';
import setExDrops from './set-exchanger-dropdowns.js';
import setExQInp from './set-exchanger-quan-inputs.js';
import setExForm2 from './set-exchanger-form2.js';
import setExButtons from './set-exchanger-buttons.js';
import setSlide from './logic_setSlide.js';



export default function (values, TARGETS, customEvents, changeModal, VERSION) {
	// const changeModal = modal.bind(TARGETS);
	let dataForCurrencies = values[0];
	let dataForCountries = values[1];

	/* set currencies */
	setCurrencies.call(TARGETS, dataForCurrencies, customEvents);

	/* set country lists */
	setCountryLists.call(TARGETS, dataForCountries);

	/* set element listeners */
	/* tabs */
	setExTabs.call(TARGETS, customEvents);
	/* dropdowns */
	setExDrops.call(TARGETS, customEvents);
	/* quantity inputs */
	setExQInp.call(TARGETS, customEvents);
	/* form2 */
	setExForm2.call(TARGETS);
	/* exchanger buttons */
	setExButtons.call(TARGETS, customEvents);

	/* set listeners for custom events */
	for (const name of customEvents.events) {
		document.addEventListener(name, ev => {
			callback[name].call(customEvents, ev);
		});
	}

	/* init page */
	initPage.call(TARGETS, customEvents);

	/* set synchronization with the global state */
	window.addEventListener('blur', ev => {
		if(customEvents.checkRate) {
			customEvents.checkRate.stop();
		}
	});
	window.addEventListener('focus', ev => {
		stateLib.synchLocal.call(stateLib, stateGlobalLib, stateLocalLib);
		setTimeout(() => {
			initPage.call(TARGETS, customEvents);
		}, 100);
	});


	// setSlide(3, TARGETS);
	/* open page */
	changeModal(false);
}