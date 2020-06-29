// this = TARGETS
export default function(tab, errors) {
	let errorsSet = new Set(errors);
	let sellArray = [
		this.mail_si, this.wallet_si, this.benifN_si, this.bankN_si, this.swift_si, 
		this.iban_si
	];
	let buyArray = [
		this.mail_bi, this.phone_bi, this.benifC_bi, this.bankN_bi, this.bankC_bi
	];
	let checkArray = (tab == 'sell') ? sellArray : buyArray;

	for (let i = 0; i < checkArray.length; i++) {
		if (errorsSet.has('' + i)) {
			checkArray[i].parentElement.classList.add('error');
		}
	}
	return errors;
}