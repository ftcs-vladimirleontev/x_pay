const firstForm = document.getElementById('first-form');
const secondForm = document.getElementById('second-form');

const CRYPTO = document.getElementById('select_cripto');
const CURRENCY = document.getElementById('select_currency');
const QUANTITY_CRYPTO = document.getElementById('select_quantity');
const NEXT_BUTTON = document.getElementById('next-button');

const MAIL = document.getElementById('input_email');
const WALLET = document.getElementById('input_wallet');
const BANK = document.getElementById('input_bank');
const SWIFT = document.getElementById('input_swift');
const ACCOUNT = document.getElementById('input_account');

const EXCHANGE_BUTTON = document.getElementById('exchange-button');

let toServer = {
	crypto: '',
	currency: '',
	quantity_crypto: 0,
	mail: '',
	wallet: '',
	bank: '',
	swift: '',
	account: ''
}

NEXT_BUTTON.addEventListener('click', () => {
	toServer.crypto = CRYPTO.value;
	toServer.currency = CURRENCY.value;
	toServer.quantity_crypto = QUANTITY_CRYPTO.value;

	firstForm.classList.remove('active');
	secondForm.classList.add('active');
});

EXCHANGE_BUTTON.addEventListener('click', () => {
	toServer.mail = MAIL.value;
	toServer.wallet = WALLET.value;
	toServer.bank = BANK.value;
	toServer.swift = SWIFT.value;
	toServer.account = ACCOUNT.value;

	sendToServer();
	clearData();
	secondForm.classList.remove('active');
	firstForm.classList.add('active');
});


function sendToServer() {
	console.log(toServer);
}
function clearData() {
	toServer = {
		crypto: '',
		currency: '',
		quantity_crypto: 0,
		mail: '',
		wallet: '',
		bank: '',
		swift: '',
		account: ''
	}
	CRYPTO.value = "btc";
	CURRENCY.value = "usd";
	QUANTITY_CRYPTO.value = "0";
	MAIL.value = '';
	WALLET.value = '';
	BANK.value = '';
	SWIFT.value = '';
	ACCOUNT.value = '';
}