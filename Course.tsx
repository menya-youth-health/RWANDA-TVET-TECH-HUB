import { Link, useParams } from 'react-router-dom';
import { COURSES_BY_ID, lessonsOf } from '../data/courses';
import { useStored } from '../storage';
import NotFound from './NotFound';

export default function Course() {
  const { courseId } = useParams();
  const [done] = useStored<string[]>('completedLessons', []);
  const course = courseId ? COURSES_BY_ID[courseId] : undefined;
  if (!course) return <NotFound />;

  const all = lessonsOf(course);
  const total = all.length;
  const count = all.filter((l) => done.includes(l.id)).length;
  const percent = Math.round((count / total) * 100);

  return (
    <section className="section">
      <div className="container narrow">
        <p className="crumbs">
          <Link to="/course">Courses</Link> / {course.title}
        </p>
        <h1>{course.title}</h1>
        <p className="muted">{course.summary}</p>
        <div className="notice notice-warn">
          Module titles and lessons are placeholders. They do not yet follow the official RTB module
          list, and a teacher must check them before classroom use.
        </div>

        <div className="progress-block">
          <div className="progress-label">
            <span>Your progress</span>
            <strong>
              {count} of {total} lessons
            </strong>
          </div>
          <div className="bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
            <span style={{ width: percent + '%' }} />
          </div>
        </div>

        {course.modules.map((m) => (
          <div key={m.id} className="module">
            <h2>
              {m.title} {m.placeholder && <span className="badge badge-warn">Placeholder</span>}
            </h2>
            <ol className="lesson-list">
              {m.lessons.map((l) => (
                <li key={l.id}>
                  <Link to={`/course/${course.id}/lesson/${l.id}`}>
                    <span className="lesson-title">{l.title}</span>
                    <span className="lesson-meta">
                      {l.minutes} min ·{' '}
                      {done.includes(l.id) ? (
                        <span className="done">Completed</span>
                      ) : (
                        'Not started'
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <div className="card">
          <h3>Check yourself</h3>
          <p>
            {course.quiz.length} questions on this course. The quiz marks itself and explains each
            answer.
          </p>
          <Link className="btn btn-primary" to={`/course/${course.id}/quiz`}>
            Take the quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
