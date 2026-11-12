import { Link } from 'react-router-dom';
import { COURSES, lessonsOf, type Course } from '../data/courses';
import { SCENARIOS } from '../data/scenarios';
import type { Attempt } from '../lab/engine';
import { clearAll, useStored } from '../storage';

function CourseProgress({ course }: { course: Course }) {
  const [done] = useStored<string[]>('completedLessons', []);
  const [quiz] = useStored<{ score: number; total: number } | null>(`quizBest.${course.id}`, null);
  const lessons = lessonsOf(course);
  const count = lessons.filter((l) => done.includes(l.id)).length;
  return (
    <article className="card">
      <h3>{course.title}</h3>
      <p className="big">
        {count} / {lessons.length} <span className="small muted">lessons</span>
      </p>
      <p className="small muted">
        Quiz best score: {quiz ? `${quiz.score} / ${quiz.total}` : `not taken (${course.quiz.length} questions)`}
      </p>
      <p className="card-links">
        <Link to={`/course/${course.id}`}>Open the course</Link>
        <Link to={`/course/${course.id}/quiz`}>Take the quiz</Link>
      </p>
    </article>
  );
}

export default function Progress() {
  const [attempts] = useStored<Attempt[]>('labAttempts', []);

  const reset = () => {
    if (window.confirm('Delete all your progress saved in this browser? This cannot be undone.')) {
      clearAll();
      window.location.reload();
    }
  };

  const scenariosTried = new Set(attempts.map((a) => a.scenarioId)).size;
  const recent = [...attempts].reverse().slice(0, 20);

  return (
    <section className="section">
      <div className="container narrow">
        <h1>My progress</h1>
        <p className="muted">
          Saved only in this browser on this device. Clearing the browser data removes it. In the
          full platform, teachers will be able to see their class's progress.
        </p>

        <div className="grid">
          {COURSES.map((c) => (
            <CourseProgress key={c.id} course={c} />
          ))}
          <article className="card">
            <h3>Virtual lab</h3>
            <p className="big">
              {scenariosTried} / {SCENARIOS.length} <span className="small muted">scenarios tried</span>
            </p>
            <p className="card-links">
              <Link to="/lab">Open the lab</Link>
            </p>
          </article>
        </div>

        <h2>Recent lab attempts</h2>
        {recent.length === 0 ? (
          <p className="muted">No attempts yet. Try a scenario in the virtual lab.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Diagnosis</th>
                  <th>Score</th>
                  <th>Steps</th>
                  <th>Safety</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a, i) => (
                  <tr key={a.date + i}>
                    <td>{a.title}</td>
                    <td>{a.correct ? 'Correct' : 'Not correct'}</td>
                    <td>{a.score}/100</td>
                    <td>{a.steps}</td>
                    <td>{a.safe ? 'Safe' : 'Unsafe action'}</td>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p>
          <button type="button" className="btn btn-outline" onClick={reset}>
            Delete my saved progress
          </button>
        </p>
      </div>
    </section>
  );
}
