(function () {
	const form = document.querySelector('[data-exercise-filters]');
	const cards = Array.from(document.querySelectorAll('[data-exercise-card]'));
	const count = document.querySelector('[data-exercise-count]');
	const empty = document.querySelector('[data-exercise-empty]');
	if (!form || !cards.length) return;

	const search = form.querySelector('[name="q"]');
	const unit = form.querySelector('[name="unit"]');
	const family = form.querySelector('[name="family"]');
	const minutes = form.querySelector('[name="minutes"]');

	function update() {
		const query = search.value.trim().toLocaleLowerCase();
		const selectedUnit = unit.value.toLocaleLowerCase();
		const selectedFamily = family.value;
		const maxMinutes = Number(minutes.value) || Infinity;
		let visible = 0;
		for (const card of cards) {
			const matches = (!query || card.dataset.search.includes(query)) &&
				(!selectedUnit || card.dataset.units.split(/\s+/).includes(selectedUnit)) &&
				(!selectedFamily || card.dataset.family === selectedFamily) &&
				Number(card.dataset.minutes) <= maxMinutes;
			card.hidden = !matches;
			if (matches) visible += 1;
		}
		count.textContent = `Showing ${visible} of ${cards.length} exercises`;
		empty.hidden = visible !== 0;
	}

	form.addEventListener('input', update);
	form.addEventListener('change', update);
	form.addEventListener('reset', () => requestAnimationFrame(update));
})();
