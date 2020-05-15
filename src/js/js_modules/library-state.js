// this = stateLocalLib or stateGlobalLib or this library
export default {
	itsHere: function() {
		return this.iAmHere();
	},

	iHaveKey: function (key) {
		return this.all_keys.has(key);
	},

	createDefaultState: function(time) {
		this.createDefault(time, this.setValue, this.correctDataIn, this.defaultValuesArray);
	},

	getStateValue: function (key) {
		return this.correctDataFrom(this.getValue(key));
	},

	setStateValue: function(key, value, time) {
		this.setValue(key, this.correctDataIn(value));
		if (this.all_keys.has('xpay_last_change')) {
			this.setValue('xpay_last_change', this.correctDataIn(time));
		}
	},

	deleteStateValue: function (key, time) {
		this.deleteValue(key);
		this.setValue('xpay_last_change', this.correctDataIn(time));
	},

	getAllState: function () {
		if (this.iAmHere()) {
			return this.getAll(this.all_keys, this.getValue, this.correctDataFrom);
		} else {
			return null;
		}
	},

	cleanState: function (time) {
		this.clean(this.deleteValue);
		this.setValue('xpay_last_change', this.correctDataIn(time));
	},

	deleteStateObj: function () {
		this.deleteState(this.all_keys, this.deleteValue);
	},

	getTime: function () {
		return (!Date.now) ? getTimePoly() : Date.now();
		function getTimePoly() {
			return new Date().getTime();
		}
	},

	synchLocalState: function (globLib, locLib) {
		let global = this.getAllState.call(globLib);
		let time = this.getStateValue.call(globLib, 'xpay_last_change');
		if (!this.itsHere.call(locLib)) {
			this.createDefaultState.call(locLib, time);
		}
		for (const key in global) {
			this.setStateValue.call(locLib, key, global[key], time);
		}
	},

	init: function(target) {
		if (!this.itsHere.call(target)) {
			let timeCreating = this.getTime();
			this.createDefaultState.call(target, timeCreating);
		}
	},

	synchLocal: function(globLib, locLib) {
		let global = this.getAllState.call(globLib);
		for (const key in global) {
			this.setStateValue.call(locLib, key, global[key], global['xpay_last_change']);
		}
	},

	synch: function (globLib, locLib) {
		let global = this.getAllState.call(globLib);
		let local = this.getAllState.call(locLib);

		if (+global['xpay_last_change'] <= +local['xpay_last_change']) {
			synchTarget(this, globLib, local);
		} else {
			synchTarget(this, locLib, global);
		}
		// if (+global['xpay_last_change'] != +local['xpay_last_change']) {

		// }

		function synchTarget(lib, context, source) {
			for (const key in source) {
				lib.setStateValue.call(context, key, source[key], source['xpay_last_change']);
			}
		}
	},
}