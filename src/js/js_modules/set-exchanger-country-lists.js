import createSelect from './logic_createSelect.js';

export default function(data) {
	sessionStorage.setItem('countries', JSON.stringify(data));
	let targets = [this.benifC_bi, this.bankC_bi];
	for (let i = 0; i < targets.length; i++) {
		createSelect('country', targets[i], data, 'EE');
	}
	// this.benifC_bi.value = this.benifC_bi.dataset.default;
	// this.bankC_bi.value = this.bankC_bi.dataset.default;
};