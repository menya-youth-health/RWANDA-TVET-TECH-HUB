import { Link, useParams } from 'react-router-dom';
import { DEPARTMENTS, DEPARTMENTS_BY_ID } from '../data/departments';
import NotFound from './NotFound';

export default function DepartmentDetail() {
  const { deptId } = useParams();
  const d = deptId ? DEPARTMENTS_BY_ID[deptId] : undefined;
  if (!d) return <NotFound />;

  const index = DEPARTMENTS.findIndex((x) => x.id === d.id);
  const prev = DEPARTMENTS[index - 1];
  const next = DEPARTMENTS[index + 1];

  return (
    <section className="section">
      <div className="container narrow">
        <p className="crumbs">
          <Link to="/departments">Departments</Link> / {d.name}
        </p>
        <h1>{d.name}</h1>
        <span className={'badge ' + (d.live ? 'badge-ok' : 'badge-soon')}>
          {d.live ? 'Available now' : 'Coming soon'}
        </span>
        <p className="lead-dark">{d.overview}</p>

        <div className="notice notice-warn">
          This is a draft outline. It does not follow the official RTB module list and has not been
          checked by a teacher.
        </div>

        {d.courseId && (
          <div className="card card-live">
            <h3>Start learning</h3>
            <p>
              The course for this department is open to everyone.
              {d.id === 'computer-systems' && ' You can also practise in the virtual lab.'}
            </p>
            <div className="actions">
              <Link className="btn btn-primary" to={`/course/${d.courseId}`}>
                Open the course
              </Link>
              {d.id === 'computer-systems' && (
                <Link className="btn btn-outline" to="/lab">
                  Open the virtual lab
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="dept-cols">
          <div className="card">
            <h3>What students learn</h3>
            <ul className="plain-list">
              {d.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3>Skills students practise</h3>
            <ul className="plain-list">
              {d.skills.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <h3>Planned modules (draft)</h3>
          <ol className="plain-list">
            {d.outline.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </div>

        <div className="card">
          <h3>Typical tools and equipment</h3>
          <div className="chips">
            {d.tools.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="callout">
          <strong>Safety</strong>
          <p>{d.safety}</p>
        </div>

        <div className="card">
          <h3>Where this can lead</h3>
          <ul className="plain-list">
            {d.after.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="small muted">
            These are examples to start a conversation. They are not a promise of a job or a
            qualification.
          </p>
        </div>

        <div className="pager">
          {prev ? <Link to={`/departments/${prev.id}`}>&larr; {prev.name}</Link> : <span />}
          {next ? <Link to={`/departments/${next.id}`}>{next.name} &rarr;</Link> : <span />}
        </div>
      </div>
    </section>
  );
}
