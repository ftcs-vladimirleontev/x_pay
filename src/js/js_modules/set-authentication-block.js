import stateLib from './library-state.js';
import stateLocalLib from './library-state-local.js';
import stateGlobalLib from './library-state-global.js';
import requests from './library-requests.js';
import modal from './logic_modal.js';
import getErrors from './logic_getErrors.js';
import setErrors from './logic_setErrors.js';
import processingServerErrors from './logic_processingServerErrors.js';
import processingResponseBodyErrors from './logic_processingResponseBodyErrors.js';

// this = TARGETS
export default function() {
	// for modal Windows
	const changeModal = modal.bind(this);
	const MESSAGES = {
			createOK: 'Your account has been created. We have sent you an email with a confirmation link to the email address you specified as your account name. Please confirm your registration.',
	};

	// for authentication window
	let allInputs = [
		this.login_ac_name_log, this.login_pass_log, 
		this.login_ac_name_cre, this.login_pass_cre, this.login_conf_pass_cre, 
	];

	// deleting the error class when changing inputs
	for (let i = 0; i < allInputs.length; i++) {
		allInputs[i].addEventListener('change', ev => {
			if (ev.target.value) {ev.target.parentElement.classList.remove('error');}
		});
	}

	// open modal window
	this.login_button.addEventListener('click', ev => {
		this.login_modal.classList.add('active');
	});

	// click tabs in modal window
	for (let i = 0; i < this.login_tabsArr.length; i++) {
		this.login_tabsArr[i].addEventListener('click', ev => {
			cleanAllChangeable.call(this);
			ev.target.classList.add('active');
			document.getElementById(ev.target.dataset.target).classList.add('active');
			this.login_do_button.innerText = ev.target.dataset.text;
		});
	}

	// click "close" button
	this.login_close_button.addEventListener('click', ev => {
		closeAuthenticationWindow.call(this);
	});

	// click "do" button
	this.login_do_button.addEventListener('click', ev => {
		let type = document.querySelector('.authentication__form.active').dataset.type;
		let errors = getErrors.call(this, 'authentication', {type: type});
		if (!errors) {
			changeModal(true);
			let body = (type == 'login') ? getLoginBody.call(this) : getCreateBody.call(this);
			let route = (type == 'login') ? '/login' : '/registration';
			let dataToCallback = {
				resolve: ifResponseIsOK.bind(this), 
				reject: processingServerErrors.bind(this), 
				toResolve: {type: type,},
				toReject: {type: type,},
			};

			let request = requests.sendPOSTRequest(requests.server, route, body);
			requests.processingFetch(request, requests.processingResponse, dataToCallback);
		} else {
			setErrors.call(this, 'authentication', {type: type, errors: errors});
		}


		function getLoginBody() {
			return {
				email: this.login_ac_name_log.value,
				password: this.login_pass_log.value,
			};
		}

		function getCreateBody() {
			return {
				"user": {
					"email": this.login_ac_name_cre.value,
					"plainPassword": this.login_pass_cre.value,
				}
			};
		}

		function ifResponseIsOK(responseObj, data) {
			// console.log(responseObj);
			// console.log(data);
			if (responseObj.body.status == 200) {
				if (data.type == 'login') {
					stateLib.setStateValue.call(stateLocalLib, 'xpay_user', responseObj.body.token, stateLib.getTime());
					stateLib.synch.call(stateLib, stateGlobalLib, stateLocalLib);
					location.href = './account.html'
				} else {
					closeAuthenticationWindow.call(this);
					changeModal(true,'custom-message', MESSAGES.createOK);
				}
			} else {
				// console.log('');
				processingResponseBodyErrors.call(this, responseObj, data);
			}
		}
	});

	function cleanAllChangeable() {
		this.login_tabsArr[0].classList.remove('active');
		this.login_tabsArr[1].classList.remove('active');
		this.login_sec_login.classList.remove('active');
		this.login_sec_create.classList.remove('active');
		this.login_do_button.innerText = '';
		for (let i = 0; i < allInputs.length; i++) {
			allInputs[i].value = '';
			allInputs[i].parentElement.classList.remove('error');
		}
	}

	function closeAuthenticationWindow() {
		this.login_modal.classList.remove('active');
		cleanAllChangeable.call(this);
		this.login_tabsArr[0].classList.add('active');
		this.login_sec_login.classList.add('active');
		this.login_do_button.innerText = this.login_tabsArr[0].dataset.text;
	}
}