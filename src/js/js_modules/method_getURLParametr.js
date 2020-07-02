"use strict";

export default function(paramName) {
  let addressString = window.location.toString();  
	let parameters = (addressString.indexOf("?") == -1) ? null : addressString.split('?')[1];
	if (parameters) {
		let paramArray = parameters.split('&'), output = '';
		for (let i = 0; i < paramArray.length; i++) {
			if (paramArray[i].includes(paramName)) {
				output = paramArray[i];
				break;
			}
		}
		return (output) ? output.split('=')[1] : null;
	} else {
		return null;
	}
}