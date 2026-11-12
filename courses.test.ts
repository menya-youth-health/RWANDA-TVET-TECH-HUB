import { describe, expect, it } from 'vitest';
import { COURSES, lessonsOf } from './courses';
import { DEPARTMENTS } from './departments';
import { GLOSSARY } from './glossary';

describe('course data', () => {
  it('has unique course ids and unique lesson ids across all courses', () => {
    const ids = COURSES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    const lessonIds = COURSES.flatMap((c) => lessonsOf(c).map((l) => l.id));
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
  });
  it('gives every course lessons with objectives and content', () => {
    for (const c of COURSES) {
      expect(lessonsOf(c).length).toBeGreaterThanOrEqual(4);
      for (const l of lessonsOf(c)) {
        expect(l.objectives.length).toBeGreaterThan(0);
        expect(l.blocks.length).toBeGreaterThan(1);
      }
    }
  });
  it('has valid quiz questions', () => {
    for (const c of COURSES) {
      expect(c.quiz.length).toBeGreaterThanOrEqual(8);
      const qids = c.quiz.map((q) => q.id);
      expect(new Set(qids).size).toBe(qids.length);
      for (const q of c.quiz) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(Number.isInteger(q.correct)).toBe(true);
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(q.options.length);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.explanation.length).toBeGreaterThan(10);
      }
    }
  });
  it('links every live department to an existing course in that department', () => {
    for (const d of DEPARTMENTS.filter((x) => x.live)) {
      const c = COURSES.find((x) => x.id === d.courseId);
      expect(c).toBeDefined();
      expect(c?.departmentId).toBe(d.id);
    }
    for (const c of COURSES) expect(DEPARTMENTS.some((d) => d.id === c.departmentId)).toBe(true);
  });
  it('has glossary terms for software development and networking', () => {
    const areas = new Set(GLOSSARY.map((t) => t.area));
    expect(areas.has('Software development')).toBe(true);
    expect(areas.has('Networking')).toBe(true);
  });
});
