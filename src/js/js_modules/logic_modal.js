import text from '../source/modal.json';
// import reloadPage from './logic_reloadPage.js';
import logic_setTemplate from './logic_setTemplate';
// this = TARGETS
export default function(switcher, type, data) {
	if (switcher) {
		this.modal_bd.innerHTML = text.button_d;
		switch (type) {
			case 'confirm':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.remove('d-none');
				this.modal_t.innerHTML = text.text.confirm;
				this.modal_bc.innerHTML = text.button_cancel;
				this.modal.classList.add('active');
				break;
			case 'deleted':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.deleted;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'buy-end':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.buy_end;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'sell-end':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.sell_end;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'all-end':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.all_end;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'wait':
				this.modal_a.classList.remove('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.add('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.wait;
				this.modal.classList.add('active');
				break;
			case 'not-paid':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.not_paid;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'no-data-of-numbers':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.no_data_of_numbers;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'null-data':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.null_data;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'accept_si':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.accept_si;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'time-is-up':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.time_is_up;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'server-not-available':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.server_not_available;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'destroyed':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = `Sorry, but the service can't provide ${data} sales at the moment. The transaction will be canceled`;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			case 'timer-to-reload':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				setTemplate.call(this, 'timer-to-reload', data);
				this.modal.classList.add('active');
				break;
			case 'deferred-redirect-to-home':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				setTemplate.call(this, 'deferred-redirect-to-home', data);
				this.modal.classList.add('active');
				break;
			case 'custom-message':
				this.modal_a.classList.add('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.remove('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = data;
				this.modal_bc.innerHTML = text.button_close;
				this.modal.classList.add('active');
				break;
			default:
				this.modal_a.classList.remove('d-none');
				this.modal_t.classList.remove('d-none');
				this.modal_b.classList.add('d-none');
				this.modal_bd.classList.add('d-none');
				this.modal_t.innerHTML = text.text.loading;
				this.modal.classList.add('active');
				break;
		}
	} else {
		this.modal.classList.remove('active');
	}

	function setTemplate(type, data) {
		this.modal_t.innerHTML = getTemplate(type, data);
		this.modal_bc.innerHTML = getButtonText(type);
		let doIt = getCallback(type);

		this.modal_bc.addEventListener('click', ev => {
			doIt();
		});
		let timer = data.timer;
		setInterval(() => {
			--timer;
			setTimerValue(timer, doIt);
		}, 1000);

		
		function getTemplate(type, data) {
			switch(type) {
				case 'timer-to-reload':
					return `<p>${data.text}. ${text.text.timer_to_reload.if_press_button}</p>
									<p>
										<span>${text.text.timer_to_reload.reload_after}</span>
										<span id="modal-timer-value">${data.timer}</span>
										<span>${text.text.timer_to_reload.unit_of_time}</span>
									</p>`;
				case 'deferred-redirect-to-home':
					return `<p>${data.text}</p>
									<p>${text.text.deferred_redirect.if_press_button}</p>
									<p>
										<span>${text.text.deferred_redirect.redirect_after}</span>
										<span id="modal-timer-value">${data.timer}</span>
										<span>${text.text.deferred_redirect.unit_of_time}</span>
									</p>`;
			}
		}
	
		function getButtonText(type) {
			switch(type) {
				case 'timer-to-reload':
					return text.button_reload;
				case 'deferred-redirect-to-home':
					return text.button_to_home;
			}
		}

		function getCallback(type) {
			switch(type) {
				case 'timer-to-reload':
					return function(){document.location.reload(true);};
				case 'deferred-redirect-to-home':
					return function(){location.href = '/'};
			}
		}
	
		function setTimerValue(timer, doIt) {
			let target = document.getElementById('modal-timer-value');
			target.innerHTML = timer;
			if (timer <= 0) {
				doIt();
			}
		}
	}
}