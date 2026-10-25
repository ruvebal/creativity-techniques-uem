(function () {
	const header = document.querySelector('.site-chrome-header');
	const button = header && header.querySelector('.site-menu-toggle');
	const navigation = header && header.querySelector('#primary-navigation');
	if (!header || !button || !navigation) return;

	const mobile = window.matchMedia('(max-width: 1412px)');
	const setOpen = function (open) {
		button.setAttribute('aria-expanded', String(open));
		button.setAttribute('aria-label', open ? button.dataset.closeLabel : button.dataset.openLabel);
		navigation.hidden = !open;
	};

	const syncViewport = function () {
		if (mobile.matches) {
			setOpen(false);
		} else {
			navigation.hidden = false;
			button.setAttribute('aria-expanded', 'false');
			button.setAttribute('aria-label', button.dataset.openLabel);
		}
	};

	header.classList.add('site-menu-enhanced');
	syncViewport();
	button.addEventListener('click', function () {
		setOpen(button.getAttribute('aria-expanded') !== 'true');
	});
	navigation.addEventListener('click', function (event) {
		if (event.target.closest('a') && mobile.matches) {
			setOpen(false);
			button.focus();
		}
	});
	document.addEventListener('click', function (event) {
		if (mobile.matches && button.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) {
			setOpen(false);
		}
	});
	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape' && mobile.matches && button.getAttribute('aria-expanded') === 'true') {
			setOpen(false);
			button.focus();
		}
	});
	if (mobile.addEventListener) mobile.addEventListener('change', syncViewport);
	else mobile.addListener(syncViewport);
})();
