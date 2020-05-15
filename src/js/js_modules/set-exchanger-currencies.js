import createSelect from './logic_createSelect.js';

export default function(customEvents) {
	let targets = [this.crypto, this.fiat];
	let currency = customEvents.variables.currencies;
	let request = requests.sendGETRequest(requests.server, '/service/currencies');
	requests.processingFetch(request, responseObj => {
		sessionStorage.setItem('countries', JSON.stringify(responseObj.body));
		if (responseObj.ok) {
			for (let i = 0; i < targets.length; i++) {
				createSelect(targets[i], responseObj.body);
			}
		}
	})


}
//customEvents.variables.currencies
/*
{
	"crypto": [
		{"id":6,"name":"Bitcoin","displayCode":"BTC","displayDecimals":5},
		{"id":7,"name":"Ethereum","displayCode":"ETH","displayDecimals":5},
		{"id":8,"name":"Litecoin","displayCode":"LTC","displayDecimals":5},
		{"id":9,"name":"Bitcoin cash","displayCode":"BCH","displayDecimals":5},
		{"id":10,"name":"Ripple","displayCode":"XRP","displayDecimals":5}
	],
	"fiat": [
		{"id":11,"name":"US Dollar","displayCode":"USD","displayDecimals":2},
		{"id":12,"name":"Euro","displayCode":"EUR","displayDecimals":2}
	]
}


*/