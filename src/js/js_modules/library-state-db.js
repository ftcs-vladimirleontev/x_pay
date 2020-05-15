import DB_keys from './library-keys-db.js';
import defaultValuesArray from './library-default-state.js';
export default {
	all_keys: new Set(DB_keys),
	defaultValuesArray: defaultValuesArray,

	iAmHere: function () {
		return (localStorage.getItem('xpay')) ? true : false;
	},

	createDefault: function (time, setter, correcter, valueArray) {
		let defaultObj = {
			sell: {
				mail: null,
				wallet: null,
				benif_name: null,
				bank_name: null,
				swift: null,
				iban: null,
			},
			buy: {
				mail: null,
				phone: null,
				benif_country: null,
				bank_name: null,
				bank_country: null,
			},
		};
		localStorage.setItem('xpay', JSON.stringify(defaultObj));

		for (let i = 0; i < valueArray.length; i++) {
			if (valueArray[i].key == 'xpay_last_change') {
				setter(valueArray[i].key, correcter(time));
			} else {
				setter(valueArray[i].key, correcter(valueArray[i].value));
			}
		}
	},

	getValue: function (name) {
		let state = JSON.parse(localStorage.getItem('xpay'));
		if (state) {
			switch (name) {
				case 'xpay_sell_mail':
					return state.sell.mail;
				case 'xpay_sell_wallet':
					return state.sell.wallet;
				case 'xpay_sell_benif_name':
					return state.sell.benif_name;
				case 'xpay_sell_bank_name':
					return state.sell.bank_name;
				case 'xpay_sell_swift':
					return state.sell.swift;
				case 'xpay_sell_iban':
					return state.sell.iban;
				case 'xpay_buy_mail':
					return state.buy.mail;
				case 'xpay_buy_phone':
					return state.buy.phone;
				case 'xpay_buy_benif_country':
					return state.buy.benif_country;
				case 'xpay_buy_bank_name':
					return state.buy.bank_name;
				case 'xpay_buy_bank_country':
					return state.buy.bank_country;
			}
		} else {
			return 'no_state';
		}
	},

	setValue: function (name, value) {
		let state = JSON.parse(localStorage.getItem('xpay'));
		if (!state) {return false;}
		switch (name) {
			case 'xpay_sell_mail':
				state.sell.mail = value;
				break;
			case 'xpay_sell_wallet':
				state.sell.wallet = value;
				break;
			case 'xpay_sell_benif_name':
				state.sell.benif_name = value;
				break;
			case 'xpay_sell_bank_name':
				state.sell.bank_name = value;
				break;
			case 'xpay_sell_swift':
				state.sell.swift = value;
				break;
			case 'xpay_sell_iban':
				state.sell.iban = value;
				break;
			case 'xpay_buy_mail':
				state.buy.mail = value;
				break;
			case 'xpay_buy_phone':
				state.buy.phone = value;
				break;
			case 'xpay_buy_benif_country':
				state.buy.benif_country = value;
				break;
			case 'xpay_buy_bank_name':
				state.buy.bank_name = value;
				break;
			case 'xpay_buy_bank_country':
				state.buy.bank_country = value;
				break;
		}
		localStorage.setItem('xpay', JSON.stringify(state));
		return true;
	},

	deleteValue: function (name) {
		let state = JSON.parse(localStorage.getItem('xpay'));
		if (!state) {return false;}
		switch (name) {
			case 'xpay_sell_mail':
				state.sell.mail = null;
			case 'xpay_sell_wallet':
				state.sell.wallet = null;
			case 'xpay_sell_benif_name':
				state.sell.benif_name = null;
			case 'xpay_sell_bank_name':
				state.sell.bank_name = null;
			case 'xpay_sell_swift':
				state.sell.swift = null;
			case 'xpay_sell_iban':
				state.sell.iban = null;
			case 'xpay_buy_mail':
				state.buy.mail = null;
			case 'xpay_buy_phone':
				state.buy.phone = null;
			case 'xpay_buy_benif_country':
				state.buy.benif_country = null;
			case 'xpay_buy_bank_name':
				state.buy.bank_name = null;
			case 'xpay_buy_bank_country':
				state.buy.bank_country = null;
		}

		localStorage.setItem('xpay', JSON.stringify(state));
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
		// switch (type) {
		// 	case 'all':
		// 		setter('xpay_buy_mail', correcter(null));
		// 		setter('xpay_buy_phone', correcter(null));
		// 		setter('xpay_buy_benif_country', correcter(null));
		// 		setter('xpay_buy_bank_name', correcter(null));
		// 		setter('xpay_buy_bank_country', correcter(null));
		// 	case 'sell':
		// 		setter('xpay_sell_mail', correcter(null));
		// 		setter('xpay_sell_wallet', correcter(null));
		// 		setter('xpay_sell_benif_name', correcter(null));
		// 		setter('xpay_sell_bank_name', correcter(null));
		// 		setter('xpay_sell_swift', correcter(null));
		// 		setter('xpay_sell_iban', correcter(null));
		// 		break;
		// 	case 'buy':
		// 		setter('xpay_buy_mail', correcter(null));
		// 		setter('xpay_buy_phone', correcter(null));
		// 		setter('xpay_buy_benif_country', correcter(null));
		// 		setter('xpay_buy_bank_name', correcter(null));
		// 		setter('xpay_buy_bank_country', correcter(null));
		// 		break;
		// }
	},

	deleteState: function () {
		localStorage.removeItem('xpay');
	},

	correctDataIn: function (value) {
		return 	(typeof value == 'number') ? '' + value : 
						(typeof value == 'string' && value == '') ? null : value;
	},

	correctDataFrom: function (value) {
		return  (value === null) ? '' : value;
	},
}