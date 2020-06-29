import setVersion from './js_modules/set-version.js';
setVersion();
/* #################### GLOBALLY LIBRARIES #################### */
import '../../node_modules/core-js/features/promise';
// import _t from '../../node_modules/lodash.template';

/* #################### CUSTOM LIBRARIES #################### */

/* library for events */
import custEvLib from './js_modules/library-cust-ev.js';
/* network library */
import requests from './js_modules/library-requests.js';
/* methods */
import modal from './js_modules/logic_modal.js';
import setState from './js_modules/set-state.js';
import setModalBlock from './js_modules/set-modal-block.js';
import setExchangerBlock from './js_modules/set-exchanger-block.js';
import setAuthenticationBlock from './js_modules/set-authentication-block.js';
import setAccountBlock from './js_modules/set-account-block.js';
import setCheckBlock from './js_modules/set-check-block.js';
import setVerificationBlock from './js_modules/set-verivication-block.js';
// import setSlide from './js_modules/logic_setSlide.js';

/* #################### CONSTANTS AND VARIABLES #################### */
let TARGETS, changeModal, customEvents = custEvLib;

/* #################### LOGIC #################### */
window.onload = function() {
	TARGETS = {
		login_button: document.getElementById('login-button'),
		login_modal: document.getElementById('login-modal'),
		login_tabsArr: document.querySelectorAll('.authentication__tab'),
		login_sec_login: document.getElementById('login-section'),
		login_sec_create: document.getElementById('create-section'),
		login_ac_name_log: document.getElementById('account-name-login'),
		login_pass_log: document.getElementById('pass-login'),
		login_ac_name_cre: document.getElementById('account-name-create'),
		login_pass_cre: document.getElementById('pass-create'),
		login_conf_pass_cre: document.getElementById('confirm-pass-create'),
		login_do_button: document.getElementById('authentication-start-button'),
		login_close_button: document.getElementById('authentication-close-button'),
		exchanger: document.querySelector('.exchanger'),
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

	/* synchronize state */
	setState(window.xpayVer());

	/* set blocks */
	if (TARGETS.login_button && TARGETS.login_modal) {
		setAuthenticationBlock.call(TARGETS);
	}

	if (TARGETS.modal) {
		setModalBlock.call(TARGETS, customEvents);
	}

	if (TARGETS.exchanger) {
		requests.processMultipleGETRequests([
			requests.sendGETRequest(requests.server, '/service/currencies'), 
			requests.sendGETRequest(requests.server, '/service/countries'),
		], processingResponses);
	}

	if(document.querySelector('.account')){
		setAccountBlock.call(TARGETS);
	}

	if(document.querySelector('.check')){
		setCheckBlock.call(TARGETS);
	}

	if(document.querySelector('.verification')){
		setVerificationBlock.call(TARGETS);
	}


	let pagesWithoutLogic = new Set(['faq.html', 'legal.html']);
	let urlComponents = location.href.split('/');
	let page = urlComponents[urlComponents.length - 1].split('?')[0];
	if (pagesWithoutLogic.has(page)) {
		changeModal(false);
	}
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
			setExchangerBlock(values, TARGETS, customEvents, changeModal, window.xpayVer());
		} else {
			let text = 'Sorry, but it is not possible to get correct data ' 
				+ 'from the server for the web page to work. Try loading the page later';
			changeModal(true, 'timer-to-reload', {text: text, timer: 10});
		}
	} else {
		changeModal(true, 'timer-to-reload', {text: 'Sorry, but ' + error, timer: 10});
	}
}