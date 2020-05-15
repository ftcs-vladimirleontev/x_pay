import state_keys from './library-keys-state.js';
import defaultValuesArray from './library-default-state.js';
export default {
	all_keys: new Set(state_keys),
	defaultValuesArray: defaultValuesArray,
	
	iAmHere: function () {
		let name = 'xpay_last_change';
		let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? true : false;
	},

	createDefault: function (time, setter, correcter, valueArray) {
		for (let i = 0; i < valueArray.length; i++) {
			if (valueArray[i].key == 'xpay_last_change') {
				setter(valueArray[i].key, correcter(time));
			} else {
				setter(valueArray[i].key, correcter(valueArray[i].value));
			}
		}
	},

	getValue: function (name) {
		let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : null;
	},

	setValue: function (name, value) {
		let options = {
			path: '/'
		};
		// if (options.expires.toUTCString) {
		//   options.expires = options.expires.toUTCString();
		// }
		let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
		for (let optionKey in options) {
			updatedCookie += "; " + optionKey;
			let optionValue = options[optionKey];
			if (optionValue !== true) {
				updatedCookie += "=" + optionValue;
			}
		}
		document.cookie = updatedCookie;
	},

	deleteValue: function (name) {
		setCookie(name, "", {
			'max-age': -1
		})
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
		// 		setter('xpay_tab', correcter('left'));
		// 		setter('xpay_slide', correcter(1));
		// 		setter('xpay_buy_b', correcter(false));
		// 		setter('xpay_buy_ic', correcter(null));
		// 		setter('xpay_buy_iq', correcter(null));
		// 		setter('xpay_buy_oc', correcter(null));
		// 	case 'sell':
		// 		setter('xpay_sell_b', correcter(false));
		// 		setter('xpay_sell_ic', correcter(null));
		// 		setter('xpay_sell_iq', correcter(null));
		// 		setter('xpay_sell_oc', correcter(null));
		// 		break;
		// 	case 'buy':
		// 		setter('xpay_buy_b', correcter(false));
		// 		setter('xpay_buy_ic', correcter(null));
		// 		setter('xpay_buy_iq', correcter(null));
		// 		setter('xpay_buy_oc', correcter(null));
		// 		break;
		// }
	},

	deleteState: function (all_keys, remover) {
		for (let key of all_keys) {
			remover(key);
		}
	},

	correctDataIn: function (value) {
		return 	(value === null) ? 'null' : 
						(value === false) ? 'false' :
						(value === true) ? 'true' : 
						(typeof value == 'number') ? '' + value : value;
	},

	correctDataFrom: function (value) {
		return 	(value === 'null') ? null : 
						(value === 'false') ? false :
						(value === 'true') ? true : value;
	},
}