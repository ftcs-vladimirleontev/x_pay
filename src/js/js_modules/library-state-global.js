"use strict";

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
		if (!value) {options['max-age'] = -1;}
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

	deleteValue: function (name, setter, defaultArray) {
		let value;
		for (let i = 0; i < defaultArray.length; i++) {
			if (defaultArray[i].key == name) {value = defaultArray[i].value}
			break;
		}
		setter(name, value);
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

	deleteState: function (all_keys, remover, setter, defaultArray) {
		for (let key of all_keys) {
			remover(key, setter, defaultArray);
		}
	},

	correctDataIn: function (value) {
		return 	(value === null) ? 'null' : 
						(value === false) ? 'false' :
						(value === true) ? 'true' : 
						(value === '') ? 'null' : 
						(typeof value == 'number') ? '' + value : value;
	},

	correctDataFrom: function (value) {
		return 	(value === 'null') ? null : 
						(value === 'false') ? false :
						(value === 'true') ? true : value;
	},
}