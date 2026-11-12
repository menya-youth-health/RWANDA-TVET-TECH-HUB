import { Link } from 'react-router-dom';
import { DEPARTMENTS } from '../data/departments';

export default function Departments() {
  return (
    <section className="section">
      <div className="container">
        <h1>Technical departments</h1>
        <p className="muted">
          Open to every student. Three departments already have a course, and the others are added
          one at a time, in the order teachers ask for them.
        </p>
        <div className="grid">
          {DEPARTMENTS.map((d) => (
            <article key={d.id} className={'card' + (d.live ? ' card-live' : '')}>
              <span className={'badge ' + (d.live ? 'badge-ok' : 'badge-soon')}>
                {d.live ? 'Available now' : 'Coming soon'}
              </span>
              <h3>{d.name}</h3>
              <p>{d.summary}</p>
              <p className="card-links">
                <Link to={`/departments/${d.id}`}>View department</Link>
                {d.courseId && <Link to={`/course/${d.courseId}`}>Open the course</Link>}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
