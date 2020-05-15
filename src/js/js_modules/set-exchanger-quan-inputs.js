// !!! костыль на старый калькулятор sell crypto
import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
/********************************************************************/
// this = TARGETS
export default function(customEvents) {
	const INPUTS = [this.cryptoQ, this.fiatQ];
	const KEYS = {
		service: new Set([
			'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'
		]),
		numbers: new Set([
			'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
		]),
		separators: new Set([
			'.', ','
		]),
	};
	for (let i = 0; i < INPUTS.length; i++) {
		INPUTS[i].addEventListener('focus', ev => {
			startEvent('change-counting', ev, this);
		});

		INPUTS[i].addEventListener('keydown', ev => {
			if (
				!KEYS.numbers.has(ev.key) && 
				!KEYS.service.has(ev.key) && 
				!KEYS.separators.has(ev.key)
			) {
				ev.preventDefault();
			} else {
				let value = ev.target.value;
				if 	(	KEYS.separators.has(ev.key) && 
							(value.indexOf('.') != -1 || value.indexOf(',') != -1)
						)
				{
					ev.preventDefault();
				}
				let type = (ev.target == this.cryptoQ) ? 'crypto' : 'fiat';
				if (!KEYS.service.has(ev.key) && stopInput(value, type)) {
					ev.preventDefault();
				}

				function stopInput(value, type) {
					let flag = false;
					if (value.indexOf('.') != -1 || value.indexOf(',') != -1) {
						let separatorPosition = (value.indexOf('.') != -1) ? 
							value.indexOf('.') : value.indexOf(',');
						if (+separatorPosition + getDecimalPlaces(type) + 1 == value.length) {
							flag = true;
						}
					}
					return flag;
				}

				function getDecimalPlaces(type) {
					return (type == 'crypto') ? 5 : 2;
				}
			}
		});

		INPUTS[i].addEventListener('keyup', ev => {
			if (
				!KEYS.numbers.has(ev.key) && 
				!KEYS.service.has(ev.key) && 
				!KEYS.separators.has(ev.key)
			) {
				ev.preventDefault();
			} else {
				startEvent('currency-input-is-changed', ev, this);
			}
		});
	}

	function startEvent(key, ev, targets) {
		let dataForEvent = {
			type: ev.target.dataset.type,
			targets: targets,
			variables: customEvents.variables
		};
		let cusEv = customEvents.CreateCustomEvent(key, dataForEvent);
		customEvents.startCustomEvent(cusEv);
	}
}