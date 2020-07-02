"use strict";

import _t from '../../../node_modules/lodash.template';
export default function(templateID, data, targetID) {
	let template = _t(document.getElementById(templateID).innerHTML);
	document.getElementById(targetID).innerHTML = template({data: data});
}