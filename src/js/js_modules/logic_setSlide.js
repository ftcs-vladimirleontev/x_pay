"use strict";

import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import setPage from './logic_setPage.js';

function setSlide(number, TARGETS) {
	let time = stateLib.getTime();
	stateLib.setStateValue.call(stateLocalLib, 'xpay_slide', number, time);
	setPage(TARGETS);
}

export default setSlide;