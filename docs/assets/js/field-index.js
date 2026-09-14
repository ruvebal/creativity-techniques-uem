/**
 * Field index — sticky TOC active state + hash scroll.
 * Single-route pages: /directory/en/, /lexicum/en/, /methods/en/
 */
(function () {
	const root = document.querySelector('[data-field-index]');
	if (!root) return;

	const tocLinks = Array.from(root.querySelectorAll('.field-index__toc a[href^="#"]'));
	const sections = tocLinks
		.map((a) => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))))
		.filter(Boolean);

	function setActive(id) {
		tocLinks.forEach((a) => {
			const match = a.getAttribute('href') === `#${id}`;
			a.classList.toggle('is-active', match);
			if (match) a.setAttribute('aria-current', 'true');
			else a.removeAttribute('aria-current');
		});
	}

	function scrollToHash(hash, behavior) {
		if (!hash || hash === '#') return;
		const id = decodeURIComponent(hash.replace(/^#/, ''));
		const el = document.getElementById(id);
		if (!el) return;
		el.scrollIntoView({ behavior: behavior || 'smooth', block: 'start' });
		setActive(sections.find((s) => s.contains(el) || s.id === id)?.id || id.split('--')[0]);
	}

	tocLinks.forEach((a) => {
		a.addEventListener('click', (e) => {
			const href = a.getAttribute('href');
			if (!href || !href.startsWith('#')) return;
			e.preventDefault();
			history.pushState(null, '', href);
			scrollToHash(href, 'smooth');
		});
	});

	window.addEventListener('hashchange', () => scrollToHash(location.hash, 'smooth'));

	if (location.hash) {
		requestAnimationFrame(() => scrollToHash(location.hash, 'auto'));
	}

	if (!('IntersectionObserver' in window) || !sections.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			const visible = entries
				.filter((en) => en.isIntersecting)
				.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
			if (visible[0]) setActive(visible[0].target.id);
		},
		{ rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] },
	);
	sections.forEach((s) => observer.observe(s));
})();
