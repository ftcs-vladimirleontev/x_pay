// this = customEvents
export default {
	'tab-is-clicked': function (ev) {
		this.eventDebag('tab-is-clicked');
		let time = ev.detail.time || ev.detail.stateLib.getTime();
	
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_tab', ev.detail.mode, time
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
			ev.detail.stateLocalLib, 'oero_crypto', ev.detail.targets.crypto.dataset.default, time
		);
		ev.detail.targets.cryptoQ.value = '';
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_crypto_quan', '', time
		);
		ev.detail.targets.fiat.value = ev.detail.targets.fiat.dataset.default;
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_fiat', ev.detail.targets.fiat.dataset.default, time
		);
		ev.detail.targets.fiatQ.value = '';
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_fiat_quan', '', time
		);
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);

		let dataForEv = {
			targets: ev.detail.targets,
			variables: ev.detail.variables,
		};
		let cusEv = this.CreateCustomEvent('inputs-is-cleaned', dataForEv);
		this.startCustomEvent(cusEv);
	},

	'currency-select-is-changed': function (ev) {
		this.eventDebag('currency-select-is-changed');
		ev.detail.setData.setDropdownInState.call(
			ev.detail.setData, ev.detail.type, ev.detail.targets
		);
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);
		ev.detail.targets.ywg_c.innerHTML = ev.detail.targets.fiat.value;

		if (ev.detail.type = 'sell') {
			for (let i = 0; i < ev.detail.targets.paste_first_f2.length; i++) {
				ev.detail.targets.paste_first_f2[i].innerHTML = ev.detail.targets.crypto.value;
			}
		}
		let countingType = ev.detail.stateLib.getStateValue.call(
			ev.detail.stateLocalLib, 'oero_conting_type'
		);
		let dataForEv = {
				targets: ev.detail.targets,
				type: countingType,
				variables: ev.detail.variables,
		}; 
		if (ev.detail.variables.countingData.counting) {
			let cusEv = this.CreateCustomEvent('change-counting', dataForEv);
			this.startCustomEvent(cusEv);
		} else {
			let target = (ev.detail.type == 'crypto') ? 
				ev.detail.targets.cryptoQ : ev.detail.targets.fiatQ;
			target.value = '';
			let cusEvForInput = this.CreateCustomEvent(
				'currency-input-is-changed', dataForEv
			);
			this.startCustomEvent(cusEvForInput);
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
				ev.detail.stateLocalLib, 'oero_conting_type', ev.detail.type, time
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
					variables.countingData.counting = true;
					let cusEv = this.CreateCustomEvent('start-counting', dataForEv);
					this.startCustomEvent(cusEv);
				} else {
					let cusEv = this.CreateCustomEvent('change-counting', dataForEv);
					this.startCustomEvent(cusEv);
				}
			} else {
				if (variables.countingData.counting) {
					variables.countingData.counting = false;
				}
				let cusEvToClean = this.CreateCustomEvent('inputs-is-cleaned', dataForEv);
				this.startCustomEvent(cusEvToClean);
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
		ev.detail.variables.countingData.variables = ev.detail.variables;
		ev.detail.variables.countingData.targets = ev.detail.targets;
		ev.detail.variables.countingData.customEvents = this;

		let dataForEv = {
			targets: ev.detail.targets, type: ev.detail.type, variables: ev.detail.variables,
		};
		let cusEv = this.CreateCustomEvent('change-counting', dataForEv);
		this.startCustomEvent(cusEv);
		this.checkRate.start();
	},

	'change-counting': function (ev) {
		this.eventDebag('change-counting');

		let time = ev.detail.time || ev.detail.stateLib.getTime();
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_conting_type', ev.detail.type, time
		);

		let toChange = ev.detail.variables.countingData;
		toChange.mode = ev.detail.stateLib.getStateValue.call(
			ev.detail.stateLocalLib, 'oero_tab'
		);
		if (ev.detail.type == 'crypto') {
			toChange.input = ev.detail.targets.crypto.value;
			toChange.output = ev.detail.targets.fiat.value;
			toChange.quantity = ev.detail.targets.cryptoQ.value;
		} else {
			toChange.input = ev.detail.targets.fiat.value;
			toChange.output = ev.detail.targets.crypto.value;
			toChange.quantity = ev.detail.targets.fiatQ.value;
		}

		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);
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
			ev.detail.stateLocalLib, 'oero_conting_type'
		);
		let time = ev.detail.time || ev.detail.stateLib.getTime();
		let key = (countingType == 'crypto') ? 'oero_fiat_quan' : 'oero_crypto_quan';
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, key, '', time
		);
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_conting_type', null, time
		);

		let toChange = ev.detail.variables.countingData;
		toChange.input = null;
		toChange.output = null;
		toChange.quantity = null;
		toChange.mode = null;

		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);

		let dataForEv = {
			targets: ev.detail.targets, variables: ev.detail.variables,
			value: ev.detail.value, rate: ev.detail.rate,
		};
		let cusEv = this.CreateCustomEvent('counted', dataForEv);
		this.startCustomEvent(cusEv);
	},

	'counted': function(ev) {
		this.eventDebag('counted');
		let time = ev.detail.time || ev.detail.stateLib.getTime();
		let countingType = ev.detail.stateLib.getStateValue.call(
			ev.detail.stateLocalLib, 'oero_conting_type'
		);

		/* paste counting */
		let key, target;
		if (countingType) {
			if (countingType == 'crypto') {
				target = ev.detail.targets.fiatQ;
				key = 'oero_fiat_quan';
			} else {
				target = ev.detail.targets.cryptoQ;
				key = 'oero_crypto_quan';
			}
			ev.detail.stateLib.setStateValue.call(
				ev.detail.stateLocalLib, key, ev.detail.value, time
			);
			ev.detail.stateLib.setStateValue.call(
				ev.detail.stateLocalLib, 'oero_conting_rate', ev.detail.rate, time
			);
			ev.detail.stateLib.synch.call(
				ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
			);
			target.value = ev.detail.value;
		}
		/* paste ywg */
		ev.detail.targets.ywg_q.innerHTML = (ev.detail.value) ? ev.detail.targets.fiatQ.value : '0';
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
				ev.detail.stateLocalLib, 'oero_time', ev.detail.time, ev.detail.time
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
		ev.detail.variables.timerData.target = null;
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_time', null, time
		);
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'data_is_sended', null, time
		);
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);

		let dataForEv = {
			targets: ev.detail.targets, variables: this.variables, type: ev.detail.type
		};
		let cusEv = this.CreateCustomEvent('clean-transaction', dataForEv);
		this.startCustomEvent(cusEv);
	},

	'clean-transaction': function(ev) {
		this.eventDebag('clean-transaction');
		/* clean quantity inputs */
		let time = ev.detail.time || ev.detail.stateLib.getTime();
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_crypto_quan', '', time
		);
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_fiat_quan', '', time
		);
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_conting_rate', null, time
		);

		let dataForEv = {
			targets: ev.detail.targets, type: ev.detail.type, variables: ev.detail.variables,
		};
		let cusEv = this.CreateCustomEvent('inputs-is-cleaned', dataForEv);
		this.startCustomEvent(cusEv);


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
			ev.detail.stateLocalLib, 'oero_begin', false, time
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
			targets: ev.detail.targets, 
			variables: ev.detail.variables, 
			type: ev.detail.type,
			time: time,
		};

		// ev.detail.variables.countingData.counting = false;

		document.addEventListener('counted', lastCounted);

		function lastCounted(ev) {
			closureThis.checkRate.stop();
			document.removeEventListener('counted', lastCounted);
			startLogic(ev)
		}

		function startLogic(ev) {
			if (type == 'sell') {
				let request = sendSellData();
				requests.processingFetch(request, responseObj => {
					if (responseObj.ok) {
						if (responseObj.body.status == '200') {
							/* костыль для ойро */
							changeModal(true, 'buy-end');
							startEvent('clean-transaction');
							/***************************************/

							// let tocken = responseObj.body.result.transaction_token;
							// state.setStateValue.call(local, 'data_is_sended', tocken, time);
							// state.setStateValue.call(global, 'data_is_sended', tocken, time);
							// startEvent('transaction-is-started');
						} else {
							if 	(	responseObj.body.errors.hasOwnProperty('email') && 
										responseObj.body.errors.hasOwnProperty('iban')
									)
							{
								changeModal(true, 'custom-message', closureThis.responseErrors.both);
								closureEv.detail.targets.mail_si.parentElement.classList.add('error');
								closureEv.detail.targets.iban_si.parentElement.classList.add('error');
							} else if (responseObj.body.errors.hasOwnProperty('email')) {
								changeModal(true, 'custom-message', closureThis.responseErrors.email);
								closureEv.detail.targets.mail_si.parentElement.classList.add('error');
							} else {
								changeModal(true, 'custom-message', closureThis.responseErrors.iban);
								closureEv.detail.targets.iban_si.parentElement.classList.add('error');
							}
							closureThis.checkRate.start();
						}
					} else {
						changeModal(
							true, 'destroyed', state.getStateValue.call(local, 'oero_crypto')
						);
						startEvent('clean-transaction');
					}
				});
			} else {
				startEvent('transaction-is-started');
			}
		}

		function sendSellData() {
			return requests.sendPOSTRequest(
				requests.server, '/server/creates/conversions/steps/ones', getSellData()
			);

			function getSellData() {
				let data = {};
				data.own = state.getStateValue.call(local, 'oero_crypto');
				data.want = state.getStateValue.call(local, 'oero_fiat');
				data.amount = state.getStateValue.call(local, 'oero_crypto_quan');
				data.email = state.getStateValue.call(db, 'oero_sell_mail');
				data.crypto_wallet = state.getStateValue.call(db, 'oero_sell_wallet');
				data.bank_name = state.getStateValue.call(db, 'oero_sell_bank_name');
				data.swift = state.getStateValue.call(db, 'oero_sell_swift');
				data.iban = state.getStateValue.call(db, 'oero_sell_iban');
				return data;
			}
		}

		function startEvent(key) {
			let cusEv = closureThis.CreateCustomEvent(key, dataForEv);
			closureThis.startCustomEvent(cusEv);
		}
	}, 

	'transaction-is-started': function(ev) {
		this.eventDebag('transaction-is-started');
		const changeModal = ev.detail.modal.bind(ev.detail.targets);

		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_begin', true, ev.detail.time
		);
		// остановить калькулятор 
		ev.detail.stateLib.setStateValue.call(
			ev.detail.stateLocalLib, 'oero_conting_type', null, ev.detail.time
		);
		
		//если sell запустить счетчик
		if (ev.detail.type == 'sell') {
			let dataForEv = {
				targets: ev.detail.targets, variables: ev.detail.variables, 
				type: ev.detail.type, time: ev.detail.time,
			};
			dataForEv.lib = this;
			let cusEv = this.CreateCustomEvent('start-timer', dataForEv);
			this.startCustomEvent(cusEv);
		}

		// записать в DB данные 2-го шага
		ev.detail.setData.setDataInDB.call(
			ev.detail.setData, ev.detail.type, ev.detail.targets
		);

		// установить данные 3-го шага
		ev.detail.setData.setTransFromState.call(
			ev.detail.setData, ev.detail.type, ev.detail.targets, this
		);

		// перейти на 3-й шаг
		ev.detail.setSlide(3, ev.detail.targets);

		// synch
		ev.detail.stateLib.synch.call(
			ev.detail.stateLib, ev.detail.stateGlobalLib, ev.detail.stateLocalLib
		);

		// отключить модалку
		changeModal();
	},

	'finish-transaction': function (ev) {
		this.eventDebag('finish-transaction');
		const changeModal = ev.detail.modal.bind(ev.detail.targets);
		changeModal(true, 'wait');
		if (this.timer) {
			this.timer.stop();
		}

		let requests = ev.detail.requests;
		let closureThis = this;

		let tab = ev.detail.stateLib.getStateValue.call(
			ev.detail.stateLocalLib, 'oero_tab'
		);
		if (tab == 'sell') {
			iPaid(ev.detail.stateLib.getStateValue.call(
				ev.detail.stateLocalLib, 'data_is_sended'
			));
		} else {
			buyRequest(getBuyData(ev));
		}

		function iPaid(token) {
			let toSend = {
				transaction_token: token
			}
			let request = requests.sendPOSTRequest(requests.server, '/server/paids', toSend);
			requests.processingFetch(request, responseObj => {
				if (responseObj.ok) {
					if (responseObj.body.status == '200') {
						changeModal(true, 'sell-end');
						let dataForEv = {
							targets: closureEv.detail.targets, 
							variables: closureEv.detail.variables, 
							type: closureEv.detail.type
						};
						let cusEv = closureThis.CreateCustomEvent('end-timer', dataForEv);
						closureThis.startCustomEvent(cusEv);
					} else {
						changeModal(true, 'not-paid');
						closureThis.timer.start();
					}
				} else {
					changeModal(true, 'server-not-available');
					closureThis.timer.start();
				}
			});
		}

		function buyRequest(toSend) {
			let request = requests.sendPOSTRequest(requests.server, '/crypto/buy', toSend);
			requests.processingFetch(request, responseObj => {
				console.log(responseObj);
				if (responseObj.ok) {
					changeModal(true, 'buy-end');
					let dataForEv = {
						targets: ev.detail.targets, variables: ev.detail.variables, type: ev.detail.type
					};
					let cusEv = closureThis.CreateCustomEvent('clean-transaction', dataForEv);
					closureThis.startCustomEvent(cusEv);
				} else {
					changeModal(true, 'server-not-available');
				}
			});
		}

		function getBuyData(ev) {
			let data = {};
			let state = ev.detail.stateLib;
			let local = ev.detail.stateLocalLib;
			let db = ev.detail.stateDBLib;

			data["email"] = state.getStateValue.call(db, 'oero_buy_mail');
			data["phone"] = state.getStateValue.call(db, 'oero_buy_phone')
				.replace(/\+/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\-/g, '');
			data["bankName"] = state.getStateValue.call(db, 'oero_buy_bank_name');
			data["bankCountry"] = state.getStateValue.call(db, 'oero_buy_bank_country');
			data["beneficiaryCountry"] = state.getStateValue.call(db, 'oero_buy_benif_country');
			data["fromCurrency"] = state.getStateValue.call(local, 'oero_fiat');
			data["toCurrency"] = state.getStateValue.call(local, 'oero_crypto');
			data["inputCurrencyAmount"] = state.getStateValue.call(local, 'oero_fiat_quan');
			data["outputCurrencyAmount"] = state.getStateValue.call(local, 'oero_crypto_quan');
			data["exchangeRate"] = state.getStateValue.call(local, 'oero_conting_rate');
			return {
				"transaction": data
			};
		}
	},
}