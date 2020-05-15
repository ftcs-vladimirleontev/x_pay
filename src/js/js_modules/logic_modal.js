import text from '../source/modal.json';
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
}