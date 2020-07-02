"use strict";

// this = TARGETS
export default function(type, data) {
	switch(type) {
		case 'exchanger':
			return setExchangerErrors.call(this, data.tab, data.errors);
		case 'authentication':
			return setAuthenticationErrors.call(this, data.type, data.errors);
	}

	function setExchangerErrors(tab, errors) {
		let sellArray = [
			this.mail_si, this.wallet_si, this.benifN_si, this.bankN_si, this.swift_si, 
			this.iban_si
		];
		let buyArray = [
			this.mail_bi, this.phone_bi, this.benifC_bi, this.bankN_bi, this.bankC_bi
		];
		// let checkArray = (tab == 'sell') ? sellArray : buyArray;
		setClass((tab == 'sell') ? sellArray : buyArray, errors);
		return errors;
	}

	function setAuthenticationErrors(type, errors) {
		let loginArray = [this.login_ac_name_log, this.login_pass_log];
		let createArray = [
			this.login_ac_name_cre, this.login_pass_cre, this.login_conf_pass_cre
		];
		// let checkArray = (tab == 'sell') ? sellArray : buyArray;
		setClass((type == 'login') ? loginArray : createArray, errors);
		return errors;
	}

	function setClass(checkArray, errors) {
		let errorsSet = new Set(errors);
		for (let i = 0; i < checkArray.length; i++) {
			if (errorsSet.has('' + i)) {
				checkArray[i].parentElement.classList.add('error');
			}
		}
	}
}