import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateDBLib from './library-state-db.js';
import getWallet from './method_getWallet.js';

// this = this library
export default {
	stateLib: stateLib,
	stateLocalLib: stateLocalLib,
	stateDBLib: stateDBLib,

	setDropdownFromState: function (type, TARGETS) {
		let target = (type == 'crypto') ? TARGETS.crypto : TARGETS.fiat;
		let value = (type == 'crypto') ? 
								this.stateLib.getStateValue.call(this.stateLocalLib, 'xpay_crypto') : 
								this.stateLib.getStateValue.call(this.stateLocalLib, 'xpay_fiat');
		target.value = value;
	},

	setDropdownInState: function (type, TARGETS) {
		let target = (type == 'crypto') ? TARGETS.crypto : TARGETS.fiat;
		let key = (type == 'crypto') ? 'xpay_crypto' : 'xpay_fiat';
		let time = this.stateLib.getTime();
		this.stateLib.setStateValue.call(this.stateLocalLib, key, target.value, time);
	},

	setQuanInputFromState: function (type, TARGETS) {
		let target = (type == 'crypto') ? TARGETS.cryptoQ : TARGETS.fiatQ;
		let value = (type == 'crypto') ? 
								this.stateLib.getStateValue.call(this.stateLocalLib, 'xpay_crypto_quan') : 
								this.stateLib.getStateValue.call(this.stateLocalLib, 'xpay_fiat_quan');
		target.value = value;
	},

	setQuanInputInState: function (type, TARGETS) {
		let target = (type == 'crypto') ? TARGETS.cryptoQ : TARGETS.fiatQ;
		let key = (type == 'crypto') ? 'xpay_crypto_quan' : 'xpay_fiat_quan';
		let time = this.stateLib.getTime();
		this.stateLib.setStateValue.call(this.stateLocalLib, key, target.value, time);
	},

	setDataFromDB: function (type, TARGETS) {
		setTimeout(() => {
			if (type == 'sell') {
				TARGETS.mail_si.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'xpay_sell_mail'
				);
				TARGETS.paste_first_f2[0].innerHTML = this.stateLib.getStateValue.call(
					this.stateLocalLib, 'xpay_crypto'
				);
				TARGETS.wallet_si.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'xpay_sell_wallet'
				);
				TARGETS.benifN_si.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'xpay_sell_benif_name'
				);
				TARGETS.bankN_si.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'xpay_sell_bank_name'
				);
				TARGETS.swift_si.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'xpay_sell_swift'
				);
				TARGETS.iban_si.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'xpay_sell_iban'
				);
				// if (this.stateLib.getStateValue.call(this.stateLocalLib, 'xpay_sell_b')) {
				// 	TARGETS.accept_si.checked = true;
				// } else {
				// 	TARGETS.accept_si.checked = false;
				// }
			} else {
				TARGETS.mail_bi.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'xpay_buy_mail'
				);
				TARGETS.phone_bi.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'xpay_buy_phone'
				);
				TARGETS.benifC_bi.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'oero_buy_benif_country'
				) || TARGETS.benifC_bi.dataset.default;
				TARGETS.bankN_bi.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'xpay_buy_bank_name'
				);
				TARGETS.bankC_bi.value = this.stateLib.getStateValue.call(
					this.stateDBLib, 'oero_buy_bank_country'
				) || TARGETS.bankC_bi.dataset.default;
			}
		}, 200)
	},

	setDataInDB: function (type, TARGETS) {
		let time = this.stateLib.getTime();
		if (type == 'sell') {
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_sell_mail', TARGETS.mail_si.value, time
			);
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_sell_wallet', TARGETS.wallet_si.value, time
			);
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_sell_benif_name', TARGETS.benifN_si.value, time
			);
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_sell_bank_name', TARGETS.bankN_si.value, time
			);
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_sell_swift', TARGETS.swift_si.value, time
			);
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_sell_iban', TARGETS.iban_si.value, time
			);
		} else {
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_buy_mail', TARGETS.mail_bi.value, time
			);
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_buy_phone', TARGETS.phone_bi.value, time
			);
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_buy_benif_country', TARGETS.benifC_bi.value, time
			);
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_buy_bank_name', TARGETS.bankN_bi.value, time
			);
			this.stateLib.setStateValue.call(
				this.stateDBLib, 'xpay_buy_bank_country', TARGETS.bankC_bi.value, time
			);
		}
	},

	setTransFromState: function (type, TARGETS, customEvents) {
		setTimeout(() => {
			let begin = this.stateLib.getStateValue.call(this.stateLocalLib, 'xpay_begin');
			let cryptoQTarget = (type == 'sell') ? TARGETS.cryptoQ_so : TARGETS.cryptoQ_bo;
			let fiatQTarget = (type == 'sell') ? TARGETS.fiatQ_so : TARGETS.fiatQ_bo;
			
			cryptoQTarget.value = '' + this.stateLib.getStateValue.call(this.stateLocalLib, 'xpay_crypto_quan');
			fiatQTarget.value = '' + this.stateLib.getStateValue.call(this.stateLocalLib, 'xpay_fiat_quan');

			if (type == 'sell') {
				let prom = setWallet();
				prom.then(resolve => {
					TARGETS.walletX_so.value = (begin) ? resolve : '';
				})
				TARGETS.iban_so.value = (begin) ? 
					this.stateLib.getStateValue.call(this.stateDBLib, 'xpay_sell_iban') : '';
				
				let time = this.stateLib.getStateValue.call(this.stateLocalLib, 'xpay_time');
				if (time) {
					let dataForEv = {type: type, time: time, lib: customEvents, targets: TARGETS};
					let cusEv = customEvents.CreateCustomEvent('start-timer', dataForEv);
					customEvents.startCustomEvent(cusEv);
				}
				TARGETS.ex_bn.innerText = (slide == '1' || slide == '2') ? 
					customEvents.buttonText.next : customEvents.buttonText.paid;
			} else {
				let countries = JSON.parse(sessionStorage.getItem('countries'));
				let country;
				TARGETS.bankN_bo.value = (begin) ? 
					this.stateLib.getStateValue.call(this.stateDBLib, 'xpay_buy_bank_name') : '';
				country = this.stateLib.getStateValue.call(this.stateDBLib, 'xpay_buy_bank_country');
				TARGETS.bankC_bo.value = (begin) ? countries[country] : '';
				country =this.stateLib.getStateValue.call(this.stateDBLib, 'xpay_buy_benif_country');
				TARGETS.benifC_bo.value = (begin) ? countries[country] : '';
				TARGETS.mail_bo.value = (begin) ? 
					this.stateLib.getStateValue.call(this.stateDBLib, 'xpay_buy_mail') : '';
				TARGETS.phone_bo.value = (begin) ? 
					this.stateLib.getStateValue.call(this.stateDBLib, 'xpay_buy_phone') : '';
				TARGETS.ex_bn.innerText = (slide == '1' || slide == '2') ? 
					customEvents.buttonText.next : customEvents.buttonText.continue;
			}
			
			for (let i = 0; i < TARGETS.paste_first.length; i++) {
				TARGETS.paste_first[i].innerHTML = (begin) ? TARGETS.crypto.value : '';
			}
			for (let i = 0; i < TARGETS.paste_second.length; i++) {
				TARGETS.paste_second[i].innerHTML = (begin) ? TARGETS.fiat.value : '';
			}
		}, 200);


		async function setWallet() {
			return await getWallet();
		}
	},

};