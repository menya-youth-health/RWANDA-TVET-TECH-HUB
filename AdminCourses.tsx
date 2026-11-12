
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import './AdminCourses.css';

interface Course {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  trade: string | null;
  study_level: string | null;
  thumbnail_url: string | null;
  status: 'draft' | 'published';
  created_at: string;
}

interface CourseForm {
  title: string;
  description: string;
  department: string;
  trade: string;
  study_level: string;
  status: 'draft' | 'published';
}

const initialForm: CourseForm = {
  title: '',
  description: '',
  department: '',
  trade: '',
  study_level: '',
  status: 'draft',
};

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<CourseForm>(initialForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl('');
      return;
    }

    const imageUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [selectedImage]);

  async function loadCourses() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setCourses([]);
    } else {
      setCourses((data ?? []) as Course[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setError('');
    setMessage('');

    if (!file) {
      setSelectedImage(null);
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a JPG, PNG, or WebP image.');
      event.target.value = '';
      setSelectedImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Your image must be smaller than 5 MB.');
      event.target.value = '';
      setSelectedImage(null);
      return;
    }

    setSelectedImage(file);
  }

  async function handleCreateCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Please enter a course title.');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    let uploadedImagePath: string | null = null;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error('Please log in before creating a course.');
      }

      let thumbnailUrl: string | null = null;

      if (selectedImage) {
        const safeFileName = selectedImage.name.replace(
          /[^a-zA-Z0-9._-]/g,
          '-'
        );

        uploadedImagePath =
          `${user.id}/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('course-thumbnails')
          .upload(uploadedImagePath, selectedImage, {
            cacheControl: '3600',
            upsert: false,
            contentType: selectedImage.type,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('course-thumbnails')
          .getPublicUrl(uploadedImagePath);

        thumbnailUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('courses')
        .insert({
          title: form.title.trim(),
          description: form.description.trim() || null,
          department: form.department.trim() || null,
          trade: form.trade.trim() || null,
          study_level: form.study_level.trim() || null,
          status: form.status,
          created_by: user.id,
          thumbnail_url: thumbnailUrl,
        });

      if (insertError) throw insertError;

      setMessage('Your course and picture have been saved successfully!');
      setForm(initialForm);
      setSelectedImage(null);

      const imageInput = document.getElementById(
        'course-image'
      ) as HTMLInputElement | null;

      if (imageInput) imageInput.value = '';

      await loadCourses();
    } catch (err) {
      if (uploadedImagePath) {
        await supabase.storage
          .from('course-thumbnails')
          .remove([uploadedImagePath]);
      }

      setError(
        err instanceof Error ? err.message : 'Unable to create course.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(course: Course) {
    setError('');
    setMessage('');

    const newStatus =
      course.status === 'published' ? 'draft' : 'published';

    const { error } = await supabase
      .from('courses')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', course.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage(`Course successfully changed to ${newStatus}.`);
      await loadCourses();
    }
  }

  async function handleDelete(course: Course) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"?`
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', course.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Course deleted successfully.');
      await loadCourses();
    }
  }

  return (
    <main className="course-admin-page">
      <div className="course-admin-container">

        <header className="course-admin-header">
          <div>
            <span className="course-admin-label">
              RWANDA TVET TECH HUB
            </span>
            <h1>Course Management</h1>
            <p>
              Create, organize and publish learning courses for students.
            </p>
          </div>

          <button
            type="button"
            className="course-add-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Close Form' : '+ Create New Course'}
          </button>
        </header>

        {message && (
          <div className="course-success">{message}</div>
        )}

        {error && (
          <div className="course-error">{error}</div>
        )}

        {showForm && (
          <section className="course-form-card">
            <div className="course-card-heading">
              <div>
                <h2>Create a New Course</h2>
                <p>Enter the information about your new course.</p>
              </div>
            </div>

            <form onSubmit={handleCreateCourse}>
              <div className="course-form-grid">

                <div className="course-form-group full-width">
                  <label htmlFor="course-title">Course Title *</label>
                  <input
                    id="course-title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Example: Computer Networking"
                    required
                  />
                </div>

                <div className="course-form-group full-width">
                  <label htmlFor="course-description">
                    Course Description
                  </label>
                  <textarea
                    id="course-description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Explain what students will learn..."
                    rows={5}
                  />
                </div>

                <div className="course-form-group">
                  <label htmlFor="course-department">Department</label>
                  <input
                    id="course-department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Example: ICT"
                  />
                </div>

                <div className="course-form-group">
                  <label htmlFor="course-trade">Trade</label>
                  <input
                    id="course-trade"
                    name="trade"
                    value={form.trade}
                    onChange={handleChange}
                    placeholder="Example: Computer Systems"
                  />
                </div>

                <div className="course-form-group">
                  <label htmlFor="course-level">Study Level</label>
                  <select
                    id="course-level"
                    name="study_level"
                    value={form.study_level}
                    onChange={handleChange}
                  >
                    <option value="">Select study level</option>
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                    <option value="Level 4">Level 4</option>
                    <option value="Level 5">Level 5</option>
                    <option value="Level 6">Level 6</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="course-form-group">
                  <label htmlFor="course-status">Publication Status</label>
                  <select
                    id="course-status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="draft">Save as Draft</option>
                    <option value="published">Publish Immediately</option>
                  </select>
                </div>

                <div className="course-form-group full-width">
                  <label htmlFor="course-image">
                    Course Picture (Optional)
                  </label>

                  <input
                    id="course-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                  />

                  <small>
                    JPG, PNG or WebP image. Maximum size: 5 MB.
                  </small>

                  {previewUrl && (
                    <div className="course-image-preview">
                      <img
                        src={previewUrl}
                        alt="Course picture preview"
                      />

                      <button
                        type="button"
                        className="course-remove-image"
                        onClick={() => {
                          setSelectedImage(null);

                          const input = document.getElementById(
                            'course-image'
                          ) as HTMLInputElement | null;

                          if (input) input.value = '';
                        }}
                      >
                        Remove picture
                      </button>
                    </div>
                  )}
                </div>

              </div>

              <div className="course-form-actions">
                <button
                  type="button"
                  className="course-cancel-button"
                  onClick={() => {
                    setForm(initialForm);
                    setSelectedImage(null);
                    setShowForm(false);

                    const input = document.getElementById(
                      'course-image'
                    ) as HTMLInputElement | null;

                    if (input) input.value = '';
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="course-save-button"
                  disabled={saving}
                >
                  {saving ? 'Saving Course...' : 'Create Course'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="course-list-card">
          <div className="course-card-heading">
            <div>
              <h2>Existing Courses</h2>
              <p>Manage courses already saved in your database.</p>
            </div>

            <span className="course-total">
              {courses.length} Courses
            </span>
          </div>

          {loading ? (
            <p className="course-empty">Loading courses...</p>
          ) : courses.length === 0 ? (
            <div className="course-empty">
              <h3>No courses yet</h3>
              <p>Create your first course using the form above.</p>
            </div>
          ) : (
            <div className="course-list">
              {courses.map((course) => (
                <article className="course-item" key={course.id}>
                  {course.thumbnail_url && (
                    <img
                      className="course-item-thumbnail"
                      src={course.thumbnail_url}
                      alt={course.title}
                    />
                  )}

                  <div className="course-item-info">
                    <h3>{course.title}</h3>
                    <p>
                      {course.description || 'No description provided.'}
                    </p>

                    <div className="course-item-meta">
                      <span>{course.department || 'No department'}</span>
                      <span>{course.trade || 'No trade'}</span>
                      <span>{course.study_level || 'No level'}</span>
                    </div>
                  </div>

                  <div className="course-item-actions">
                    <span className={`course-status ${course.status}`}>
                      {course.status}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(course)}
                    >
                      {course.status === 'published'
                        ? 'Unpublish'
                        : 'Publish'}
                    </button>

                    <button
                      type="button"
                      className="course-delete-button"
                      onClick={() => handleDelete(course)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
