export default {
	server: 'https://srv.bitfiat.online',

	sendPOSTRequest: function (server, route, body, token, additionalHeaders) {
		let addHeaders = new GetHeaders(token);
		let headers = {};
		if (additionalHeaders && typeof(additionalHeaders) === 'object') {
			addHeaders.concat(additionalHeaders);
		}
		for (let i = 0; i < addHeaders.length; i++) {
			headers[addHeaders[i][0]] = addHeaders[i][1];
		}
		return fetch(server + route, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(body)
		});
		function GetHeaders(token) {
			let output = [];
			output.push(["Content-Type", "application/json;charset=utf-8"]);
			/* добавление токена */
			// if (token) {
				
			// }
			return output;
		}
	},

	sendGETRequest: function (server, route) {
		return fetch(server + route);
	},

	processingFetch: function (promise, callback) {
		promise
			.then(response => getResponseObj(response))
			.then(responseObj => callback(responseObj));

		async function getResponseObj(response) {
			return {ok: response.ok, status: response.status, body: await response.json()};
		}	
	},
};