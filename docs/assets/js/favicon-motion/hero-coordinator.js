export function bindFaviconBackgroundMotion(hero, field, options = {}) {
	if (!hero || !field) return () => {};
	const setCameraPaused = field.setCameraPaused?.bind(field);
	if (!setCameraPaused) return () => {};

	const reasons = new Set();
	const sync = () => setCameraPaused(reasons.size > 0);
	const setReason = (reason, active) => {
		if (active) reasons.add(reason);
		else reasons.delete(reason);
		sync();
	};

	const onShared = (event) => {
		setReason('favicon-module', event.detail?.active === true);
	};
	hero.addEventListener('favicon-canvas-interaction', onShared);

	const mark = hero.querySelector(options.selector || '[data-favicon-src]');
	const onEnter = () => setReason('favicon-pointer', true);
	const onLeave = () => setReason('favicon-pointer', false);
	const onFocusIn = () => setReason('favicon-focus', true);
	const onFocusOut = (event) => {
		if (!mark?.contains(event.relatedTarget)) setReason('favicon-focus', false);
	};
	mark?.addEventListener('pointerenter', onEnter);
	mark?.addEventListener('pointerleave', onLeave);
	mark?.addEventListener('focusin', onFocusIn);
	mark?.addEventListener('focusout', onFocusOut);

	return () => {
		hero.removeEventListener('favicon-canvas-interaction', onShared);
		mark?.removeEventListener('pointerenter', onEnter);
		mark?.removeEventListener('pointerleave', onLeave);
		mark?.removeEventListener('focusin', onFocusIn);
		mark?.removeEventListener('focusout', onFocusOut);
		reasons.clear();
		setCameraPaused(false);
	};
}

