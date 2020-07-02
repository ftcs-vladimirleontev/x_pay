"use strict";

import createSelect from './logic_createSelect.js';

export default function(data) {
	sessionStorage.setItem('countries', JSON.stringify(data));
	let targets = [this.benifC_bi, this.bankC_bi];
	for (let i = 0; i < targets.length; i++) {
		createSelect('country', targets[i], data, 'EE');
	}
};