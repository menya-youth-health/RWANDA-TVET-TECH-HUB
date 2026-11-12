import { Link, useParams } from 'react-router-dom';
import { type Block } from '../data/course';
import { COURSES_BY_ID, lessonsOf } from '../data/courses';
import { useStored } from '../storage';
import NotFound from './NotFound';

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case 'p':
      return <p key={i}>{b.text}</p>;
    case 'h':
      return <h3 key={i}>{b.text}</h3>;
    case 'ul':
      return (
        <ul key={i}>
          {b.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol key={i}>
          {b.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      );
    case 'code':
      return (
        <pre key={i} className="code" tabIndex={0}>
          <code>{b.text}</code>
        </pre>
      );
  }
}

export default function Lesson() {
  const { courseId, lessonId } = useParams();
  const course = courseId ? COURSES_BY_ID[courseId] : undefined;
  const [done, setDone] = useStored<string[]>('completedLessons', []);
  const lessons = course ? lessonsOf(course) : [];
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (!course || index < 0) return <NotFound />;

  const lesson = lessons[index];
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;
  const isDone = done.includes(lesson.id);

  const toggle = () =>
    setDone((d) => (d.includes(lesson.id) ? d.filter((x) => x !== lesson.id) : [...d, lesson.id]));

  return (
    <section className="section">
      <div className="container narrow">
        <p className="crumbs">
          <Link to="/course">Courses</Link> / <Link to={`/course/${course.id}`}>{course.title}</Link> / Lesson {index + 1} of {lessons.length}
        </p>
        <h1>{lesson.title}</h1>
        <p className="muted">About {lesson.minutes} minutes · Sample content</p>

        <div className="callout">
          <strong>By the end of this lesson you can</strong>
          <ul>
            {lesson.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>

        <article className="prose">{lesson.blocks.map(renderBlock)}</article>

        <div className="lesson-actions">
          <button type="button" className={'btn ' + (isDone ? 'btn-outline' : 'btn-primary')} onClick={toggle} aria-pressed={isDone}>
            {isDone ? 'Completed: click to undo' : 'Mark as complete'}
          </button>
        </div>

        <nav className="pager" aria-label="Lessons">
          {prev ? <Link to={`/course/${course.id}/lesson/${prev.id}`}>Previous: {prev.title}</Link> : <span />}
          {next ? (
            <Link to={`/course/${course.id}/lesson/${next.id}`}>Next: {next.title}</Link>
          ) : (
            <Link to={`/course/${course.id}/quiz`}>Next: take the quiz</Link>
          )}
        </nav>
      </div>
    </section>
  );
}
