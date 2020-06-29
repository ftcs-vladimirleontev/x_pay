function cloneData(input) {
	let type = whatIsIt(input);
	return (type == 'not_object') ? input : 
		(type == 'array') ? cloneArray(input) :
			(type == 'map') ? cloneMap(input) :
				(type == 'set') ? cloneSet(input) : cloneObject(input);

	

	function whatIsIt(input) {
		return (!input || typeof(input) == 'function' || typeof(input) != 'object') ? 'not_object' : 
			(Array.isArray(input)) ? 'array' : 
				(input.set && input.get && input.has && input.delete && input.clear && input.size) ? 'map' : 
					(input.add && input.delete && input.has && input.clear && input.size) ? 'set' : 'object';
	}

	function cloneArray(input) {
		let output = [];
		for (let i = 0; i < input.length; i++) {
			output[i] = cloneData(input[i]);
		}
		return output;
	}

	function cloneMap(input) {
		let output = new Map();
		for (const key of input.keys()) {
			let keyValue = cloneData(key);
			let value = cloneData(input[key]);
			output.set(keyValue, value);
		}
		return output;
	}

	function cloneSet(input) {
		let output = new Set();
		for (const value of input) {
			output.add(cloneData(value));
		}
		return output;
	}

	function cloneObject(input) {
		let output = {};
		for (const key in input) {
			output[key] = cloneData(input[key]);
		}
		return output;
	}
}

export default cloneData;