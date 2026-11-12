
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import NotFound from './NotFound';

interface PublishedCourseData {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  trade: string | null;
  study_level: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

export default function PublishedCourse() {
  const { courseId } = useParams();

  const [course, setCourse] = useState<PublishedCourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCourse() {
      if (!courseId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('courses')
        .select(
          'id, title, description, department, trade, study_level, thumbnail_url, created_at'
        )
        .eq('id', courseId)
        .eq('status', 'published')
        .maybeSingle();

      if (!active) return;

      if (error) {
        setError(error.message);
      } else {
        setCourse(data as PublishedCourseData | null);
      }

      setLoading(false);
    }

    loadCourse();

    return () => {
      active = false;
    };
  }, [courseId]);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading course information...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <div className="notice notice-warn">
            Could not load this course: {error}
          </div>
          <Link to="/course">Back to courses</Link>
        </div>
      </section>
    );
  }

  if (!course) {
    return <NotFound />;
  }

  return (
    <section className="section">
      <div className="container narrow">
        <p className="crumbs">
          <Link to="/course">Courses</Link> / {course.title}
        </p>

        {course.thumbnail_url && (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            style={{
              width: '100%',
              maxHeight: '350px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '20px',
            }}
          />
        )}

        <span className="badge badge-ok">Published course</span>

        <h1>{course.title}</h1>

        <p className="lead">
          {course.description || 'No description provided yet.'}
        </p>

        <div className="card">
          <h2>Course Information</h2>

          <p>
            <strong>Department:</strong>{' '}
            {course.department || 'Not specified'}
          </p>

          <p>
            <strong>Trade:</strong> {course.trade || 'Not specified'}
          </p>

          <p>
            <strong>Study Level:</strong>{' '}
            {course.study_level || 'Not specified'}
          </p>

          <p className="small muted">
            Published course information is provided by the platform
            administrator.
          </p>
        </div>

        <div className="notice notice-warn">
          Learning modules, lessons, downloadable resources and quizzes
          will be added to this course management system in the next
          development stage.
        </div>

        <Link className="btn btn-primary" to="/course">
          Back to all courses
        </Link>
      </div>
    </section>
  );
}
