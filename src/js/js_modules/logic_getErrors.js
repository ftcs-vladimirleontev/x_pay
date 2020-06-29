import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import validateIBAN from './method_validateIBAN.js';

// this = TARGETS
export default function(type, data) {
	switch(type) {
		case 'exchanger':
			return getExchangerErrors.call(this, data.tab);
		case 'authentication':
			return getAuthenticationErrors.call(this, data.type);
	}


	function getExchangerErrors(tab) {
		let sellArray = [
			this.mail_si, this.wallet_si, this.benifN_si, this.bankN_si, this.swift_si, 
			this.iban_si
		];
		let buyArray = [
			this.mail_bi, this.phone_bi, this.benifC_bi, this.bankN_bi, this.bankC_bi
		];
		let checkArray = (tab == 'sell') ? sellArray : buyArray;
		let errors = getVoidFlags(checkArray);
	
		if (checkArray[0].value.match(/^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i) === null) {
			errors += '0';
		};
	
		if 	(
					stateLib.getStateValue.call(stateLocalLib, 'xpay_tab') == 'sell' &&
					stateLib.getStateValue.call(stateLocalLib, 'xpay_crypto') == '3'
				) 
		{
			if 	(	
						thereAreErrorsWalletSymbols(checkArray[1].value) ||
						checkArray[1].value.length != 42 || 
						checkArray[1].value.slice(0, 2) != '0x'
					)
			{
				errors += '1';
			};
		}
		
		if 	(stateLib.getStateValue.call(stateLocalLib, 'xpay_tab') == 'sell') {
			if (!validateIBAN(checkArray[5].value.replace(/ /g, ''))) {
				errors += '5';
			};
		}
	
		return errors;

		function thereAreErrorsWalletSymbols(value) {
			let flag = false;
			for (let i = 0; i < value.length; i++) {
				if (value[i].match(/[A-Za-z0-9]/) === null) {
					flag = true;
				}
			}
			return flag;
		}
	}


	function getAuthenticationErrors(type) {
		let loginArray = [this.login_ac_name_log, this.login_pass_log];
		let createArray = [this.login_ac_name_cre, this.login_pass_cre, this.login_conf_pass_cre];
		let checkArray = (type == 'login') ? loginArray : createArray;
		let errors = getVoidFlags(checkArray);
		errors += getAccountNameErrors(checkArray);

		if (type == 'create' && (this.login_pass_cre.value != this.login_conf_pass_cre.value)) {
			errors += '12'
		}
		return errors;
	}

	function getVoidFlags(checkArray) {
		// clean old errors
		for (let i = 0; i < checkArray.length; i++) {
			checkArray[i].parentElement.classList.remove('error');
		}

		let errors = '';
		for (let i = 0; i < checkArray.length; i++) {
			errors += (!checkArray[i].value) ? i : '';
		}
		return errors;
	}

	function getAccountNameErrors(checkArray) {
		return (checkArray[0].value.match(/^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i) === null) ? '0' : '';
	}
}