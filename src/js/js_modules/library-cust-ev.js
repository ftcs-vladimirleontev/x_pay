import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
import stateDBLib from './library-state-db.js';
import setData from './library-set-data.js';
import setPage from './logic_setPage.js';
import requests from './library-requests.js';
import interval from './interface_GetFunctionInTheInterval.js';
import setSlide from './logic_setSlide.js';
import modal from './logic_modal.js';

const eventList = [
	'tab-is-clicked', 
	'currency-select-is-changed', 
	'currency-input-is-changed', 
	'start-counting',
	'end-counting',
	'change-counting', 
	'counted',
	'inputs-is-cleaned', 
	'to-server-validation',
	'transaction-is-started', 
	'start-timer', 
	'end-timer', 
	'clean-transaction', 
	'finish-transaction',
];

export default {
	events: new Set(eventList),

	eventDebag: function(eventName) {
		// console.log(eventName);
	},

	responseErrors: {
		iban: 'Error! Check and enter the correct account number',
		email: 'Error! Check and enter the correct email',
		both: 'Error! Check and enter the correct email and account number',
	},

	buttonText: {
		next: "NEXT",
		send: "SEND APPLICATION",
		paid: "I PAID"
	},

	form1_text: {
		tmd: {
			sell: {
				first: 'sell',
				second: 'get',
				ywg: 'You will get: ',
			},
			buy: {
				first: 'buy',
				second: 'give',
				ywg: 'You will give: ',
			},
		},
	},

	variables: {
		changeTimeoutID: null,
		changeTimeout: 800,
		countingTimeout: 3000,
		countingData: {
			counting: false,
			customEvents: null,
			event: null,
			// targets: null,
			// mode: null,
			// input: null,
			// output: null,
			// quantity: null,
		},
		timerData: {
			begin: null,
			target: null,
			getTime: null,
			customEvents: null,
			targets: null,
			type: null,
			modal: null,
		},
		currencies: {},
	},

	CreateCustomEvent: function (name, data) {
		let to_event = {
			detail: {
				stateLib: stateLib,
				stateLocalLib: stateLocalLib,
				stateGlobalLib: stateGlobalLib,
				stateDBLib: stateDBLib,
				setData: setData,
				setPage: setPage,
				setSlide: setSlide,
				requests: requests,
				modal: modal,
				
			},
		};
		for (const key in data) {
			to_event.detail[key] = data[key];
		}
		return new CustomEvent(name, to_event);
	},

	startCustomEvent: function (event) {
		document.dispatchEvent(event);
	},

	getIntervalFunction: interval,

	callbackToCheckRate: function (data) {
		let ev = data.event;
		let state = ev.detail.stateLib;
		let local = ev.detail.stateLocalLib;
		let requests = ev.detail.requests;

		let mode = state.getStateValue.call(local, 'xpay_tab');
		let type = state.getStateValue.call(local, 'xpay_conting_type');
		let input, output, quantity, amount;

		let ROUTE = (mode == 'sell') ? '/server/pair/' : '/crypto/buy/calculate';
		// let ROUTE = (mode == 'sell') ? '/crypto/sell/calculate' : '/crypto/buy/calculate';
		if (type == 'crypto') {
			// input = ev.detail.targets.crypto.value;
			// output = ev.detail.targets.fiat.value;
			input = toCurrencyCode('crypto', ev.detail.targets.crypto.value);
			output = toCurrencyCode('fiat', ev.detail.targets.fiat.value);
			quantity = ev.detail.targets.cryptoQ.value;
		} else {
			// input = ev.detail.targets.fiat.value;
			// output = ev.detail.targets.crypto.value;
			input = toCurrencyCode('fiat', ev.detail.targets.fiat.value);
			output = toCurrencyCode('crypto', ev.detail.targets.crypto.value);
			quantity = ev.detail.targets.fiatQ.value;
		}
		amount = quantity.replace(',', '.');

		let requestRoute = (mode == 'buy') ? 
			getBuyURL(ROUTE, input, output, amount) : getSellURL(ROUTE, input, output, amount);
		// let requestRoute = getURL(ROUTE, data.input, data.output, amount);
		let request = requests.sendGETRequest(requests.server, requestRoute);
		requests.processingFetch(request, responseObj => {
			let value = (mode == 'buy') ? responseObj.body.amount : responseObj.body;
			let rate = (mode == 'buy') ? responseObj.body.exchangeRate : null;

			let dataForEv = {targets: ev.detail.targets, variables: ev.detail.variables};
			dataForEv.value = (data.counting) ? value : '';
			dataForEv.rate = (data.counting) ? rate : null;
			let key = (data.counting) ? 'counted' : 'end-counting';
			let cusEv = data.customEvents.CreateCustomEvent(key, dataForEv);
			data.customEvents.startCustomEvent(cusEv);
		});

		function toCurrencyCode(type, id) {
			let curObj = (type == 'crypto') ? 
				ev.detail.variables.currencies.crypto : ev.detail.variables.currencies.fiat;
			return curObj[id].displayCode;
		}

	
		function getBuyURL(ROUTE, input, output, quantity) {
			let entering = 'entering=' + input;
			let calculate = 'calculate=' + output;
			let amount = 'quantity=' + quantity;
			let params = '?' + entering + '&' + calculate + '&' + amount
			return ROUTE + params;
		}

		function getSellURL(ROUTE, input, output, quantity) {
			return (ROUTE + input + '/' + output + '/' + quantity);
		}

		function getURL(ROUTE, input, output, quantity) {
			let entering = 'entering=' + input;
			let calculate = 'calculate=' + output;
			let amount = 'quantity=' + quantity;
			let params = '?' + entering + '&' + calculate + '&' + amount
			return ROUTE + params;
		}
	},

	callbackTimer: function (data) {
		const TIME_INTERVAL = 20 * 60 * 1000;
		// const TIME_INTERVAL = 1 * 10 * 1000;
		let time = data.getTime();
		let timeLeft = TIME_INTERVAL - (+time - (+data.begin));
		if (timeLeft <= 0) {
			let dataForEv = {
				targets: data.targets, variables: data.customEvents.variables, type: data.type
			};
			let cusEv = data.customEvents.CreateCustomEvent('end-timer', dataForEv);
			data.customEvents.startCustomEvent(cusEv);
			data.changeModal(true, 'time-is-up');
		} else {
			setTime(timeLeft, data);
		}

		function setTime(timeLeft, data) {
			let minutes = Math.trunc((timeLeft / 1000) / 60);
			let seconds = Math.trunc((timeLeft - (minutes * 60 * 1000)) / 1000);
			let minutes_out = (minutes < 10) ? '0' + minutes : '' +  minutes;
			let seconds_out = (seconds < 10) ? '0' + seconds : '' +  seconds;
			let output = `${minutes_out}:${seconds_out}`;
			data.target.innerHTML = output;
		}
	},

}