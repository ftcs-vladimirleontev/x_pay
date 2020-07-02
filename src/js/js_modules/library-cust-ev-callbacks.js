// import getETHWallet from './logic_getETHWallet.js';
import processingNot200 from './logic_processingNot200.js';
import processingServerErrors from './logic_processingServerErrors.js';
import processingResponseBodyErrors from './logic_processingResponseBodyErrors.js';

// this = customEvents
export default {
	'tab-is-clicked': function (ev) {
		this.eventDebag('tab-is-clicked');
		let time = ev.detail.time || ev.detail.stateLib.getTime();
	
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'xpay_tab', ev.detail.mode, time
		);
		ev.detail.setPage(ev.detail.targets);

		if (ev.detail.mode == 'sell') {
			ev.detail.targets.tmdf.innerHTML = this.form1_text.tmd.sell.first;
			ev.detail.targets.tmds.innerHTML = this.form1_text.tmd.sell.second;
			ev.detail.targets.tmd_ywg.innerHTML = this.form1_text.tmd.sell.ywg;
		} else {
			ev.detail.targets.tmdf.innerHTML = this.form1_text.tmd.buy.first;
			ev.detail.targets.tmds.innerHTML = this.form1_text.tmd.buy.second;
			ev.detail.targets.tmd_ywg.innerHTML = this.form1_text.tmd.buy.ywg;;
		}
		ev.detail.targets.ywg_q.innerHTML = '0';

		if (ev.detail.variables.countingData.counting) {
			ev.detail.variables.countingData.counting = false;
		}

		ev.detail.targets.crypto.value = ev.detail.targets.crypto.dataset.default;
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'xpay_crypto', ev.detail.targets.crypto.dataset.default, time
		);
		ev.detail.targets.cryptoQ.value = '';
		ev.detail.stateLib.deleteStateValue.call(ev.detail.stateLocalLib, 'xpay_crypto_quan', time);
		ev.detail.targets.fiat.value = ev.detail.targets.fiat.dataset.default;
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'xpay_fiat', ev.detail.targets.fiat.dataset.default, time
		);
		ev.detail.targets.fiatQ.value = '';
		ev.detail.stateLib.deleteStateValue.call(ev.detail.stateLocalLib, 'xpay_fiat_quan', time);
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);

		let dataForEv = {	targets: ev.detail.targets,variables: ev.detail.variables,};
		this.startEvent.call(this, 'inputs-is-cleaned', dataForEv);
	},

	'currency-select-is-changed': function (ev) {
		this.eventDebag('currency-select-is-changed');
		ev.detail.setData.setDropdownInState.call(
			ev.detail.setData, ev.detail.type, ev.detail.targets
		);
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);

		let currencyObj = this.variables.currencies[ev.detail.type];
		let value = (ev.detail.type == 'crypto') ? 
			+ev.detail.targets.crypto.value : +ev.detail.targets.fiat.value;
		let currencyCode = currencyObj[value].displayCode;

		if (ev.detail.type == 'fiat') {
			ev.detail.targets.ywg_c.innerHTML = currencyCode;
		}

		let tab = ev.detail.stateLib.getStateValue.call(ev.detail.stateLocalLib, 'xpay_tab');
		if (tab == 'sell') {
			for (let i = 0; i < ev.detail.targets.paste_first_f2.length; i++) {
				ev.detail.targets.paste_first_f2[i].innerHTML = currencyCode;
			}
		}
		let countingType = ev.detail.stateLib.getStateValue.call(
			ev.detail.stateLocalLib, 'xpay_conting_type'
		);
		let dataForEv = {
				targets: ev.detail.targets,
				type: countingType,
				variables: ev.detail.variables,
		}; 
		if (ev.detail.variables.countingData.counting) {
			this.startEvent.call(this, 'change-counting', dataForEv);
		} else {
			let target = (ev.detail.type == 'crypto') ? 
				ev.detail.targets.cryptoQ : ev.detail.targets.fiatQ;
			target.value = '';
			this.startEvent.call(this, 'currency-input-is-changed', dataForEv);
		}
	},

	'currency-input-is-changed': function (ev) {
		this.eventDebag('currency-input-is-changed');
		let start = endChange.bind(this);
		let variables = ev.detail.variables;
		if(variables.changeTimeoutID) {
			clearTimeout(variables.changeTimeoutID);
		}
		variables.changeTimeoutID = setTimeout(start, variables.changeTimeout, ev, variables);

		function endChange(ev, variables) {
			let time = ev.detail.time || ev.detail.stateLib.getTime();
			ev.detail.setData.setQuanInputInState.call(
				ev.detail.setData, ev.detail.type, ev.detail.targets
			);
			ev.detail.stateLib.setStateValue.call(
				ev.detail.stateLocalLib, 'xpay_conting_type', ev.detail.type, time
			);
			ev.detail.stateLib.synch.call(
				ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
			);
			variables.changeTimeoutID = null;

			let dataForEv = {
				targets: ev.detail.targets,
				type: ev.detail.type,
				variables: variables,
			};

			let target = (ev.detail.type == 'crypto') ? 
				ev.detail.targets.cryptoQ : ev.detail.targets.fiatQ;
			if (target.value != '') {
				if (!variables.countingData.counting) {
					this.startEvent.call(this, 'start-counting', dataForEv);
				} else {
					this.startEvent.call(this, 'change-counting', dataForEv);
				}
			} else {
				if (variables.countingData.counting) {
					variables.countingData.counting = false;
				}
				this.startEvent.call(this, 'inputs-is-cleaned', dataForEv);
			}					
		}
	},

	'start-counting': function (ev) {
		this.eventDebag('start-counting');
		if (!('checkRate' in this)) {
			this.checkRate = new this.getIntervalFunction(
				this.callbackToCheckRate, 
				this.variables.countingTimeout, 
				this.variables.countingData
			);
		}
		ev.detail.variables.countingData.customEvents = this;

		let dataForEv = {
			targets: ev.detail.targets, type: ev.detail.type, variables: ev.detail.variables,
		};
		this.startEvent.call(this, 'change-counting', dataForEv);
	},

	'change-counting': function (ev) {
		this.eventDebag('change-counting');

		let time = ev.detail.time || ev.detail.stateLib.getTime();
		ev.detail.variables.countingData.event = ev;

		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'xpay_conting_type', ev.detail.type, time
		);
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);

		ev.detail.variables.countingData.counting = true;
		if (this.checkRate) {
			if (!this.checkRate.isStarted()) {
				this.checkRate.start();
			}
		}
	},

	'end-counting': function (ev) {
		this.eventDebag('end-counting');
		if(this.checkRate) {
			this.checkRate.stop();
		}
		let countingType = ev.detail.stateLib.getStateValue.call(
			ev.detail.stateLocalLib, 'xpay_conting_type'
		);
		let time = ev.detail.time || ev.detail.stateLib.getTime();
		let key = (countingType == 'crypto') ? 'xpay_fiat_quan' : 'xpay_crypto_quan';
		ev.detail.stateLib.deleteStateValue.call(ev.detail.stateLocalLib, key, time);
		ev.detail.stateLib.deleteStateValue.call(ev.detail.stateLocalLib, 'xpay_conting_type', time);
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);

		// ev.detail.targets.ywg_q.innerHTML = '0';

		let dataForEv = {targets: ev.detail.targets, variables: ev.detail.variables};
		this.startEvent.call(this, 'counted', dataForEv);
	},

	'counted': function(ev) {
		this.eventDebag('counted');
		let time = ev.detail.time || ev.detail.stateLib.getTime();
		let countingType = ev.detail.stateLib.getStateValue.call(
			ev.detail.stateLocalLib, 'xpay_conting_type'
		);

		/* paste counting */
		let key, target;
		let value = (ev.detail.value && parseFloat(ev.detail.value)) ? 
			parseFloat(ev.detail.value) : null;
		if (countingType) {
			if (countingType == 'crypto') {
				target = ev.detail.targets.fiatQ;
				key = 'xpay_fiat_quan';
			} else {
				target = ev.detail.targets.cryptoQ;
				key = 'xpay_crypto_quan';
			}
			ev.detail.stateLib.setStateValue.call(
				ev.detail.stateLocalLib, key, value, time
			);
			ev.detail.stateLib.setStateValue.call(
				ev.detail.stateLocalLib, 'xpay_conting_rate', ev.detail.rate, time
			);
			ev.detail.stateLib.synch.call(
				ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
			);
			target.value = (value) ? value : '';
		}
		/* paste ywg */
		console.log();
		ev.detail.targets.ywg_q.innerHTML = (value) ? ev.detail.targets.fiatQ.value : '0';
	},

	'inputs-is-cleaned': function (ev) {
		this.eventDebag('inputs-is-cleaned');
		setTimeout(() => {
			ev.detail.targets.cryptoQ.value = '';
			ev.detail.targets.fiatQ.value = '';
			ev.detail.targets.ywg_q.innerHTML = '0';
		}, ev.detail.variables.countingTimeout/10, ev);

		/* end counting */
		ev.detail.variables.countingData.counting = false;
	},

	'start-timer': function (ev) {
		this.eventDebag('start-timer');
		let data = ev.detail.lib.variables.timerData;
		if (!data.begin) {
			ev.detail.stateLib.setStateValue.call(
				ev.detail.stateLocalLib, 'xpay_time', ev.detail.time, ev.detail.time
			);
			ev.detail.stateLib.synch.call(
				ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
			);
			data.begin = ev.detail.time;
			data.target = (ev.detail.type == 'sell') ? ev.detail.targets.timer_so : null;
			data.getTime = ev.detail.stateLib.getTime;
			data.customEvents = ev.detail.lib;
			data.targets = ev.detail.targets;
			data.type = ev.detail.type;
			data.changeModal = ev.detail.modal.bind(ev.detail.targets);

			if (!('timer' in this)) {
				this.timer = new this.getIntervalFunction(
					this.callbackTimer, 
					1000, 
					this.variables.timerData
				);
			}
		}
		this.timer.start();
	},

	'end-timer': function (ev) {
		this.eventDebag('end-timer');
		if (this.timer) {
			this.timer.stop();
		}
		let time = ev.detail.time || ev.detail.stateLib.getTime();
		ev.detail.variables.timerData.begin = null;
		// ev.detail.variables.timerData.target = null;
		deleteValue ('xpay_time', ev);
		deleteValue ('xpay_data_is_sended', ev);
		deleteValue ('xpay_wallet', ev);

		
		let dataForEv = {
			targets: ev.detail.targets, variables: this.variables, type: ev.detail.type
		};
		this.startEvent.call(this, 'clean-transaction', dataForEv);

		function deleteValue (key, ev) {
			ev.detail.stateLib.deleteStateValue.call(ev.detail.stateLocalLib, key, time);
			ev.detail.stateLib.deleteStateValue.call(ev.detail.stateGlobalLib, key, time);
		}
	},

	'clean-transaction': function(ev) {
		this.eventDebag('clean-transaction');
		/* clean quantity inputs */
		let time = ev.detail.time || ev.detail.stateLib.getTime();
		ev.detail.stateLib.deleteStateValue.call(ev.detail.stateLocalLib, 'xpay_crypto_quan', time);
		ev.detail.stateLib.deleteStateValue.call(ev.detail.stateLocalLib, 'xpay_fiat_quan', time);
		ev.detail.stateLib.deleteStateValue.call(ev.detail.stateLocalLib, 'xpay_conting_rate', time);

		let dataForEv = {
			targets: ev.detail.targets, type: ev.detail.type, variables: ev.detail.variables,
		};
		this.startEvent.call(this, 'inputs-is-cleaned', dataForEv);


		/* clean form2 */
		let sellPersData = [
			ev.detail.targets.mail_si, ev.detail.targets.wallet_si, 
			ev.detail.targets.benifN_si, ev.detail.targets.bankN_si, 
			ev.detail.targets.swift_si, ev.detail.targets.iban_si
		];
		let buyPersData = [
			ev.detail.targets.mail_bi, ev.detail.targets.phone_bi, 
			ev.detail.targets.benifC_bi, ev.detail.targets.bankN_bi, 
			ev.detail.targets.bankC_bi
		];
		let personalData = (ev.detail.type == 'sell') ? sellPersData : buyPersData; 
		for (let i = 0; i < personalData.length; i++) {
			if (personalData[i] == ev.detail.targets.benifC_bi || 
					personalData[i] == ev.detail.targets.bankC_bi) 
			{
				personalData[i].value = personalData[i].dataset.default;
			} else {
				personalData[i].value = '';
			}
		}
		ev.detail.setData.setDataInDB.call(
			ev.detail.setData, ev.detail.type, ev.detail.targets
		);

		ev.detail.targets.accept_si.checked = false;
		ev.detail.targets.accept_si.classList.remove('active');

		/* clean form3 */
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'xpay_begin', false, time
		);
		ev.detail.setData.setTransFromState.call(
			ev.detail.setData, ev.detail.type, ev.detail.targets, this
		);

		/* text next-button */
		ev.detail.targets.ex_bn.innerText = this.buttonText.next;

		/* synch and set */
		ev.detail.setSlide(1, ev.detail.targets);
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);
	}, 

	'to-server-validation': function(ev) {
		this.eventDebag('to-server-validation');
		const changeModal = ev.detail.modal.bind(ev.detail.targets);
		changeModal(true);
		
		let state = ev.detail.stateLib;
		let local = ev.detail.stateLocalLib;
		let global = ev.detail.stateGlobalLib;
		let db = ev.detail.stateDBLib;
		let requests = ev.detail.requests;
		let type = ev.detail.type;
		let time = ev.detail.time || ev.detail.stateLib.getTime();

		let closureEv = ev;
		let closureThis = this;

		let dataForEv = {
			targets: ev.detail.targets, variables: ev.detail.variables, 
			type: ev.detail.type, time: time,
		};

		// ev.detail.variables.countingData.counting = false;

		document.addEventListener('counted', lastCounted);

		function lastCounted() {
			closureThis.checkRate.stop();
			document.removeEventListener('counted', lastCounted);
			startLogic()
		}

		function startLogic() {
			if (type == 'sell') {
				let cryptoValue = state.getStateValue.call(local, 'xpay_crypto');
				let request = (cryptoValue == '3') ?
					sendETHData.call(closureThis, closureEv) : sendSellData.call(closureThis, closureEv);

				let dataToCallback = {
					resolve: ifResponseOk.bind(ev.detail.targets), 
					reject: processingServerErrors.bind(ev.detail.targets),
					toResolve: {type: 'exchanger', cryptoValue},
					toReject: {type: 'exchanger',},
				};
				requests.processingFetch(request, requests.processingResponse, dataToCallback);


				
				// requests.processingFetch(request, responseObj => {
				// 	console.log(responseObj);
				// 	if (!requests.responseIsNotOK(responseObj)) {
				// 		if (requests.bodyIsOK(responseObj)) {
				// 			let toState = (cryptoValue == '3') ? 
				// 				getETHResponseBody(responseObj) : getResponseBody(responseObj);
				// 			processingOK(toState);
				// 			closureThis.startEvent.call(
				// 				closureThis, 'transaction-is-started', dataForEv
				// 			);
				// 		} else {
				// 			processingErors(responseObj)
				// 		}
				// 	} else {
				// 		processingNot200(responseObj, closureThis, dataForEv, changeModal);
				// 	}
				// });
			} else {
				closureThis.startEvent.call(closureThis, 'transaction-is-started', dataForEv);
			}
		}

		function sendSellData(ev) {
			return requests.sendPOSTRequest(
				requests.server, '/crypto/sell/create', getSellData.call(this, ev)
			);

			function getSellData(ev) {
				let calcObj = this.getCalculateObj(ev);
				return {
          "conversion_data": {
            "inputCurrency": calcObj.inputCur,
            "outputCurrency": calcObj.outputCur,
            "inputQuantity": calcObj.inputQuan,
            "outputQuantity": calcObj.outputQuan
          },
          "transaction_sales_data": {
            "beneficiaryName": state.getStateValue.call(db, 'xpay_sell_benif_name'),
            "bankName": state.getStateValue.call(db, 'xpay_sell_bank_name'),
            "swift": state.getStateValue.call(db, 'xpay_sell_swift'),
            "iban": state.getStateValue.call(db, 'xpay_sell_iban').replace(/ /g, '')
          },
          "email": state.getStateValue.call(db, 'xpay_sell_mail'),
          "phone": null
        };
			}
		}

		function sendETHData(ev) {
			return requests.sendPOSTRequest(
				requests.server, '/server/creates/conversions/steps/ones', getETHData.call(this, ev)
			);

			function getETHData(ev) {
				let data = {}, tempValue;

				tempValue = state.getStateValue.call(local, 'xpay_crypto');
				data.own = this.toCurrencyCode(
					'crypto', tempValue, closureEv.detail.variables.currencies
				);

				tempValue = state.getStateValue.call(local, 'xpay_fiat');
				data.want = this.toCurrencyCode(
					'fiat', tempValue, closureEv.detail.variables.currencies
				);
				data.amount = state.getStateValue.call(local, 'xpay_crypto_quan');
				data.email = state.getStateValue.call(db, 'xpay_sell_mail');
				data.crypto_wallet = state.getStateValue.call(db, 'xpay_sell_wallet');
				data.bank_name = state.getStateValue.call(db, 'xpay_sell_bank_name');
				data.swift = state.getStateValue.call(db, 'xpay_sell_swift');
				data.iban = state.getStateValue.call(db, 'xpay_sell_iban').replace(/ /g, '');
				return data;
			}
		}

		function ifResponseOk(responseObj, data) {
			if (requests.bodyIsOK(responseObj)) {
				let toState = (data.cryptoValue == '3') ? getETHResponseBody(responseObj) : getResponseBody(responseObj);
				processingOK(toState);
				closureThis.startEvent.call(closureThis, 'transaction-is-started', dataForEv);
			} else {
				processingResponseBodyErrors.call(this, responseObj, data);
			}
		}

		function getETHResponseBody(responseObj) {
			return {
				id: responseObj.body.result.transaction_token, 
				wallet: responseObj.body.result.our_crypto_wallet
			}
		}

		function getResponseBody(responseObj) {
			return {id: responseObj.body.transaction_id, wallet: responseObj.body.payment_details}
		}

		function processingOK(toState) {
			// console.log(toState);
			state.setStateValue.call(local, 'xpay_data_is_sended', toState.id, time);
			state.setStateValue.call(local, 'xpay_wallet', toState.wallet, time);
			state.setStateValue.call(global, 'xpay_data_is_sended', toState.id, time);
			state.setStateValue.call(global, 'xpay_wallet', toState.wallet, time);
		}
	}, 

	'transaction-is-started': function(ev) {
		this.eventDebag('transaction-is-started');
		const changeModal = ev.detail.modal.bind(ev.detail.targets);

		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'xpay_begin', true, ev.detail.time
		);
		// остановить калькулятор 
		ev.detail.stateLib.deleteStateValue.call(
			ev.detail.stateLocalLib, 'xpay_conting_type', ev.detail.time
		);

		
		let dataForEv = {
			targets: ev.detail.targets, variables: ev.detail.variables, 
			type: ev.detail.type, time: ev.detail.time,
		};
		//если sell запустить счетчик
		// if (ev.detail.type == 'sell') {
		// 	dataForEv.lib = this;
		// 	this.startEvent.call(this, 'start-timer', dataForEv);
		// }

		// установить текст кнопки
		// ev.detail.targets.ex_bn.innerText = (ev.detail.type == 'sell') ? 
		// 	this.buttonText.paid : this.buttonText.send;
		ev.detail.targets.ex_bn.innerText = this.buttonText.send;
		// записать в DB данные 2-го шага
		ev.detail.setData.setDataInDB.call(
			ev.detail.setData, ev.detail.type, ev.detail.targets
		);

		// установить данные 3-го шага
		ev.detail.setData.setTransFromState.call(
			ev.detail.setData, ev.detail.type, ev.detail.targets, this
		);

		// установить флаг проведенной транзакции для синхронизации личного кабинета
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'xpay_transaction_completed', true, ev.detail.time
		);
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateGlobalLib, 'xpay_transaction_completed', true, ev.detail.time
		);

		// synch
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);

		// перейти на 3-й шаг
		// ev.detail.setSlide(3, ev.detail.targets);

		// отключить модалку
		// changeModal();
		



		if (ev.detail.type == 'buy') {
			this.startEvent.call(this, 'finish-transaction', dataForEv);
		} else {
			changeModal(true, 'all-end');
			this.startEvent.call(this, 'end-timer', dataForEv);
		}
	},

	'finish-transaction': function (ev) {
		this.eventDebag('finish-transaction');
		const changeModal = ev.detail.modal.bind(ev.detail.targets);
		// changeModal(true, 'wait');
		if (this.timer) {
			this.timer.stop();
		}

		let state = ev.detail.stateLib;
		let local = ev.detail.stateLocalLib;
		let db = ev.detail.stateDBLib;
		let requests = ev.detail.requests;
		let closureThis = this;

		let tab = state.getStateValue.call(local, 'xpay_tab');
		let cryptoValue = state.getStateValue.call(local, 'xpay_crypto');
		let id = state.getStateValue.call(local, 'xpay_data_is_sended');

		let dataForEv = {
			targets: ev.detail.targets, variables: ev.detail.variables, type: ev.detail.type
		};

		if (tab == 'sell') {
			iPaid(id);
		} else {
			buyRequest(getBuyData(ev));
		}

		function iPaid(id) {
			let route = (cryptoValue == '3') ? '/server/paids' : '/crypto/sell/check';
			let toSend = (cryptoValue == '3') ? 
				{transaction_token: id} : {transaction_id: id};

			let request = requests.sendPOSTRequest(requests.server, route, toSend);
			requests.processingFetch(request, responseObj => {
				if (requests.responseIsNotOK(responseObj) === 0) {
					if (requests.bodyIsOK(responseObj)) {
						changeModal(true, 'sell-end');
						closureThis.startEvent.call(closureThis, 'end-timer', dataForEv);
					} else {
						changeModal(true, 'not-paid');
						closureThis.timer.start();
					}
				} else {
					processingNot200(responseObj, closureThis, dataForEv, changeModal);
				}
			});
		}

		function buyRequest(toSend) {
			let request = requests.sendPOSTRequest(requests.server, '/crypto/buy', toSend);
			requests.processingFetch(request, responseObj => {
				if (!requests.responseIsNotOK(responseObj)) {
					changeModal(true, 'all-end');
					closureThis.startEvent.call(closureThis, 'clean-transaction', dataForEv);
				} else {
					processingNot200(responseObj, closureThis, dataForEv, changeModal);
				}
			});
		}

		function getBuyData(ev) {
			let data = {}, tempValue;

			data["email"] = state.getStateValue.call(db, 'xpay_buy_mail');
			data["phone"] = state.getStateValue.call(db, 'xpay_buy_phone')
				.replace(/\+/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\-/g, '');
			data["bankName"] = state.getStateValue.call(db, 'xpay_buy_bank_name');
			data["bankCountry"] = state.getStateValue.call(db, 'xpay_buy_bank_country');
			data["beneficiaryCountry"] = state.getStateValue.call(db, 'xpay_buy_benif_country');
			tempValue = state.getStateValue.call(local, 'xpay_fiat');
			data["fromCurrency"] = closureThis.toCurrencyCode(
				'fiat', tempValue, ev.detail.variables.currencies
			);
			tempValue = state.getStateValue.call(local, 'xpay_crypto');
			data["toCurrency"] = closureThis.toCurrencyCode(
				'crypto', tempValue, ev.detail.variables.currencies
			);
			data["inputCurrencyAmount"] = state.getStateValue.call(local, 'xpay_fiat_quan');
			data["outputCurrencyAmount"] = state.getStateValue.call(local, 'xpay_crypto_quan');
			data["exchangeRate"] = state.getStateValue.call(local, 'xpay_conting_rate');
			return {
				"transaction": data
			};
		}
	},
}

// var details = [
// 	{"id": 1, "data": "asdfdf"},
// 	{"id": 2, "data": "asdfdf"},
// 	{"id": 3, "data": "asdfdf"},
// 	{"id": 4, "data": "asdfdf"}

// ]