import { describe, expect, it } from 'vitest';
import { ACTIONS_BY_ID, SCENARIOS } from '../data/scenarios';
import { newState, performAction, scoreAttempt, type LabState } from './engine';

const run = (scenarioIndex: number, ids: string[]): LabState => {
  const s = SCENARIOS[scenarioIndex];
  return ids.reduce((st, id) => performAction(s, st, id), newState());
};

describe('scenario data', () => {
  it('has at least six scenarios with unique ids', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(6);
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
  });

  it('only refers to actions that exist', () => {
    for (const s of SCENARIOS) {
      const used = [...Object.keys(s.responses), ...s.fixActions, ...s.idealPath];
      for (const id of used) {
        expect(ACTIONS_BY_ID[id], `${s.id}: unknown action ${id}`).toBeDefined();
      }
    }
  });

  it('has a valid correct option and at least one fix', () => {
    for (const s of SCENARIOS) {
      expect(s.correctOption).toBeGreaterThanOrEqual(0);
      expect(s.correctOption).toBeLessThan(s.diagnosisOptions.length);
      expect(s.fixActions.length).toBeGreaterThan(0);
    }
  });
});

describe('safety rules', () => {
  it('flags opening the case with power connected', () => {
    const st = run(1, ['open_case']);
    expect(st.unsafe).toBe(true);
    expect(st.caseOpen).toBe(true);
  });

  it('does not flag opening the case after unplugging', () => {
    const st = run(1, ['unplug', 'open_case']);
    expect(st.unsafe).toBe(false);
    expect(st.plugged).toBe(false);
  });

  it('blocks reaching inside with the case closed, without counting a step', () => {
    const st = run(1, ['inspect_ram']);
    expect(st.steps).toBe(0);
    expect(st.log[0].kind).toBe('blocked');
  });

  it('blocks power-on test while unplugged', () => {
    const st = run(1, ['unplug', 'power_on_test']);
    expect(st.log[st.log.length - 1].kind).toBe('blocked');
  });
});

describe('fixing and replacing', () => {
  it('a fix action repairs the fault and the test then works', () => {
    const st = run(0, ['reseat_power_cable', 'power_on_test']);
    expect(st.fixed).toBe(true);
    expect(st.log[st.log.length - 1].text).toContain('Fixed');
  });

  it('counts unnecessary replacements', () => {
    const st = run(1, ['unplug', 'open_case', 'replace_psu', 'replace_drive']);
    expect(st.unnecessaryReplacements).toBe(2);
    expect(st.fixed).toBe(false);
  });

  it('blocks software tools until fixed when the screen is dead', () => {
    const st = run(1, ['open_bios']);
    expect(st.steps).toBe(0);
    expect(st.log[0].kind).toBe('blocked');
  });

  it('does not treat the correct replacement as unnecessary', () => {
    const st = run(4, ['unplug', 'open_case', 'replace_ram']);
    expect(st.fixed).toBe(true);
    expect(st.unnecessaryReplacements).toBe(0);
  });
});

describe('scoring', () => {
  it('gives 100 for the ideal path in every scenario', () => {
    SCENARIOS.forEach((s, i) => {
      const st = run(i, s.idealPath);
      expect(st.fixed, `${s.id} fixed`).toBe(true);
      expect(st.unsafe, `${s.id} safe`).toBe(false);
      expect(st.steps, `${s.id} steps`).toBe(s.idealPath.length);
      const r = scoreAttempt(s, st, s.correctOption);
      expect(r.total, `${s.id} score`).toBe(100);
    });
  });

  it('gives no diagnosis points for a wrong answer', () => {
    const s = SCENARIOS[0];
    const st = run(0, s.idealPath);
    const r = scoreAttempt(s, st, s.correctOption === 0 ? 1 : 0);
    expect(r.correct).toBe(false);
    expect(r.total).toBe(50);
  });

  it('subtracts points for unnecessary replacements and never goes below 0', () => {
    const s = SCENARIOS[1];
    const st = run(1, ['unplug', 'open_case', 'replace_psu', 'replace_drive']);
    const r = scoreAttempt(s, st, 2);
    expect(r.penalty).toBe(10);
    expect(r.total).toBeGreaterThanOrEqual(0);
  });
});
