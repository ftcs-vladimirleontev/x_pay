"use strict";

export default function(customEvents) {
	const SELECTS = [this.crypto, this.fiat];
	for (let i = 0; i < SELECTS.length; i++) {
		SELECTS[i].addEventListener('change', ev => {
			let dataForEv = {
				type: ev.target.dataset.type, targets: this, variables: customEvents.variables,
			};
			customEvents.startEvent.call(
				customEvents, 'currency-select-is-changed', dataForEv
			);
		});
	}
}