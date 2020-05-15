export default function(customEvents) {
	const SELECTS = [this.crypto, this.fiat];
	for (let i = 0; i < SELECTS.length; i++) {
		SELECTS[i].addEventListener('change', ev => {
			let dataForEvent = {
				type: ev.target.dataset.type,
				targets: this,
				variables: customEvents.variables,
			};
			let cusEvForSelect = customEvents.CreateCustomEvent(
				'currency-select-is-changed', dataForEvent
			);
			customEvents.startCustomEvent(cusEvForSelect);
		});
	}
}