"use strict";

export default function(customEvents) {
	const TABS = this.tabs;
	for (let i = 0; i < TABS.length; i++) {
		TABS[i].addEventListener('click', ev => {
			let dataForEv = {
				mode: ev.target.dataset.mode,
				targets: this,
				variables: customEvents.variables,
			};
			customEvents.startEvent.call(customEvents,'tab-is-clicked', dataForEv);
		});
	}
}




