"use strict";

export default function(input) {
	const keyTranslatorOfDetails = {
		"beneficiaryName": "Beneficiary name",
		"bankName": "Bank name",
		"swift": "Swift",
		"iban": "Iban",
		"email": "Email",
		"phone": "Phone",
	}

	let output = [];
	for (let i = 0; i < input.length; i++) {
		output[i] = {};
		for (let key in input[i]) {
			output[i][key] = input[i][key];
		}
		output[i].details = [];
		let counter = 0;
		for (const key in input[i].details) {
			output[i].details[counter] = [];
			output[i].details[counter][0] = keyTranslatorOfDetails[key];
			output[i].details[counter][1] = input[i].details[key];
			counter++;
		}
	}
	return output;
}