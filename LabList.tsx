import { Link } from 'react-router-dom';
import { SCENARIOS } from '../data/scenarios';
import type { Attempt } from '../lab/engine';
import { useStored } from '../storage';

export default function LabList() {
  const [attempts] = useStored<Attempt[]>('labAttempts', []);

  return (
    <section className="section">
      <div className="container">
        <h1>Virtual lab: PC Troubleshooting Simulator</h1>
        <div className="notice notice-warn">
          <strong>Simulation.</strong> Practise on real hardware under teacher supervision. This lab
          prepares you for real equipment but does not replace it.
        </div>
        <p className="muted">
          Each scenario hides one fault. Inspect the computer, choose your actions, then submit your
          diagnosis. Start with the easy ones.
        </p>

        <div className="grid">
          {SCENARIOS.map((s, i) => {
            const mine = attempts.filter((a) => a.scenarioId === s.id);
            const best = mine.length ? Math.max(...mine.map((a) => a.score)) : null;
            return (
              <article key={s.id} className="card">
                <span className={'badge badge-' + s.difficulty.toLowerCase()}>{s.difficulty}</span>
                <h3>
                  {i + 1}. {s.title}
                </h3>
                <p>{s.story}</p>
                <p className="small muted">
                  {mine.length === 0
                    ? 'Not attempted yet'
                    : `${mine.length} attempt${mine.length === 1 ? '' : 's'} · best score ${best}/100`}
                </p>
                <Link className="btn btn-primary" to={`/lab/${s.id}`}>
                  {mine.length === 0 ? 'Start' : 'Try again'}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
