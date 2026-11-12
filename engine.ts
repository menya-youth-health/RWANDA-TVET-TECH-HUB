// The simulator engine: pure functions with no React code in them, so they are
// easy to test. The scenario decides what each action shows; the engine only
// tracks the state (power, case, whether the fault is fixed) and the score.

import {
  ACTIONS_BY_ID,
  DEFAULT_RESPONSES,
  type Scenario,
} from '../data/scenarios';

export type LogKind = 'info' | 'safe' | 'warning' | 'fix' | 'blocked';

export interface LogEntry {
  actionId: string;
  label: string;
  text: string;
  kind: LogKind;
}

export interface LabState {
  plugged: boolean;
  caseOpen: boolean;
  fixed: boolean;
  /** Number of real actions taken (blocked or repeated no-op actions do not count). */
  steps: number;
  /** True if the student opened the case or worked inside it with power connected. */
  unsafe: boolean;
  unnecessaryReplacements: number;
  log: LogEntry[];
}

export function newState(): LabState {
  return {
    plugged: true,
    caseOpen: false,
    fixed: false,
    steps: 0,
    unsafe: false,
    unnecessaryReplacements: 0,
    log: [],
  };
}

export function performAction(scenario: Scenario, st: LabState, actionId: string): LabState {
  const action = ACTIONS_BY_ID[actionId];
  if (!action) return st;

  const add = (
    text: string,
    kind: LogKind,
    counted: boolean,
    patch: Partial<LabState> = {},
  ): LabState => ({
    ...st,
    ...patch,
    steps: st.steps + (counted ? 1 : 0),
    log: [...st.log, { actionId, label: action.label, text, kind }],
  });

  switch (actionId) {
    case 'unplug':
      if (!st.plugged) return add('The power cable is already unplugged.', 'info', false);
      return add(
        'You unplugged the power cable from the wall socket. Good safety habit.',
        'safe',
        true,
        { plugged: false },
      );

    case 'plug':
      if (st.plugged) return add('The power cable is already plugged in.', 'info', false);
      return add('You plugged the power cable back in.', 'info', true, { plugged: true });

    case 'open_case':
      if (st.caseOpen) return add('The case is already open.', 'info', false);
      if (st.plugged) {
        return add(
          'Unsafe: you opened the case with the power cable still plugged in. In real life this can hurt you or damage parts. Always shut down and unplug first.',
          'warning',
          true,
          { caseOpen: true, unsafe: true },
        );
      }
      return add('You opened the case. The parts are now visible.', 'safe', true, {
        caseOpen: true,
      });

    case 'power_on_test':
      if (!st.plugged) {
        return add('The power cable is unplugged. Plug it in first.', 'blocked', false);
      }
      return st.fixed
        ? add(scenario.workingResult, 'fix', true)
        : add(scenario.faultResult, 'info', true);

    default:
      break;
  }

  if (action.software && scenario.blockSoftwareUntilFixed && !st.fixed) {
    return add(scenario.blockSoftwareUntilFixed, 'blocked', false);
  }
  if (action.needsCase && !st.caseOpen) {
    return add(
      'You cannot reach that with the case closed. Shut down and unplug the power first, then open the case.',
      'blocked',
      false,
    );
  }

  const patch: Partial<LabState> = {};
  let prefix = '';
  if (action.needsCase && st.plugged) {
    patch.unsafe = true;
    prefix = 'Unsafe: the power cable is still plugged in. ';
  }

  if (scenario.fixActions.includes(actionId)) {
    patch.fixed = true;
    if (actionId === 'reseat_power_cable') patch.plugged = true;
    return add(
      prefix + (scenario.responses[actionId] ?? 'You made the repair.'),
      'fix',
      true,
      patch,
    );
  }

  if (action.replacement) {
    patch.unnecessaryReplacements = st.unnecessaryReplacements + 1;
    return add(
      prefix +
        (scenario.responses[actionId] ??
          'You replaced the part. It was not the cause, so the problem is still there. That was an unnecessary cost.'),
      'warning',
      true,
      patch,
    );
  }

  const text =
    scenario.responses[actionId] ??
    DEFAULT_RESPONSES[actionId] ??
    (action.group === 'Fix or replace'
      ? 'You tried it. Nothing changed.'
      : 'You checked this. Nothing unusual found.');
  return add(prefix + text, 'info', true, patch);
}

export interface ScorePart {
  label: string;
  points: number;
  max: number;
  note: string;
}

export interface ScoreResult {
  correct: boolean;
  total: number;
  parts: ScorePart[];
  penalty: number;
  penaltyNote: string;
}

/** Score 0 to 100: diagnosis 50, repair 20, safety 15, efficiency 15, minus 5 per unnecessary replacement. */
export function scoreAttempt(
  scenario: Scenario,
  st: LabState,
  chosenOption: number,
): ScoreResult {
  const correct = chosenOption === scenario.correctOption;
  const target = scenario.idealPath.length;
  const extraSteps = Math.max(0, st.steps - target);
  const efficiency = Math.max(0, 15 - extraSteps);
  const penalty = st.unnecessaryReplacements * 5;

  const parts: ScorePart[] = [
    {
      label: 'Diagnosis',
      points: correct ? 50 : 0,
      max: 50,
      note: correct ? 'You found the cause.' : 'This was not the cause.',
    },
    {
      label: 'Repair',
      points: st.fixed ? 20 : 0,
      max: 20,
      note: st.fixed ? 'You fixed the fault.' : 'The fault was not fixed.',
    },
    {
      label: 'Safety',
      points: st.unsafe ? 0 : 15,
      max: 15,
      note: st.unsafe
        ? 'You worked with the power still connected.'
        : 'No unsafe actions.',
    },
    {
      label: 'Efficiency',
      points: efficiency,
      max: 15,
      note: `${st.steps} steps taken. A good path takes about ${target}.`,
    },
  ];

  const sum = parts.reduce((n, p) => n + p.points, 0);
  return {
    correct,
    total: Math.max(0, Math.min(100, sum - penalty)),
    parts,
    penalty,
    penaltyNote:
      st.unnecessaryReplacements > 0
        ? `${st.unnecessaryReplacements} unnecessary part replacement(s), 5 points each`
        : 'No unnecessary replacements.',
  };
}

export interface Attempt {
  scenarioId: string;
  title: string;
  date: string;
  correct: boolean;
  score: number;
  steps: number;
  safe: boolean;
  unnecessary: number;
}
