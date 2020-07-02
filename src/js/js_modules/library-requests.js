"use strict";

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
			if (token) {
				output.push(["Authorization", "Bearer " + token]);
			}
			return output;
		}
	},

	sendGETRequest: function (server, route, token) {
		return (!token) ? fetch(server + route) : fetch(server + route, {
			method: "GET",
			headers: {
				"Authorization": "Bearer " + token,
			},
		});
	},

	// sendGETRequestWithToken: function (server, route, token) {
	// 	return fetch(server + route, {
	// 		method: "GET",
	// 		headers: {
	// 			"Authorization": "Bearer " + token,
	// 		},
	// 	});
	// },

	processingFetch: function (promise, callback, data) {
		promise
			.then(response => getResponseObj(response))
			.then(responseObj => callback(responseObj, data));

		async function getResponseObj(response) {
			return {ok: response.ok, status: +response.status, body: await response.json()};
		}	
	},

	processMultipleGETRequests: function(responsesArray, callback, data) {
		Promise.all(responsesArray)
			.then(responses => {
				let values = [];
				for (let i = 0; i < responses.length; i++) {
					values.push(responses[i].json());
				}
				return Promise.all(values);
			})
			.then(values => callback(values, data));
	},

	processingResponse: function(responseObj, data) {
		console.log(responseObj);
		if (responseObj.ok) {
			data.resolve(responseObj, data.toResolve);
		} else {
			data.reject(responseObj, data.toReject);
		}
	},

	bodyIsOK: function (responseObj) {
		return (!responseObj.body.hasOwnProperty('status')) ? true :
			(responseObj.body.status == '200') ? true : false;
	},

	responseIsNotOK: function (responseObj) {
		return (responseObj.ok) ? 0 : '' + responseObj.status;
	},

};