export default function (callback, interval, inputData) {
	const REPEAT = callback;
	let timeStep =  interval;
	let intervalID = null;
	if (typeof REPEAT == 'function' && typeof interval == 'number') {
		this.start = function() {
			if (intervalID === null) {
				REPEAT(inputData);
				intervalID = setInterval(REPEAT, timeStep, inputData);
			}
		}
		this.stop = function() {
			if (intervalID) {
				clearInterval(intervalID);
				intervalID = null;
			}
		}
		this.changeInterval = function(value) {
			if (typeof value == 'number') {
				this.stop();
				timeStep = value;
				this.start();
			}
		}
		this.isStarted = function() {
			return (intervalID) ? true : false;
		}
		this.getIntervalID = function() {
			return intervalID;
		}
	} else {
		return {};
	}
}