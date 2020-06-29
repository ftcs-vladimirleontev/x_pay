import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import setData from './library-set-data.js';
import setPage from './logic_setPage.js';

// this = TARGETS
export default function(customEvents) {
	let tab = stateLib.getStateValue.call(stateLocalLib, 'xpay_tab');
	let slide = stateLib.getStateValue.call(stateLocalLib, 'xpay_slide');
	let countingType = stateLib.getStateValue.call(stateLocalLib, 'xpay_conting_type');
	let fiatQ = stateLib.getStateValue.call(stateLocalLib, 'xpay_fiat_quan');

	/* dropdowns choice */
	setData.setDropdownFromState.call(setData, 'crypto', this);
	if (!stateLib.getStateValue.call(stateLocalLib, 'xpay_crypto')) {
		setData.setDropdownInState.call(setData, 'crypto', this);
	}
	setData.setDropdownFromState.call(setData, 'fiat', this);
	if (!stateLib.getStateValue.call(stateLocalLib, 'xpay_fiat')) {
		setData.setDropdownInState.call(setData, 'fiat', this);
	}

	/* set next-button text */
	this.ex_bn.innerText = (slide == '1' || slide == '2') ? customEvents.buttonText.next : 
		(tab == 'sell') ? customEvents.buttonText.paid : customEvents.buttonText.send;

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
	let fiatID = stateLib.getStateValue.call(stateLocalLib, 'xpay_fiat');
	this.ywg_c.innerHTML = customEvents.variables.currencies.fiat[fiatID].displayCode;
	this.ywg_q.innerHTML = (fiatQ) ? fiatQ : '0';
	

	/* maybe start counting */
	if (countingType) {
		setData.setQuanInputFromState.call(setData, countingType, this);
		let dataForEv = {
			type: countingType,
			targets: this,
			variables: customEvents.variables
		};
		if (!document.hidden) {
			customEvents.startEvent.call(
				customEvents, 'currency-input-is-changed', dataForEv
			);
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