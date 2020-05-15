import requests from './library-requests.js';
import createSelect from './logic_createSelect.js';

export default function() {
	let targets = [this.benifC_bi, this.bankC_bi];
	let request = requests.sendGETRequest(requests.server, '/service/countries');
	requests.processingFetch(request, responseObj => {
		sessionStorage.setItem('countries', JSON.stringify(responseObj.body));
		if (responseObj.ok) {
			for (let i = 0; i < targets.length; i++) {
				createSelect('country', targets[i], responseObj.body);
			}
		}
	})
};

/*
	// function createSelect(target, data) {
	// 	let flag = true;
	// 	let output = '';
	// 	for (let key in data) {
	// 		if (flag) {
	// 			target.dataset.default = key;
	// 			flag = false;
	// 		}
	// 		let temtlate = `<option class="ex-step-2__option" value="${key}">${data[key]}</option>\n`;
	// 		output += temtlate
	// 	}
	// 	target.innerHTML = output;
	// }
*/