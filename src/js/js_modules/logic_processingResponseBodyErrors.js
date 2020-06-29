import modal from './logic_modal.js';

// this = TARGETS
export default function(responseObj, data) {
	const changeModal = modal.bind(this);

	if 	(
				data.type == 'login' || data.type == 'create' || data.type == 'confirm' || 
				data.type == 'verification' || data.type == 'exchanger'
			) 
	{
		changeModal(true,'custom-message', getErrorText(responseObj));
	} else {
		changeModal(true, 'deferred-redirect-to-home', {text: getErrorText(responseObj), timer: 15});
	}


	function getErrorText(responseObj) {
		let output = '';
		let errors = responseObj.body.errors;
		for (const key in errors) {
			if (Array.isArray(errors[key])) {
				for (let i = 0; i < errors[key].length; i++) {
					output += key + ': ' + errors[key][i] + '<br><br>'
				}
			} else {
				output += key + ': ' + errors[key] + '<br><br>'
			}
		}
		return output;
	}
}

/* Ф-я для того, чтоб вешать класс ошибки на iban или email (перенесена из cust-ev-callbacks) */
// function processingErors(responseObj) {
// 	let text = '';
// 	if 	(	responseObj.body.errors.hasOwnProperty('email') || 
// 				responseObj.body.errors.hasOwnProperty('iban')
// 			)
// 	{
// 		if 	(	responseObj.body.errors.hasOwnProperty('email') && 
// 					responseObj.body.errors.hasOwnProperty('iban')
// 				)
// 		{
// 			text = closureThis.responseErrors.both;
// 			closureEv.detail.targets.mail_si.parentElement.classList.add('error');
// 			closureEv.detail.targets.iban_si.parentElement.classList.add('error');
// 		} else if (responseObj.body.errors.hasOwnProperty('email')) {
// 			text = closureThis.responseErrors.email;
// 			closureEv.detail.targets.mail_si.parentElement.classList.add('error');
// 		} else {
// 			text = closureThis.responseErrors.iban;
// 			closureEv.detail.targets.iban_si.parentElement.classList.add('error');
// 		}
// 	} else {
// 		let messages = responseObj.body.errors;
// 		for (const key in messages) {
// 			if (Array.isArray(messages[key])) {
// 				let errorsArray = messages[key];
// 				for (let i = 0; i < errorsArray.length; i++) {
// 					text += errorsArray[i] + '<br><br>';
// 				}
// 			} else {
// 				text += messages[key] + '<br><br>';
// 			}
// 		}
// 	}
// 	changeModal(true, 'custom-message', text);
// 	closureThis.checkRate.start();
// }