import { useMemo, useState } from 'react';
import { GLOSSARY } from '../data/glossary';

export default function Glossary() {
  const [q, setQ] = useState('');
  const [area, setArea] = useState('All');

  const areas = useMemo(() => ['All', ...Array.from(new Set(GLOSSARY.map((t) => t.area))).sort()], []);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GLOSSARY.filter(
      (t) =>
        (area === 'All' || t.area === area) &&
        (!needle || t.term.toLowerCase().includes(needle) || t.meaning.toLowerCase().includes(needle)),
    ).sort((a, b) => {
      // Terms that start with the search text come first, then the rest A to Z.
      const rank = (t: string) => (needle && t.toLowerCase().startsWith(needle) ? 0 : 1);
      return rank(a.term) - rank(b.term) || a.term.localeCompare(b.term);
    });
  }, [q, area]);

  return (
    <section className="section">
      <div className="container narrow">
        <h1>Glossary</h1>
        <p className="muted">
          Short explanations of common technical words. Sample content: a teacher should check the
          wording before classroom use.
        </p>

        <div className="glossary-tools">
          <label className="sr-only" htmlFor="gloss-q">
            Search the glossary
          </label>
          <input
            id="gloss-q"
            type="search"
            placeholder="Search a word, for example RAM"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="sr-only" htmlFor="gloss-area">
            Subject area
          </label>
          <select id="gloss-area" value={area} onChange={(e) => setArea(e.target.value)}>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a === 'All' ? 'All subject areas' : a}
              </option>
            ))}
          </select>
        </div>

        <p className="small muted" role="status">
          Showing {shown.length} of {GLOSSARY.length} terms
        </p>

        {shown.length === 0 ? (
          <div className="notice notice-warn">No term matches your search. Try a shorter word.</div>
        ) : (
          <dl className="glossary">
            {shown.map((t) => (
              <div key={t.term} className="gloss-item">
                <dt>
                  {t.term} <span className="badge badge-soon">{t.area}</span>
                </dt>
                <dd>{t.meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
