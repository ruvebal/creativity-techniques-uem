(() => {
  // Lightweight pass-track deck for Creativity Techniques.
  // Uses content.json + a simple backgrounds list (triangle archive SVGs).
  // Does not require the full fractal figcaption/index pipeline.
  const body = document.body;
  const slidesRoot = document.getElementById('slides');

  const escapeHtml = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');

  const renderFirstSlideLogo = () => {
    // Logo lives only in the fixed .deck-logo chrome — never inside the slide card.
    return '';
  };

  const renderDeckHeader = () => {
    const header = document.createElement('header');
    header.className = 'pass-track-deck-header';
    header.innerHTML = `
      <div class="pass-track-deck-header__title">
        <span>${escapeHtml(body.dataset.trackTitle || '')}</span>
        <small>${escapeHtml(body.dataset.trackSubtitle || '')}</small>
      </div>
      <div class="pass-track-deck-header__meta">
        <span>${escapeHtml(body.dataset.trackAuthor || '')}</span>
      </div>`;
    document.body.append(header);
  };

  const renderCalendarNote = (calendar) => {
    if (!calendar?.note) return '';
    const link = calendar.source_url
      ? ` <a href="${escapeHtml(calendar.source_url)}" target="_blank" rel="noopener">${escapeHtml(calendar.source_label || 'calendar')}</a>.`
      : '';
    return `<aside class="pass-track-calendar-note"><p>${escapeHtml(calendar.note)}${link}</p></aside>`;
  };

  const defaultBackgrounds = [
    'ct-pass-01-structure.svg',
    'ct-pass-02-threshold.svg',
    'ct-pass-03-branching.svg',
    'ct-pass-04-practice.svg',
    'ct-pass-05-feedback.svg',
    'ct-pass-06-coherence.svg',
  ];

  const requests = [fetch(body.dataset.contentUrl)];
  if (body.dataset.calendarUrl) requests.push(fetch(body.dataset.calendarUrl));

  Promise.all(requests)
    .then(async ([contentResponse, calendarResponse]) => {
      if (!contentResponse.ok) throw new Error(`Slide data returned ${contentResponse.status}`);
      if (calendarResponse && !calendarResponse.ok) {
        throw new Error(`Calendar data returned ${calendarResponse.status}`);
      }
      return [
        await contentResponse.json(),
        calendarResponse ? await calendarResponse.json() : null,
      ];
    })
    .then(([data, calendar]) => {
      const backgrounds = data.backgrounds?.length ? data.backgrounds : defaultBackgrounds;
      const artBase = (body.dataset.artBase || '').replace(/\/$/, '');
      renderDeckHeader();
      const firstSlideLogo = renderFirstSlideLogo();
      const calendarNote = calendar ? renderCalendarNote(calendar) : '';

      slidesRoot.innerHTML = data.slides
        .map((slide, index) => {
          const file = backgrounds[index % backgrounds.length];
          const imageUrl = `${artBase}/${escapeHtml(file)}`;
          const slideCalendarNote = slide.calendar_note ? calendarNote : '';
          const slideLogo = index === 0 ? firstSlideLogo : '';
          return `<section
          data-background-image="${imageUrl}"
          data-background-size="cover"
          data-background-position="center"
          data-background-color="#1a0f08">
          <div class="pass-track-slide-copy">${slideLogo}${slide.content}${slideCalendarNote}</div>
        </section>`;
        })
        .join('');

      return Reveal.initialize({
        hash: true,
        slideNumber: true,
        transition: 'slide',
        backgroundTransition: 'fade',
        width: 1280,
        height: 720,
        margin: 0.055,
        minScale: 0.2,
        maxScale: 1.35,
      });
    })
    .catch((error) => {
      slidesRoot.innerHTML = `<section><h2>Slides unavailable</h2><p>${escapeHtml(error.message)}</p></section>`;
      Reveal.initialize({ hash: true, slideNumber: true });
    });
})();
