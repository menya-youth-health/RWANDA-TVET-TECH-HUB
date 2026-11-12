
import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  title: string;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
  status: 'draft' | 'published';
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  resource_url: string | null;
  duration_minutes: number;
  position: number;
  status: 'draft' | 'published';
}

export default function AdminCourseContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [courseId, setCourseId] = useState('');
  const [moduleId, setModuleId] = useState('');

  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [duration, setDuration] = useState('0');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      loadModules(courseId);
    } else {
      setModules([]);
      setLessons([]);
      setModuleId('');
    }
  }, [courseId]);

  useEffect(() => {
    if (moduleId) {
      loadLessons(moduleId);
    } else {
      setLessons([]);
    }
  }, [moduleId]);

  async function loadCourses() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('courses')
      .select('id, title')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      const items = (data || []) as Course[];
      setCourses(items);

      if (items.length > 0) {
        setCourseId(items[0].id);
      }
    }

    setLoading(false);
  }

  async function loadModules(id: string) {
    setError('');

    const { data, error } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', id)
      .order('position', { ascending: true });

    if (error) {
      setError(error.message);
      return;
    }

    const items = (data || []) as Module[];
    setModules(items);

    if (!items.some((item) => item.id === moduleId)) {
      setModuleId(items[0]?.id || '');
    }
  }

  async function loadLessons(id: string) {
    setError('');

    const { data, error } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('module_id', id)
      .order('position', { ascending: true });

    if (error) {
      setError(error.message);
      return;
    }

    setLessons((data || []) as Lesson[]);
  }

  async function addModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!courseId || !moduleTitle.trim()) return;

    setSaving(true);
    setMessage('');
    setError('');

    const { error } = await supabase
      .from('course_modules')
      .insert({
        course_id: courseId,
        title: moduleTitle.trim(),
        description: moduleDescription.trim(),
        position: modules.length + 1,
        status: 'draft',
      });

    if (error) {
      setError(error.message);
    } else {
      setModuleTitle('');
      setModuleDescription('');
      setMessage('Module created successfully.');
      await loadModules(courseId);
    }

    setSaving(false);
  }

  async function addLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!moduleId || !lessonTitle.trim()) return;

    const minutes = Number(duration);

    if (!Number.isInteger(minutes) || minutes < 0) {
      setError('Enter a valid lesson duration.');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    const { error } = await supabase
      .from('course_lessons')
      .insert({
        module_id: moduleId,
        title: lessonTitle.trim(),
        content: lessonContent.trim(),
        video_url: videoUrl.trim() || null,
        resource_url: resourceUrl.trim() || null,
        duration_minutes: minutes,
        position: lessons.length + 1,
        status: 'draft',
      });

    if (error) {
      setError(error.message);
    } else {
      setLessonTitle('');
      setLessonContent('');
      setVideoUrl('');
      setResourceUrl('');
      setDuration('0');
      setMessage('Lesson created successfully.');
      await loadLessons(moduleId);
    }

    setSaving(false);
  }

  async function toggleModule(module: Module) {
    setError('');
    setMessage('');

    const newStatus =
      module.status === 'published' ? 'draft' : 'published';

    const { error } = await supabase
      .from('course_modules')
      .update({ status: newStatus })
      .eq('id', module.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage(`Module ${newStatus} successfully.`);
      await loadModules(courseId);
    }
  }

  async function toggleLesson(lesson: Lesson) {
    setError('');
    setMessage('');

    const newStatus =
      lesson.status === 'published' ? 'draft' : 'published';

    const { error } = await supabase
      .from('course_lessons')
      .update({ status: newStatus })
      .eq('id', lesson.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage(`Lesson ${newStatus} successfully.`);
      await loadLessons(moduleId);
    }
  }

  async function deleteModule(id: string) {
    if (!window.confirm(
      'Delete this module and all its lessons? This cannot be undone.'
    )) return;

    setError('');
    setMessage('');

    const { error } = await supabase
      .from('course_modules')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Module deleted successfully.');
      setModuleId('');
      await loadModules(courseId);
    }
  }

  async function deleteLesson(id: string) {
    if (!window.confirm('Delete this lesson? This cannot be undone.')) {
      return;
    }

    setError('');
    setMessage('');

    const { error } = await supabase
      .from('course_lessons')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Lesson deleted successfully.');
      await loadLessons(moduleId);
    }
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading course content...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1>Manage Course Content</h1>
        <p className="muted">
          Create course modules and add lessons for your students.
        </p>

        {message && (
          <div className="notice notice-success">{message}</div>
        )}

        {error && (
          <div className="notice notice-warn">{error}</div>
        )}

        <div className="card">
          <h2>Select a course</h2>

          {courses.length === 0 ? (
            <p>No courses found. Create a course first.</p>
          ) : (
            <select
              value={courseId}
              onChange={(event) => {
                setCourseId(event.target.value);
                setModuleId('');
              }}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {courseId && (
          <>
            <div className="card">
              <h2>Create a module</h2>

              <form onSubmit={addModule}>
                <label>Module title</label>
                <input
                  value={moduleTitle}
                  onChange={(event) => setModuleTitle(event.target.value)}
                  placeholder="Example: Introduction to Computer Hardware"
                  required
                />

                <label>Module description</label>
                <textarea
                  value={moduleDescription}
                  onChange={(event) =>
                    setModuleDescription(event.target.value)
                  }
                  placeholder="Describe what students will learn..."
                  rows={3}
                />

                <button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Create Module'}
                </button>
              </form>
            </div>

            <div className="card">
              <h2>Course modules ({modules.length})</h2>

              {modules.length === 0 ? (
                <p>No modules yet. Create your first module above.</p>
              ) : (
                modules.map((module) => (
                  <div className="card" key={module.id}>
                    <h3>{module.position}. {module.title}</h3>
                    <p>{module.description}</p>
                    <p>
                      Status: <strong>{module.status}</strong>
                    </p>

                    <button
                      type="button"
                      onClick={() => setModuleId(module.id)}
                    >
                      Manage Lessons
                    </button>{' '}

                    <button
                      type="button"
                      onClick={() => toggleModule(module)}
                    >
                      {module.status === 'published'
                        ? 'Unpublish'
                        : 'Publish'}
                    </button>{' '}

                    <button
                      type="button"
                      onClick={() => deleteModule(module.id)}
                    >
                      Delete Module
                    </button>
                  </div>
                ))
              )}
            </div>

            {moduleId && (
              <>
                <div className="card">
                  <h2>Add a lesson</h2>

                  <form onSubmit={addLesson}>
                    <label>Lesson title</label>
                    <input
                      value={lessonTitle}
                      onChange={(event) =>
                        setLessonTitle(event.target.value)
                      }
                      placeholder="Example: Parts of a Computer"
                      required
                    />

                    <label>Lesson content</label>
                    <textarea
                      value={lessonContent}
                      onChange={(event) =>
                        setLessonContent(event.target.value)
                      }
                      placeholder="Write the lesson here..."
                      rows={6}
                    />

                    <label>Video URL (optional)</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(event) => setVideoUrl(event.target.value)}
                      placeholder="https://..."
                    />

                    <label>Learning resource URL (optional)</label>
                    <input
                      type="url"
                      value={resourceUrl}
                      onChange={(event) =>
                        setResourceUrl(event.target.value)
                      }
                      placeholder="https://..."
                    />

                    <label>Duration in minutes</label>
                    <input
                      type="number"
                      min="0"
                      value={duration}
                      onChange={(event) => setDuration(event.target.value)}
                    />

                    <button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Create Lesson'}
                    </button>
                  </form>
                </div>

                <div className="card">
                  <h2>Lessons ({lessons.length})</h2>

                  {lessons.length === 0 ? (
                    <p>No lessons in this module yet.</p>
                  ) : (
                    lessons.map((lesson) => (
                      <div className="card" key={lesson.id}>
                        <h3>{lesson.position}. {lesson.title}</h3>
                        <p>
                          Duration: {lesson.duration_minutes} minutes
                        </p>
                        <p>
                          Status: <strong>{lesson.status}</strong>
                        </p>

                        <button
                          type="button"
                          onClick={() => toggleLesson(lesson)}
                        >
                          {lesson.status === 'published'
                            ? 'Unpublish'
                            : 'Publish'}
                        </button>{' '}

                        <button
                          type="button"
                          onClick={() => deleteLesson(lesson.id)}
                        >
                          Delete Lesson
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
