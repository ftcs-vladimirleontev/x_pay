export default function(targetsClass, activationClass) {
	let showButtons = document.querySelectorAll(targetsClass);
	if (showButtons) {
		for (let i = 0; i < showButtons.length; i++) {
			showButtons[i].addEventListener('click', ev => {
				ev.target.parentElement.parentElement.nextElementSibling.classList.toggle(activationClass);
				ev.target.innerText = (ev.target.innerHTML == 'show') ? 'hide' : 'show';
			});
		}
	}
}