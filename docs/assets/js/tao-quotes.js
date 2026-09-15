(() => {
  // JSON-sourced Tao of Creativity — quotes + lexicum / field-discussion metadata.
  const root = document.getElementById('tao-root');
  if (!root) return;

  const url = root.dataset.quotesUrl;
  const baseurl = (root.dataset.baseurl || '').replace(/\/$/, '');
  const loading = document.getElementById('tao-loading');

  const withBase = (path) => {
    if (!path) return path;
    if (/^https?:/i.test(path)) return path;
    return `${baseurl}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  const formatText = (text) => escapeHtml(text).replaceAll('\n', '<br>');

  const lexicumHref = (uriLocal, lexPath) => {
    if (!uriLocal) return withBase(lexPath || '/lexicum/en/');
    const slug = String(uriLocal).replace(/^ct:/, '');
    return `${withBase(lexPath || '/lexicum/en/')}#${encodeURIComponent(slug)}`;
  };

  const renderMeta = (quote, lexPath) => {
    const concepts = quote.lexicum?.concepts || [];
    const areas = quote.creativity_areas || [];
    const discussions = quote.field_discussions || [];
    if (!concepts.length && !areas.length && !discussions.length) return '';

    const conceptLinks = concepts.map((c) =>
      `<a class="tao-chip tao-chip-concept" href="${escapeHtml(lexicumHref(c.uri_local, lexPath))}" title="${escapeHtml(c.qualified)}">${escapeHtml(c.pref_label)}</a>`
    ).join(' ');

    const areaChips = areas.map((a) =>
      `<span class="tao-chip tao-chip-area">${escapeHtml(String(a).replaceAll('_', ' '))}</span>`
    ).join(' ');

    const discChips = discussions.map((d) =>
      `<span class="tao-chip tao-chip-discussion" title="${escapeHtml(d)}">${escapeHtml(d)}</span>`
    ).join(' ');

    return `
      <div class="tao-quote-meta" aria-label="Related creativity areas and field discussions">
        ${conceptLinks ? `<p class="tao-meta-row"><span class="tao-meta-label">Thesaurus</span> ${conceptLinks}</p>` : ''}
        ${areaChips ? `<p class="tao-meta-row"><span class="tao-meta-label">Areas</span> ${areaChips}</p>` : ''}
        ${discChips ? `<p class="tao-meta-row"><span class="tao-meta-label">Field discussions</span> ${discChips}</p>` : ''}
      </div>`;
  };

  const renderQuote = (quote, lexPath) => `
    <blockquote class="tao-quote" id="${escapeHtml(quote.id)}" aria-label="The Tao of Creativity">
      <p>${formatText(quote.text)}</p>
      ${quote.form ? `<p class="tao-form"><em>${escapeHtml(quote.form)}</em></p>` : ''}
      <cite>— The Tao of Creativity</cite>
      ${renderMeta(quote, lexPath)}
    </blockquote>`;

  const renderChapterMeta = (ch) => {
    const areas = (ch.creativity_areas || []).map((a) =>
      `<span class="tao-chip tao-chip-area">${escapeHtml(a.title || a.slug)}</span>`
    ).join(' ');
    const discs = (ch.field_discussions || []).map((d) =>
      `<span class="tao-chip tao-chip-discussion" title="${escapeHtml(d.teach_as || '')}">${escapeHtml(d.label || d.id)}</span>`
    ).join(' ');
    if (!areas && !discs) return '';
    return `
      <div class="tao-chapter-meta">
        ${areas ? `<p class="tao-meta-row"><span class="tao-meta-label">Creativity areas</span> ${areas}</p>` : ''}
        ${discs ? `<p class="tao-meta-row"><span class="tao-meta-label">Field discussions</span> ${discs}</p>` : ''}
      </div>`;
  };

  const renderDiscussionsIndex = (discussions) => {
    if (!discussions?.length) return '';
    const items = discussions.map((d) => `
      <li id="discussion-${escapeHtml(d.id)}">
        <strong>${escapeHtml(d.label)}</strong>
        <span class="tao-disc-id">${escapeHtml(d.id)}</span>
        <br><em>${escapeHtml(d.teach_as || '')}</em>
        <br><span class="tao-disc-units">Units: ${(d.unit_home || []).map(escapeHtml).join(' · ')}</span>
      </li>`).join('');
    return `
      <section id="field-discussions" class="tao-section tao-nota">
        <h2>Field discussions</h2>
        <p>Tensions held open in the creativity-techniques field map — related to chapters and thesaurus concepts below.</p>
        <ul class="tao-discussion-list">${items}</ul>
      </section>`;
  };

  const renderAreasIndex = (areas) => {
    if (!areas?.length) return '';
    const items = areas.map((a) =>
      `<li><strong>${escapeHtml(a.title)}</strong> <span class="tao-disc-id">${escapeHtml(a.slug)}</span> · ${escapeHtml(String(a.concept_count))} concepts</li>`
    ).join('');
    return `
      <section id="creativity-areas" class="tao-section tao-nota">
        <h2>Creativity areas (thesaurus)</h2>
        <ul class="tao-discussion-list">${items}</ul>
      </section>`;
  };

  const render = (data) => {
    const lexPath = data.thesaurus?.lexicum_path || '/lexicum/en/';
    const resolvedLex = withBase(lexPath);

    const nav = (data.chapters || []).map((ch) =>
      `<li><a href="#${escapeHtml(ch.id)}">${escapeHtml(ch.number)}. ${escapeHtml(ch.title)}</a></li>`
    ).join('');

    const intro = (data.intro || []).map((line) => escapeHtml(line)).join('<br>\n    ');

    const sections = (data.chapters || []).map((ch) => `
      <section id="${escapeHtml(ch.id)}" class="tao-section">
        <h2>${escapeHtml(ch.number)}. ${escapeHtml(ch.title)}</h2>
        ${renderChapterMeta(ch)}
        ${(ch.quotes || []).map((q) => renderQuote(q, resolvedLex)).join('\n')}
      </section>`).join('\n');

    root.innerHTML = `
<header class="tao-header">
  <h1>${escapeHtml(data.title || 'The Tao of Creativity')}</h1>
  <p class="tao-subtitle"><em>${escapeHtml(data.subtitle || '')}</em></p>
  <p class="tao-intro">${intro}</p>
</header>
<nav class="tao-nav" aria-label="Tao chapters"><ul>${nav}
  <li><a href="#creativity-areas">Areas</a></li>
  <li><a href="#field-discussions">Discussions</a></li>
</ul></nav>
${sections}
${renderAreasIndex(data.creativity_areas)}
${renderDiscussionsIndex(data.field_discussions)}
<section id="nota-generativa" class="tao-section tao-nota">
  <h2>Note on how this text is forged</h2>
  <p>This page is hydrated from <code>quotes.json</code>. Each invent carries DH metadata (<code>semantic_tags</code>: CIDOC-CRM, Getty AAT, Dublin Core, SKOS) and links into the course creativity thesaurus (<code>ct:…</code>). Field discussion ids name tensions held open in the field map. Invents are studio aphorisms — never fake scholarship.</p>
</section>
<footer class="tao-footer">
  <p><strong>About this text</strong></p>
  <p>The Tao of Creativity is a living pedagogical collection for Creativity Techniques. Data: <a href="${escapeHtml(url)}">quotes.json</a> · Thesaurus: <a href="${escapeHtml(resolvedLex)}">Lexicum</a>.</p>
  <p><strong>Authorship:</strong> Rubén Vega Balbás, PhD — <a href="mailto:ruvebal@crea-comm.net">ruvebal@crea-comm.net</a></p>
</footer>`;
  };

  fetch(`${url}?v=${Date.now()}`)
    .then((r) => {
      if (!r.ok) throw new Error(`quotes.json HTTP ${r.status}`);
      return r.json();
    })
    .then(render)
    .catch((err) => {
      if (loading) loading.textContent = `Could not load Tao data: ${err.message}`;
      else root.textContent = String(err);
    });
})();
