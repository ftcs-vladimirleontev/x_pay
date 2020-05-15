import stateLib from './library-state.js';
// import stateGlobalLib from './library-state-global.js';
import stateLocalLib from './library-state-local.js';
import customEvents from './library-cust-ev.js';
import setData from './library-set-data.js';
import setPage from './logic_setPage.js';

// this = TARGETS
export default function() {
	let tab = stateLib.getStateValue.call(stateLocalLib, 'xpay_tab');
	let slide = stateLib.getStateValue.call(stateLocalLib, 'xpay_slide');
	let countingType = stateLib.getStateValue.call(stateLocalLib, 'xpay_conting_type');
	let fiat = stateLib.getStateValue.call(stateLocalLib, 'xpay_fiat');

	this.ex_bn.innerText = (slide == '1' || slide == '2') ? customEvents.buttonText.next : 
		(tab == 'sell') ? customEvents.buttonText.paid : customEvents.buttonText.continue;

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
	this.ywg_c.innerHTML = fiat;

	/* dropdowns choice */
	setData.setDropdownFromState.call(setData, 'crypto', this);
	setData.setDropdownFromState.call(setData, 'fiat', this);


	this.ywg_q.innerHTML = (stateLib.getStateValue.call(stateLocalLib, 'xpay_fiat_quan')) ? 
		stateLib.getStateValue.call(stateLocalLib, 'xpay_fiat_quan') : '0';

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

	if (tab == 'sell') {
		setData.setDataFromDB.call(setData, 'sell', this);
		setData.setTransFromState.call(setData, 'sell', this, customEvents);
	} else {
		setData.setDataFromDB.call(setData, 'buy', this);
		setData.setTransFromState.call(setData, 'buy', this, customEvents);
	}

	setPage(this);
}