
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { COURSES, lessonsOf } from '../data/courses';
import { useStored } from '../storage';
import { supabase } from '../lib/supabase';

interface PublishedCourse {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  trade: string | null;
  study_level: string | null;
  thumbnail_url: string | null;
}

export default function CourseList() {
  const [done] = useStored<string[]>('completedLessons', []);
  const [publishedCourses, setPublishedCourses] = useState<PublishedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPublishedCourses() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('courses')
        .select(
          'id, title, description, department, trade, study_level, thumbnail_url'
        )
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!active) return;

      if (error) {
        setError(error.message);
        setPublishedCourses([]);
      } else {
        setPublishedCourses((data ?? []) as PublishedCourse[]);
      }

      setLoading(false);
    }

    loadPublishedCourses();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h1>Courses</h1>

        <p className="muted">
          Explore your learning courses, read lessons and practise your skills.
        </p>

        <div className="notice notice-warn">
          Some existing lessons and quiz questions are sample content. They
          have not yet been verified against the official RTB curriculum.
        </div>

        <h2>Available Courses</h2>

        {loading && (
          <p className="muted">Loading published courses...</p>
        )}

        {error && (
          <div className="notice notice-warn">
            Could not load administrator courses: {error}
          </div>
        )}

        {!loading && publishedCourses.length === 0 && !error && (
          <p className="muted">
            No additional administrator-published courses are available yet.
          </p>
        )}

        {publishedCourses.length > 0 && (
          <div className="grid">
            {publishedCourses.map((course) => (
              <article className="card card-live" key={course.id}>
                {course.thumbnail_url && (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '190px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                )}

                <span className="badge badge-ok">Published</span>

                <h3>{course.title}</h3>

                <p>
                  {course.description || 'No course description provided yet.'}
                </p>

                <p className="small muted">
                  {course.department || 'Department not specified'}
                  {' · '}
                  {course.trade || 'Trade not specified'}
                  {' · '}
                  {course.study_level || 'Level not specified'}
                </p>

                <p className="card-links">
                  <Link
                    className="btn btn-primary"
                    to={`/published-course/${course.id}`}
                  >
                    Open course
                  </Link>
                </p>
              </article>
            ))}
          </div>
        )}

        <h2>Existing Learning Courses</h2>

        <p className="muted">
          These courses contain the existing sample modules, lessons and quizzes.
        </p>

        <div className="grid">
          {COURSES.map((course) => {
            const lessons = lessonsOf(course);
            const count = lessons.filter((lesson) =>
              done.includes(lesson.id)
            ).length;

            const percent =
              lessons.length > 0
                ? Math.round((count / lessons.length) * 100)
                : 0;

            return (
              <article key={course.id} className="card card-live">
                <span className="badge badge-ok">Available</span>

                <h3>{course.title}</h3>

                <p>{course.summary}</p>

                <p className="small muted">
                  {lessons.length} lessons · {course.quiz.length}-question quiz
                </p>

                <div
                  className="bar"
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${course.title} progress`}
                >
                  <span style={{ width: `${percent}%` }} />
                </div>

                <p className="small muted">
                  {count} of {lessons.length} lessons completed
                </p>

                <p className="card-links">
                  <Link
                    className="btn btn-primary"
                    to={`/course/${course.id}`}
                  >
                    {count === 0 ? 'Open course' : 'Continue'}
                  </Link>
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
