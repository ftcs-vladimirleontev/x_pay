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

	startEvent: function (key, dataForEv) {
		let cusEv = this.CreateCustomEvent(key, dataForEv);
		document.dispatchEvent(cusEv);
	},

	getIntervalFunction: interval,

	callbackToCheckRate: function (data) {
		let ev = data.event;
		let dataForEv = {targets: ev.detail.targets, variables: ev.detail.variables};
		if (data.counting) {
			let requests = ev.detail.requests;
			let ROUTE = '/service/calculate';
			let request = requests.sendPOSTRequest(
				requests.server, ROUTE, getRequestBody(data.customEvents.getCalculateObj(ev))
			);
			requests.processingFetch(request, responseObj => {
				dataForEv.value = responseObj.body.result;
				dataForEv.rate = responseObj.body.exchangeRate;
				data.customEvents.startEvent.call(data.customEvents, 'counted', dataForEv);
			});
		} else {
			dataForEv.value = '';
			dataForEv.rate = '';
			data.customEvents.startEvent.call(data.customEvents, 'end-counting', dataForEv);
		}

		function getRequestBody(calcObj) {
			return {
				"conversion_data": {
						"inputCurrency": calcObj.inputCur,
						"outputCurrency": calcObj.outputCur,
						"inputQuantity": calcObj.inputQuan,
						"outputQuantity": calcObj.outputQuan
				}
			}
		}
	},

	getCalculateObj: function(ev) {
		let state = ev.detail.stateLib;
		let local = ev.detail.stateLocalLib;
		let mode = state.getStateValue.call(local, 'xpay_tab');
		let type = state.getStateValue.call(local, 'xpay_conting_type');
		let inputCur, outputCur, inputQuan, outputQuan, quantity, amount;

		quantity = (type == 'crypto') ? 
			state.getStateValue.call(local, 'xpay_crypto_quan') : 
			state.getStateValue.call(local, 'xpay_fiat_quan');
		amount = quantity.replace(',', '.');
		inputCur = (mode == 'sell') ? 
			state.getStateValue.call(local, 'xpay_crypto') : 
			state.getStateValue.call(local, 'xpay_fiat');
		outputCur = (mode == 'sell') ? 
			state.getStateValue.call(local, 'xpay_fiat') :
			state.getStateValue.call(local, 'xpay_crypto');
		if (mode == 'sell') {
			inputQuan = (type == 'crypto') ? amount : null;
			outputQuan = (type == 'crypto') ? null : amount;
		} else {
			inputQuan = (type == 'crypto') ? null : amount;
			outputQuan = (type == 'crypto') ? amount : null;
		}
		return {
			inputCur: inputCur, outputCur: outputCur, inputQuan: inputQuan, outputQuan: outputQuan
		}
	},

	toCurrencyCode: function (type, id, currencies) {
		let curObj = (type == 'crypto') ? currencies.crypto : currencies.fiat;
		return curObj[id].displayCode;
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
			data.customEvents.startEvent.call(data.customEvents, 'end-timer', dataForEv);
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