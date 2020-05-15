export default function(customEvents) {
	const TABS = this.tabs;
	for (let i = 0; i < TABS.length; i++) {
		TABS[i].addEventListener('click', ev => {
			let dataForEvent = {
				mode: ev.target.dataset.mode,
				targets: this,
				variables: customEvents.variables,
			};
			let cusEv = customEvents.CreateCustomEvent('tab-is-clicked', dataForEvent);
			customEvents.startCustomEvent(cusEv);
		});
	}
}




