import state_keys from './library-keys-state.js';
import defaultValuesArray from './library-default-state.js';

export default {
	all_keys: new Set(state_keys),
	defaultValuesArray: defaultValuesArray,

	iAmHere: function () {
		return (sessionStorage.getItem('xpay')) ? true : false;
	},

	createDefault: function (time, setter, correcter, valueArray) {
		let defaultObj = {
			user: null,
			tab: null,
			slide: null,
			crypto: null,
			crypto_quan: null,
			fiat: null,
			fiat_quan: null,
			last_change: time,
			begin: false,
			time: null,
			data_sended: null,
			conting_type: null,
			conting_rate: null,
			wallet: null,
			version: null,
			transaction_completed: false,
		};
		sessionStorage.setItem('xpay', JSON.stringify(defaultObj));

		for (let i = 0; i < valueArray.length; i++) {
			if (valueArray[i].key == 'xpay_last_change') {
				setter(valueArray[i].key, correcter(time));
			} else {
				setter(valueArray[i].key, correcter(valueArray[i].value));
			}
		}
	},

	getValue: function (name) {
		let state = JSON.parse(sessionStorage.getItem('xpay'));
		switch (name) {
			case 'xpay_user':
				return state.user;
			case 'xpay_transaction_completed':
				return state.transaction_completed;
			case 'xpay_tab':
				return state.tab;
			case 'xpay_slide':
				return state.slide;
			case 'xpay_last_change':
				return state.last_change;
			case 'xpay_crypto':
				return state.crypto;
			case 'xpay_crypto_quan':
				return state.crypto_quan;
			case 'xpay_fiat':
				return state.fiat;
			case 'xpay_fiat_quan':
				return state.fiat_quan;
			case 'xpay_begin':
				return state.begin;
			case 'xpay_time':
				return state.time;
			case 'xpay_data_is_sended':
				return state.data_sended;
			case 'xpay_conting_type':
				return state.conting_type;
			case 'xpay_conting_rate':
				return state.conting_rate;
			case 'xpay_wallet':
				return state.wallet;
			case 'xpay_version':
				return state.version;
		}
	},

	setValue: function (name, value) {
		let state = JSON.parse(sessionStorage.getItem('xpay'));
		if (!state) {return false;}
		switch (name) {
			case 'xpay_user':
				state.user = value;
				break;
			case 'xpay_transaction_completed':
				state.transaction_completed = value;
				break;
			case 'xpay_tab':
				state.tab = value;
				break;
			case 'xpay_slide':
				state.slide = value;
				break;
			case 'xpay_last_change':
				state.last_change = value;
				break;
			case 'xpay_crypto':
				state.crypto = value;
				break;
			case 'xpay_crypto_quan':
				state.crypto_quan = value;
				break;
			case 'xpay_fiat':
				state.fiat = value;
				break;
			case 'xpay_fiat_quan':
				state.fiat_quan = value;
				break;
			case 'xpay_begin':
				state.begin = value;
				break;
			case 'xpay_time':
				state.time = value;
				break;
			case 'xpay_data_is_sended':
				state.data_sended = value;
				break;
			case 'xpay_conting_type':
				state.conting_type = value;
				break;
			case 'xpay_conting_rate':
				state.conting_rate = value;
				break;
			case 'xpay_wallet':
				state.wallet = value;
				break;
			case 'xpay_version':
				state.version = value;
				break;
		}
		sessionStorage.setItem('xpay', JSON.stringify(state));
		return true;
	},

	deleteValue: function (name, setter) {
		let state = JSON.parse(sessionStorage.getItem('xpay'));
		if (!state) {return false;}
		switch (name) {
			case 'xpay_user':
				state.user = null;
				break;
			case 'xpay_transaction_completed':
				state.transaction_completed = false;
				break;
			case 'xpay_tab':
				state.tab = null;
				break;
			case 'xpay_slide':
				state.slide = null;
				break;
			case 'xpay_last_change':
				state.last_change = null;
				break;
			case 'xpay_crypto':
				state.crypto = null;
				break;
			case 'xpay_crypto_quan':
				state.crypto_quan = null;
				break;
			case 'xpay_fiat':
				state.fiat = null;
				break;
			case 'xpay_fiat_quan':
				state.fiat_quan = null;
				break;
			case 'xpay_begin':
				state.begin = null;
				break;
			case 'xpay_time':
				state.time = null;
				break;
			case 'xpay_data_is_sended':
				state.data_sended = null;
				break;
			case 'xpay_conting_type':
				state.conting_type = null;
				break;
			case 'xpay_conting_rate':
				state.conting_rate = null;
				break;
			case 'xpay_wallet':
				state.wallet = null;
				break;
			case 'xpay_version':
				state.version = null;
				break;
		}
		sessionStorage.setItem('xpay', JSON.stringify(state));
		return true;
	},

	getAll: function(all_keys, getter, correcter) {
		let output = {};
		for (let key of all_keys) {
			output[key] = correcter(getter(key));
		}
		return output;
	},

	clean: function (remover) {
		for (let key of all_keys) {
			remover(key);
		}
	},
	
	deleteState: function () {
		sessionStorage.removeItem('xpay');
	},

	correctDataIn: function (value) {
		return 	(!value) ? null :
						(typeof value == 'number') ? '' + value : value;
						
	},

	correctDataFrom: function (value) {
		return 	(value === null) ? '' : value;
	},
}