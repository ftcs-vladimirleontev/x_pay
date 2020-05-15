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
			case 'country':
				temtlate = `<option class="ex-step-2__option" value="${key}">${data[key]}</option>\n`;
				break;
			case 'currency':
				temtlate = `<option value="${key}">${data[key].name} (${data[key].displayCode})</option>\n`;
				break;
		}
		output += temtlate;
	}
	target.innerHTML = output;
}
export default createSelect;