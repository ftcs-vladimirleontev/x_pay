/* libraries for state */
import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
import stateDBLib from './library-state-db.js';

export default function(VERSION) {
	let time = stateLib.getTime();
	if (!stateLib.itsHere.call(stateGlobalLib)) {
		createGlobState();
	} else {
		let vers = stateLib.getStateValue.call(stateGlobalLib, 'xpay_version');
		if (!vers || vers != VERSION) {
			stateLib.deleteStateObj.call(stateGlobalLib);
			createGlobState();
		}
	}
	stateLib.init.call(stateLib, stateLocalLib);
	stateLib.synchLocal.call(stateLib, stateGlobalLib, stateLocalLib);
	stateLib.init.call(stateLib, stateDBLib);

	function createGlobState() {
		stateLib.init.call(stateLib, stateGlobalLib);
		stateLib.setStateValue.call(stateGlobalLib, 'xpay_version', VERSION, time);
	}
}