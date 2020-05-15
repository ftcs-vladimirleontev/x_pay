import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import setData from './library-set-data.js';
import setPage from './logic_setPage.js';

// this = TARGETS
export default function(customEvents) {
	let tab = stateLib.getStateValue.call(stateLocalLib, 'xpay_tab');
	let slide = stateLib.getStateValue.call(stateLocalLib, 'xpay_slide');
	let countingType = stateLib.getStateValue.call(stateLocalLib, 'xpay_conting_type');
	let crypto = stateLib.getStateValue.call(stateLocalLib, 'xpay_crypto');
	let fiat = stateLib.getStateValue.call(stateLocalLib, 'xpay_fiat');
	let fiatQ = stateLib.getStateValue.call(stateLocalLib, 'xpay_fiat_quan');

	this.ex_bn.innerText = (slide == '1' || slide == '2') ? customEvents.buttonText.next : 
		(tab == 'sell') ? customEvents.buttonText.paid : customEvents.buttonText.send;

	/* dropdowns choice */
	if (!crypto) {
		setData.setDropdownInState.call(setData, 'crypto', this);
		crypto = this.crypto.value;
	} else {
		setData.setDropdownFromState.call(setData, 'crypto', this);
	}
	if (!fiat) {
		setData.setDropdownInState.call(setData, 'fiat', this);
		fiat = this.fiat.value;
	} else {
		setData.setDropdownFromState.call(setData, 'fiat', this);
	}

	/* You will get / give */
	if (tab == 'sell') {
		this.tmdf.innerHTML = customEvents.form1_text.tmd.sell.first;
		this.tmds.innerHTML = customEvents.form1_text.tmd.sell.second;
		this.tmd_ywg.innerHTML = customEvents.form1_text.tmd.sell.ywg;
	} else {
		this.tmdf.innerHTML = customEvents.form1_text.tmd.buy.first;
		this.tmds.innerHTML = customEvents.form1_text.tmd.buy.second;
		this.tmd_ywg.innerHTML = customEvents.form1_text.tmd.buy.ywg;;
	}
	this.ywg_c.innerHTML = customEvents.variables.currencies.fiat[fiat].displayCode;
	this.ywg_q.innerHTML = (fiatQ) ? fiatQ : '0';
	

	/* maybe start counting */
	if (countingType) {
		setData.setQuanInputFromState.call(setData, countingType, this);
		let dataForEv = {
			type: countingType,
			targets: this,
			variables: customEvents.variables
		};
		let cusEv = customEvents.CreateCustomEvent(
			'currency-input-is-changed', dataForEv
		);
		if (!document.hidden) {
			customEvents.startCustomEvent(cusEv);
		}
	}

	/* set data of step2 and step3 */
	if (tab == 'sell') {
		setData.setDataFromDB.call(setData, 'sell', this, customEvents);
		setData.setTransFromState.call(setData, 'sell', this, customEvents);
	} else {
		setData.setDataFromDB.call(setData, 'buy', this, customEvents);
		setData.setTransFromState.call(setData, 'buy', this, customEvents);
	}

	setPage(this);
}