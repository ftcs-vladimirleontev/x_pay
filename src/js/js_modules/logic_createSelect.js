function createSelect(type, target, data) {
	let flag = true;
	let output = '';
	for (let key in data) {
		if (flag) {
			target.dataset.default = key;
			flag = false;
		}
		let temtlate;
		switch(type) {
			case '':
				temtlate = `<option class="ex-step-2__option" value="${key}">${data[key]}</option>\n`;
				break;
			case '':
				temtlate = `<option value="BTC">Bitcoin (BTC)</option>\n`;
				break;
		}
		output += temtlate;
	}
	target.innerHTML = output;
}
export default createSelect;