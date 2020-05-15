/* #################### GLOBALLY LIBRARIES #################### */
import '../../node_modules/core-js/features/promise';

/* #################### CUSTOM LIBRARIES #################### */
import stateLib from './js_modules/library-state.js';
import stateLocalLib from './js_modules/library-state-local.js';
import stateGlobalLib from './js_modules/library-state-global.js';
import stateDBLib from './js_modules/library-state-db.js';
import customEvents from './js_modules/library-cust-ev.js';
import callback from './js_modules/library-cust-ev-callbacks.js';
import initPage from './js_modules/logic_initPage.js';
import modal from './js_modules/logic_modal.js';
import interval from './js_modules/interface_GetFunctionInTheInterval.js';


/* #################### CONSTANTS AND VARIABLES #################### */
const TARGETS = {
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
	ywg_q: document.getElementById('get-quantity'),
	ywg_c: document.getElementById('get-currency'),
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
const changeModal = modal.bind(TARGETS);

/* #################### LOGIC #################### */
/* set currencies */
import getCurrencies from './js_modules/logic_getCurrencies.js';
if (getCurrencies.call(customEvents)) {

} else {

}
import setCurrencies from './js_modules/set-exchanger-currencies.js';
setCurrencies.call(TARGETS, customEvents);
/* set country lists */
import setCountryLists from './js_modules/set-exchanger-country-lists.js';
setCountryLists.call(TARGETS);

/* synchronize state */
if (!stateLib.itsHere.call(stateGlobalLib)) {
	stateLib.init.call(stateLib, stateGlobalLib);
}
stateLib.init.call(stateLib, stateLocalLib);
stateLib.synchLocal.call(stateLib, stateGlobalLib, stateLocalLib);
stateLib.init.call(stateLib, stateDBLib);

/* set element listeners */
/* tabs */
import setExTabs from './js_modules/set-exchanger-tabs.js';
setExTabs.call(TARGETS, customEvents);
/* dropdowns */
import setExDrops from './js_modules/set-exchanger-dropdowns.js';
setExDrops.call(TARGETS, customEvents);
/* quantity inputs */
import setExQInp from './js_modules/set-exchanger-quan-inputs.js';
setExQInp.call(TARGETS, customEvents);
/* form2 */
import setExForm2 from './js_modules/set-exchanger-form2.js';
setExForm2.call(TARGETS);
/* exchanger buttons */
import setExButtons from './js_modules/set-exchanger-buttons.js';
setExButtons.call(TARGETS, customEvents);


/* set listeners for custom events */
for (const name of customEvents.events) {
	document.addEventListener(name, ev => {
		callback[name].call(customEvents, ev);
	});
}

/* init page */
initPage.call(TARGETS);

/* set synchronization with the global state */
window.addEventListener('blur', ev => {
	if(customEvents.checkRate) {
		customEvents.checkRate.stop();
	}
});
window.addEventListener('focus', ev => {
	stateLib.synchLocal.call(stateLib, stateGlobalLib, stateLocalLib);
	setTimeout(() => {
		initPage.call(TARGETS);
	}, 200);
});

/* open page */
changeModal(false);