import { describe, expect, it } from 'vitest';
import { DEPARTMENTS } from './departments';
import { GLOSSARY } from './glossary';

describe('department data', () => {
  it('has unique ids and every field filled in', () => {
    const ids = DEPARTMENTS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of DEPARTMENTS) {
      for (const list of [d.topics, d.skills, d.tools, d.outline, d.after]) {
        expect(list.length).toBeGreaterThan(0);
      }
      expect(d.overview.length).toBeGreaterThan(20);
      expect(d.safety.length).toBeGreaterThan(10);
    }
  });
  it('marks a department live only when it has a course', () => {
    for (const d of DEPARTMENTS) expect(Boolean(d.courseId)).toBe(d.live);
    expect(DEPARTMENTS.filter((d) => d.live).length).toBe(3);
  });
});

describe('glossary data', () => {
  it('has unique terms with meanings', () => {
    const terms = GLOSSARY.map((t) => t.term);
    expect(new Set(terms).size).toBe(terms.length);
    for (const t of GLOSSARY) expect(t.meaning.length).toBeGreaterThan(15);
  });
});
