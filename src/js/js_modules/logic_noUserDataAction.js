import modal from './logic_modal.js';
export default function(type) {
	const changeModal = modal.bind(this);
	let text;
	switch (type) {
		case 'account':
			text = 'Sorry, but the user data is incorrect. Try the login procedure again';
			break;
		case 'check':
			text = 	'Sorry, but the transaction link is incorrect. ' + 
							'You can go to the main page and request to re-send the letter to your mailbox in the login window.';
			break;
		case 'confirm':
			text = 'Sorry, but we can\'t confirm the transaction at this time. Try this again later';
			break;
	}
	if (type == 'confirm') {
		changeModal(true,'custom-message', text);
	} else {
		changeModal(true, 'deferred-redirect-to-home', {text: text, timer: 15});
	}
}