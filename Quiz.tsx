import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { COURSES_BY_ID } from '../data/courses';
import NotFound from './NotFound';
import { useStored } from '../storage';

interface Best {
  score: number;
  total: number;
}

export default function Quiz() {
  const { courseId } = useParams();
  const course = courseId ? COURSES_BY_ID[courseId] : undefined;
  if (!course) return <NotFound />;
  return <QuizBody key={course.id} courseId={course.id} title={course.title} />;
}

function QuizBody({ courseId, title }: { courseId: string; title: string }) {
  const QUIZ = COURSES_BY_ID[courseId].quiz;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [best, setBest] = useStored<Best | null>(`quizBest.${courseId}`, null);

  const score = QUIZ.filter((q) => answers[q.id] === q.correct).length;
  const unanswered = QUIZ.filter((q) => answers[q.id] === undefined).length;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (unanswered > 0) return;
    setSubmitted(true);
    if (!best || score > best.score) setBest({ score, total: QUIZ.length });
    window.scrollTo(0, 0);
  };

  const retry = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo(0, 0);
  };

  return (
    <section className="section">
      <div className="container narrow">
        <p className="crumbs">
          <Link to="/course">Courses</Link> / <Link to={`/course/${courseId}`}>{title}</Link> / Quiz
        </p>
        <h1>Quiz: {title}</h1>
        <p className="muted">Sample questions. A teacher must check them before classroom use.</p>

        {submitted && (
          <div className="notice notice-ok" role="status">
            <strong>
              You scored {score} out of {QUIZ.length}.
            </strong>{' '}
            Read the explanations below, then try again if you like.
            <div>
              <button type="button" className="btn btn-primary" onClick={retry}>
                Try again
              </button>
            </div>
          </div>
        )}

        <form onSubmit={submit}>
          {QUIZ.map((q, i) => {
            const chosen = answers[q.id];
            const right = chosen === q.correct;
            return (
              <fieldset key={q.id} className="question" disabled={submitted}>
                <legend>
                  {i + 1}. {q.prompt}
                </legend>
                {q.options.map((o, oi) => (
                  <label key={o} className="option">
                    <input
                      type="radio"
                      name={q.id}
                      checked={chosen === oi}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    />
                    <span>{o}</span>
                  </label>
                ))}
                {submitted && (
                  <p className={'feedback ' + (right ? 'feedback-ok' : 'feedback-bad')}>
                    <strong>{right ? 'Correct.' : 'Not quite.'}</strong>{' '}
                    {!right && <>The answer is: {q.options[q.correct]}. </>}
                    {q.explanation}
                  </p>
                )}
              </fieldset>
            );
          })}

          {!submitted && (
            <div className="quiz-submit">
              <button type="submit" className="btn btn-primary" disabled={unanswered > 0}>
                Submit answers
              </button>
              {unanswered > 0 && (
                <span className="muted">
                  {unanswered} question{unanswered === 1 ? '' : 's'} left to answer
                </span>
              )}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
