import stateLib from './library-state.js';
import stateDBLib from './library-state-db.js';

export default function() {
	const KEYS = {
		service: new Set([
			'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'
		]),
		numbers: new Set([
			'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
		]),
		separators: new Set([
			'(', ')', '+', '-'
		]),
	};

	this.mail_si.addEventListener('change', ev => {
		changeValueInState(ev);
	});
	this.wallet_si.addEventListener('change', ev => {
		changeValueInState(ev);
	});
	this.wallet_si.addEventListener('keydown', ev => {
		if (ev.key && ev.key.match(/[A-Za-z0-9]/) === null) {
			ev.preventDefault();
		};
	});
	this.benifN_si.addEventListener('change', ev => {
		changeValueInState(ev);
	});
	this.bankN_si.addEventListener('change', ev => {
		changeValueInState(ev);
	});
	this.swift_si.addEventListener('change', ev => {
		changeValueInState(ev);
	});
	this.iban_si.addEventListener('change', ev => {
		changeValueInState(ev);
	});


	this.mail_bi.addEventListener('change', ev => {
		changeValueInState(ev);
	});
	this.phone_bi.addEventListener('keydown', ev => {
		if (
			!KEYS.numbers.has(ev.key) && 
			!KEYS.service.has(ev.key) && 
			!KEYS.separators.has(ev.key)
		) {
			ev.preventDefault();
		} else {
			let value = ev.target.value;
			if (ev.key == '+' && value.indexOf('+') != -1) {
				ev.preventDefault();
			}
			if (ev.key == '(' && value.indexOf('(') != -1) {
				ev.preventDefault();
			}
			if (ev.key == ')' && value.indexOf(')') != -1) {
				ev.preventDefault();
			}
			if (!KEYS.service.has(ev.key) && value.length > 17) {
				ev.preventDefault();
				return;
			}
		}
	});
	this.phone_bi.addEventListener('change', ev => {
		changeValueInState(ev);
	});
	this.benifC_bi.addEventListener('change', ev => {
		changeValueInState(ev);
	});
	this.bankN_bi.addEventListener('change', ev => {
		changeValueInState(ev);
	});
	this.bankC_bi.addEventListener('change', ev => {
		changeValueInState(ev);
	});

	this.accept_si.addEventListener('change',  ev => {
		ev.target.classList.toggle('active');
	})

	function changeValueInState(ev) {
		if (ev.target.value) {
			ev.target.parentElement.classList.remove('error');
		}
		let time = stateLib.getTime();
		let key;
		switch(ev.target.id) {
			case 'mail-sell-i':
				key = 'xpay_sell_mail';
				break;
			case 'wallet-sell-i':
				key = 'xpay_sell_wallet';
				break;
			case 'benif-name-sell-i':
				key = 'xpay_sell_benif_name';
				break;
			case 'bank-name-sell-i':
				key = 'xpay_sell_bank_name';
				break;
			case 'swift-sell-i':
				key = 'xpay_sell_swift';
				break;
			case 'iban-sell-i':
				key = 'xpay_sell_iban';
				break;
			case 'mail-buy-i':
				key = 'xpay_buy_mail';
				break;
			case 'phone-buy-i':
				key = 'xpay_buy_phone';
				break;
			case 'benif-country-buy-i':
				key = 'xpay_buy_benif_country';
				break;
			case 'bank-name-buy-i':
				key = 'xpay_buy_bank_name';
				break;
			case 'bank-country-buy-i':
				key = 'xpay_buy_bank_country';
				break;
		}
		stateLib.setStateValue.call(stateDBLib, key, ev.target.value, time);
	}
}