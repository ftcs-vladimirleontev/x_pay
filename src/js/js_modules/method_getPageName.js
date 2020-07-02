export default function() {
	let urlComponents = location.href.split('/');
	return urlComponents[urlComponents.length - 1].split('?')[0];
}