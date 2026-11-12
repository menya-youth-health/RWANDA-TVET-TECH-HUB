import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ACTIONS,
  ACTIONS_BY_ID,
  GROUP_ORDER,
  SCENARIOS,
  type Scenario,
} from '../data/scenarios';
import {
  newState,
  performAction,
  scoreAttempt,
  type Attempt,
  type LabState,
  type ScoreResult,
} from '../lab/engine';
import { useStored } from '../storage';
import NotFound from './NotFound';

export default function LabPlay() {
  const { scenarioId } = useParams();
  const [run, setRun] = useState(0);
  const index = SCENARIOS.findIndex((s) => s.id === scenarioId);
  if (index < 0) return <NotFound />;
  const scenario = SCENARIOS[index];
  const next = index < SCENARIOS.length - 1 ? SCENARIOS[index + 1] : null;
  // The key resets the whole play screen when the scenario or the run changes.
  return (
    <Play
      key={scenario.id + ':' + run}
      scenario={scenario}
      number={index + 1}
      next={next}
      onRetry={() => setRun((r) => r + 1)}
    />
  );
}

interface PlayProps {
  scenario: Scenario;
  number: number;
  next: Scenario | null;
  onRetry: () => void;
}

function Play({ scenario, number, next, onRetry }: PlayProps) {
  const [st, setSt] = useState<LabState>(newState);
  const [choice, setChoice] = useState<number | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [, setAttempts] = useStored<Attempt[]>('labAttempts', []);

  const act = (id: string) => {
    if (result) return;
    setSt((prev) => performAction(scenario, prev, id));
  };

  const submit = () => {
    if (choice === null || result) return;
    const r = scoreAttempt(scenario, st, choice);
    setResult(r);
    setAttempts((prev) =>
      [
        ...prev,
        {
          scenarioId: scenario.id,
          title: scenario.title,
          date: new Date().toISOString(),
          correct: r.correct,
          score: r.total,
          steps: st.steps,
          safe: !st.unsafe,
          unnecessary: st.unnecessaryReplacements,
        },
      ].slice(-100),
    );
    window.scrollTo(0, 0);
  };

  return (
    <section className="section">
      <div className="container">
        <p className="crumbs">
          <Link to="/lab">Virtual lab</Link> / Scenario {number}
        </p>
        <h1>{scenario.title}</h1>
        <div className="notice notice-warn">
          <strong>Simulation.</strong> Practise on real hardware under teacher supervision.
        </div>

        {result && (
          <Result scenario={scenario} result={result} choice={choice!} next={next} onRetry={onRetry} />
        )}

        <div className="lab-layout">
          <div className="lab-main">
            <div className="card">
              <h2>The situation</h2>
              <p>{scenario.story}</p>
              <ul className="plain-list">
                {scenario.symptoms.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <div className="chips" aria-label="Computer state">
                <span className={'chip ' + (st.plugged ? 'chip-warn' : 'chip-ok')}>
                  Power cable: {st.plugged ? 'plugged in' : 'unplugged'}
                </span>
                <span className="chip">Case: {st.caseOpen ? 'open' : 'closed'}</span>
                <span className="chip">Steps: {st.steps}</span>
              </div>
            </div>

            {GROUP_ORDER.map((group) => {
              const items = ACTIONS.filter((a) => a.group === group);
              return (
                <div key={group} className="card">
                  <h3>{group}</h3>
                  <div className="action-list">
                    {items.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        className="action-btn"
                        onClick={() => act(a.id)}
                        disabled={result !== null}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="lab-side">
            <div className="card">
              <h2>What you have done</h2>
              {st.log.length === 0 ? (
                <p className="muted">Nothing yet. Choose an action to start.</p>
              ) : (
                <ol className="log" aria-live="polite">
                  {[...st.log]
                    .map((e, i) => ({ e, n: i + 1 }))
                    .reverse()
                    .map(({ e, n }) => (
                      <li key={n} className={'log-' + e.kind}>
                        <strong>
                          {n}. {e.label}
                        </strong>
                        <span>{e.text}</span>
                      </li>
                    ))}
                </ol>
              )}
            </div>

            {!result && (
              <div className="card">
                <h2>Submit your diagnosis</h2>
                <p className="muted">What is the cause of the fault?</p>
                <fieldset className="diagnosis">
                  <legend className="sr-only">Choose the cause</legend>
                  {scenario.diagnosisOptions.map((o, oi) => (
                    <label key={o} className="option">
                      <input
                        type="radio"
                        name="diagnosis"
                        checked={choice === oi}
                        onChange={() => setChoice(oi)}
                      />
                      <span>{o}</span>
                    </label>
                  ))}
                </fieldset>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submit}
                  disabled={choice === null}
                >
                  Submit diagnosis
                </button>
                <p className="small muted">
                  Tip: the best technicians check cheap and simple things first, and fix the real
                  cause before replacing parts.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

interface ResultProps {
  scenario: Scenario;
  result: ScoreResult;
  choice: number;
  next: Scenario | null;
  onRetry: () => void;
}

function Result({ scenario, result, choice, next, onRetry }: ResultProps) {
  return (
    <div className={'notice ' + (result.correct ? 'notice-ok' : 'notice-bad')} role="status">
      <h2>
        {result.correct ? 'Correct diagnosis.' : 'Not the right diagnosis.'} Score: {result.total}/100
      </h2>
      <p>
        You chose: <strong>{scenario.diagnosisOptions[choice]}</strong>.
        {!result.correct && (
          <>
            {' '}
            The cause was: <strong>{scenario.diagnosisOptions[scenario.correctOption]}</strong>.
          </>
        )}
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Part</th>
              <th>Points</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {result.parts.map((p) => (
              <tr key={p.label}>
                <td>{p.label}</td>
                <td>
                  {p.points}/{p.max}
                </td>
                <td>{p.note}</td>
              </tr>
            ))}
            <tr>
              <td>Unnecessary parts</td>
              <td>-{result.penalty}</td>
              <td>{result.penaltyNote}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3>Why this was the fault</h3>
      <p>{scenario.explanation}</p>
      <h3>A good path through this scenario</h3>
      <ol>
        {scenario.idealPath.map((id) => (
          <li key={id}>{ACTIONS_BY_ID[id].label}</li>
        ))}
      </ol>
      <div className="actions">
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try this scenario again
        </button>
        {next ? (
          <Link className="btn btn-outline" to={`/lab/${next.id}`}>
            Next scenario
          </Link>
        ) : (
          <Link className="btn btn-outline" to="/progress">
            See my progress
          </Link>
        )}
      </div>
    </div>
  );
}
