import createSelect from './logic_createSelect.js';

export default function(data, customEvents) {
	let targets = [this.crypto, this.fiat];
	let currency = customEvents.variables.currencies;

	for (let key in data) {
		let currencyArray = data[key];
		currency[key] = {};

		for (let i = 0; i < currencyArray.length; i++) {
			currency[key][currencyArray[i].id] = {
				name: currencyArray[i].name,
				displayCode: currencyArray[i].displayCode,
				displayDecimals: currencyArray[i].displayDecimals,
			};
		}
	}

	let dataForCreateSelect = [currency.crypto, currency.fiat];
	for (let i = 0; i < targets.length; i++) {
		let defaultCur = (i == 0) ? '3' : '4';
		createSelect('currency', targets[i], dataForCreateSelect[i], defaultCur);
	}
}

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