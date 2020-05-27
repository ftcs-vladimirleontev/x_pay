/* #################### GLOBALLY LIBRARIES #################### */
import '../../node_modules/core-js/features/promise';

/* #################### CUSTOM LIBRARIES #################### */
/* library for state */
import stateLib from './js_modules/library-state.js';
import stateLocalLib from './js_modules/library-state-local.js';
import stateGlobalLib from './js_modules/library-state-global.js';
import stateDBLib from './js_modules/library-state-db.js';
/* library for events */
import customEvents from './js_modules/library-cust-ev.js';
import callback from './js_modules/library-cust-ev-callbacks.js';
/* network library */
import requests from './js_modules/library-requests.js';
/* methods */
import initPage from './js_modules/logic_initPage.js';
import modal from './js_modules/logic_modal.js';
import setCurrencies from './js_modules/set-exchanger-currencies.js';
import setCountryLists from './js_modules/set-exchanger-country-lists.js';
import setExTabs from './js_modules/set-exchanger-tabs.js';
import setExDrops from './js_modules/set-exchanger-dropdowns.js';
import setExQInp from './js_modules/set-exchanger-quan-inputs.js';
import setExForm2 from './js_modules/set-exchanger-form2.js';
import setExButtons from './js_modules/set-exchanger-buttons.js';

/* #################### CONSTANTS AND VARIABLES #################### */
let TARGETS, changeModal;

/* #################### LOGIC #################### */
window.onload = function() {
	TARGETS = {
		tabs: document.querySelectorAll('.exchanger__tab'),
		crypto: document.getElementById('crypto'),
		cryptoQ: document.getElementById('crypto-q'),
		fiat: document.getElementById('fiat'),
		fiatQ: document.getElementById('fiat-q'),
		mail_si: document.getElementById('mail-sell-i'),
		wallet_si: document.getElementById('wallet-sell-i'),
		benifN_si: document.getElementById('benif-name-sell-i'),
		bankN_si: document.getElementById('bank-name-sell-i'),
		swift_si: document.getElementById('swift-sell-i'),
		iban_si: document.getElementById('iban-sell-i'),
		accept_si: document.getElementById('i-accept-sell-i'),
		mail_bi: document.getElementById('mail-buy-i'),
		phone_bi: document.getElementById('phone-buy-i'),
		benifC_bi: document.getElementById('benif-country-buy-i'),
		bankN_bi: document.getElementById('bank-name-buy-i'),
		bankC_bi: document.getElementById('bank-country-buy-i'),
		cryptoQ_so: document.getElementById('crypto-q-sell-o'),
		walletX_so: document.getElementById('walet-xpay-sell-o'),
		fiatQ_so: document.getElementById('fiat-q-sell-o'),
		iban_so: document.getElementById('iban-sell-o'),
		timer_so: document.getElementById('timer-sell-o'),
		cryptoQ_bo: document.getElementById('crypto-q-buy-o'),
		fiatQ_bo: document.getElementById('fiat-q-buy-o'),
		bankN_bo: document.getElementById('bank-name-buy-o'),
		bankC_bo: document.getElementById('bank-country-buy-o'),
		benifC_bo: document.getElementById('benif-country-buy-o'),
		mail_bo: document.getElementById('mail-buy-o'),
		phone_bo: document.getElementById('phone-buy-o'),
		exHeader: document.getElementById('exchanger-header'),
		exTitle: document.getElementById('exchanger-title'),
		ex_bb: document.getElementById('ex-button-back'),
		ex_bn: document.getElementById('ex-button-next'),
		ex_bc: document.getElementById('ex-button-cansel'),
		modal: document.getElementById('modal-open'),
		modal_a: document.getElementById('modal-animation'),
		modal_t: document.getElementById('modal-text-container'),
		modal_b: document.getElementById('modal-buttons-block'),
		modal_bc: document.getElementById('modal-button-close'),
		modal_bd: document.getElementById('modal-button-do'),
		paste_first: document.querySelectorAll('.paste-first'),
		paste_second: document.querySelectorAll('.paste-second'),
		paste_first_f2: document.querySelectorAll('.paste-first-form2'),
		copy: document.querySelectorAll('.copy-button'),
		tmd_ywg: document.getElementById('tab-mode-descrip-ywg'),
		tmdf: document.getElementById('tab-mode-descrip-first'),
		tmds: document.getElementById('tab-mode-descrip-second'),
		ywg_q: document.getElementById('get-quantity'),
		ywg_c: document.getElementById('get-currency'),
	};
	changeModal = modal.bind(TARGETS);

	requests.processMultipleGETRequests([
		requests.sendGETRequest(requests.server, '/service/currencies'), 
		requests.sendGETRequest(requests.server, '/service/countries'),
	], processingResponses);
};


/* #################### FUNCTIONS #################### */
function processingResponses(values) {
	let error = null;
	for (let i = 0; i < values.length; i++) {
		if (values[i].hasOwnProperty('message')) {
			error = values[i].message;
			break;
		}
	}
	if (!error) {
		if ((values[0] && values[1]) && (typeof values[0] == 'object' && typeof values[1] == 'object'))
		{
			startLogic(values);
		} else {
			let text = 'Sorry, but it is not possible to get correct data ' 
				+ 'from the server for the web page to work. Try loading the page later';
			changeModal(true, 'timer-to-reload', {text: text, timer: 10});
		}
	} else {
		changeModal(true, 'timer-to-reload', {text: 'Sorry, but ' + error, timer: 10});
	}
}

function startLogic(values) {
	let dataForCurrencies = values[0];
	let dataForCountries = values[1];

	/* set currencies */
	setCurrencies.call(TARGETS, dataForCurrencies, customEvents);

	/* set country lists */
	setCountryLists.call(TARGETS, dataForCountries);

	/* synchronize state */
	if (!stateLib.itsHere.call(stateGlobalLib)) {
		stateLib.init.call(stateLib, stateGlobalLib);
	}
	stateLib.init.call(stateLib, stateLocalLib);
	stateLib.synchLocal.call(stateLib, stateGlobalLib, stateLocalLib);
	stateLib.init.call(stateLib, stateDBLib);

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

	/* open page */
	changeModal(false);
}