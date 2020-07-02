"use strict";

const getCommonObj = function () {
	let commonObj = {};
	
	for (let i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] != 'object') {
			continue;
		} else {
			let list = [];
			for (let key in arguments[i]) {
				list.push(key);
			}
			for (let j = 0; j < list.length; j++) {
				commonObj[list[j]] = arguments[i][list[j]];
			}
		}
	}
	return commonObj;
}
export default getCommonObj;