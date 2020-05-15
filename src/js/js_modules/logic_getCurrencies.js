import requests from './library-requests.js';

export default function() {
	let currency = this.variables.currencies;
	return new Promise(function(resolve, reject) {
		let request = requests.sendGETRequest(requests.server, '/service/currencies');
		requests.processingFetch(request, responseObj => {
			if (responseObj.ok) {

			} else {
				reject(responseObj);
			}
		});
	})
}