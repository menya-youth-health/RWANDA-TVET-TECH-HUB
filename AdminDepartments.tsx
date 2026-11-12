
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import './AdminDepartments.css';

interface Department {
  id: string;
  name: string;
  summary: string;
  live: boolean;
  course_id: string | null;
  overview: string;
  topics: string[];
  skills: string[];
  tools: string[];
  safety: string;
  outline: string[];
  career_paths: string[];
  image_url: string | null;
}

const emptyForm = {
  id: '',
  name: '',
  summary: '',
  live: false,
  course_id: '',
  overview: '',
  topics: '',
  skills: '',
  tools: '',
  safety: '',
  outline: '',
  career_paths: '',
};

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function loadDepartments() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (error) {
      setError(error.message);
    } else {
      setDepartments((data || []) as Department[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl('');
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a JPG, PNG or WebP image.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('The image must not exceed 5 MB.');
      event.target.value = '';
      return;
    }

    setError('');
    setSelectedImage(file);
  }

  function editDepartment(department: Department) {
    setEditingId(department.id);

    setForm({
      id: department.id,
      name: department.name,
      summary: department.summary || '',
      live: department.live,
      course_id: department.course_id || '',
      overview: department.overview || '',
      topics: (department.topics || []).join('\n'),
      skills: (department.skills || []).join('\n'),
      tools: (department.tools || []).join('\n'),
      safety: department.safety || '',
      outline: (department.outline || []).join('\n'),
      career_paths: (department.career_paths || []).join('\n'),
    });

    setSelectedImage(null);
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSelectedImage(null);
    setMessage('');
    setError('');
  }

  function toArray(value: string) {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        throw new Error('Please log in as administrator.');
      }

      const departmentId = editingId || form.id.trim().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      if (!departmentId) {
        throw new Error('Please enter a department name.');
      }

      let imageUrl: string | null = null;

      if (selectedImage) {
        const safeName = selectedImage.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const imagePath = `${departmentId}/${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from('department-images')
          .upload(imagePath, selectedImage);

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from('department-images')
          .getPublicUrl(imagePath);

        imageUrl = publicData.publicUrl;
      }

      const departmentData = {
        id: departmentId,
        name: form.name.trim(),
        summary: form.summary.trim(),
        live: form.live,
        course_id: form.course_id.trim() || null,
        overview: form.overview.trim(),
        topics: toArray(form.topics),
        skills: toArray(form.skills),
        tools: toArray(form.tools),
        safety: form.safety.trim(),
        outline: toArray(form.outline),
        career_paths: toArray(form.career_paths),
        ...(imageUrl ? { image_url: imageUrl } : {}),
        updated_at: new Date().toISOString(),
      };

      const { error: saveError } = await supabase
        .from('departments')
        .upsert(departmentData);

      if (saveError) throw saveError;

      setMessage(editingId ? 'Department updated successfully.' : 'Department created successfully.');

      resetForm();
      await loadDepartments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(department: Department) {
    setError('');
    setMessage('');

    const { error } = await supabase
      .from('departments')
      .update({
        live: !department.live,
        updated_at: new Date().toISOString(),
      })
      .eq('id', department.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Department publication status updated.');
      await loadDepartments();
    }
  }

  async function deleteDepartment(department: Department) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${department.name}"?`
    );

    if (!confirmed) return;

    setError('');
    setMessage('');

    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', department.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Department deleted successfully.');
      await loadDepartments();
    }
  }

  return (
    <section className="admin-departments-page">
      <div className="admin-departments-container">
        <header className="departments-admin-header">
          <div>
            <span className="departments-admin-label">ADMINISTRATION</span>
            <h1>Department Management</h1>
            <p>Create and manage departments and their learning information.</p>
          </div>
          <div className="departments-total">
            <strong>{departments.length}</strong>
            <span>Total departments</span>
          </div>
        </header>

        {message && <div className="department-notice success">{message}</div>}
        {error && <div className="department-notice error">{error}</div>}

        <form className="department-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Department' : 'Add New Department'}</h2>

          <div className="department-form-grid">
            <div className="department-field">
              <label htmlFor="department-name">Department Name *</label>
              <input
                id="department-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Software Development (SOD)"
              />
            </div>

            <div className="department-field">
              <label htmlFor="department-course-id">Related Course ID (Optional)</label>
              <input
                id="department-course-id"
                value={form.course_id}
                onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                placeholder="e.g. software-development"
              />
            </div>

            <div className="department-field full-width">
              <label htmlFor="department-summary">Short Summary *</label>
              <textarea
                id="department-summary"
                required
                rows={2}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Briefly describe this department..."
              />
            </div>

            <div className="department-field full-width">
              <label htmlFor="department-overview">Detailed Overview</label>
              <textarea
                id="department-overview"
                rows={4}
                value={form.overview}
                onChange={(e) => setForm({ ...form, overview: e.target.value })}
                placeholder="Explain what students will learn..."
              />
            </div>

            <div className="department-field">
              <label htmlFor="department-topics">Learning Topics</label>
              <textarea
                id="department-topics"
                rows={5}
                value={form.topics}
                onChange={(e) => setForm({ ...form, topics: e.target.value })}
                placeholder={'One topic per line:\nProgramming fundamentals\nWeb development'}
              />
            </div>

            <div className="department-field">
              <label htmlFor="department-skills">Skills Students Will Gain</label>
              <textarea
                id="department-skills"
                rows={5}
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder={'One skill per line:\nWrite simple programs\nBuild websites'}
              />
            </div>

            <div className="department-field">
              <label htmlFor="department-tools">Tools and Equipment</label>
              <textarea
                id="department-tools"
                rows={4}
                value={form.tools}
                onChange={(e) => setForm({ ...form, tools: e.target.value })}
                placeholder={'One tool per line:\nLaptop\nVisual Studio Code'}
              />
            </div>

            <div className="department-field">
              <label htmlFor="department-outline">Course Outline</label>
              <textarea
                id="department-outline"
                rows={4}
                value={form.outline}
                onChange={(e) => setForm({ ...form, outline: e.target.value })}
                placeholder={'One item per line:\nModule 1\nModule 2'}
              />
            </div>

            <div className="department-field full-width">
              <label htmlFor="department-safety">Safety Instructions</label>
              <textarea
                id="department-safety"
                rows={3}
                value={form.safety}
                onChange={(e) => setForm({ ...form, safety: e.target.value })}
                placeholder="Important safety instructions..."
              />
            </div>

            <div className="department-field full-width">
              <label htmlFor="department-careers">Career Opportunities</label>
              <textarea
                id="department-careers"
                rows={3}
                value={form.career_paths}
                onChange={(e) => setForm({ ...form, career_paths: e.target.value })}
                placeholder={'One career per line:\nSoftware developer\nWeb developer'}
              />
            </div>

            <div className="department-field full-width">
              <label htmlFor="department-image">Department Picture (Optional)</label>
              <input
                id="department-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
              />
              <small>JPG, PNG or WebP. Maximum 5 MB.</small>

              {previewUrl && (
                <img
                  className="department-image-preview"
                  src={previewUrl}
                  alt="Department preview"
                />
              )}
            </div>

            <div className="department-field full-width">
              <label className="department-publish-option">
                <input
                  type="checkbox"
                  checked={form.live}
                  onChange={(e) => setForm({ ...form, live: e.target.checked })}
                />
                Publish this department for students
              </label>
            </div>
          </div>

          <div className="department-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Department' : 'Create Department'}
            </button>

            {editingId && (
              <button type="button" className="department-cancel" onClick={resetForm}>
                Cancel Editing
              </button>
            )}
          </div>
        </form>

        <section className="department-list-section">
          <h2>Existing Departments</h2>

          {loading ? (
            <p>Loading departments...</p>
          ) : departments.length === 0 ? (
            <p>No departments have been added to the database yet.</p>
          ) : (
            <div className="department-admin-list">
              {departments.map((department) => (
                <article className="department-admin-card" key={department.id}>
                  {department.image_url && (
                    <img
                      src={department.image_url}
                      alt={department.name}
                      className="department-admin-image"
                    />
                  )}

                  <div className="department-admin-info">
                    <h3>{department.name}</h3>
                    <p>{department.summary}</p>
                    <span className={department.live ? 'department-live' : 'department-draft'}>
                      {department.live ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="department-admin-actions">
                    <button type="button" onClick={() => editDepartment(department)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => togglePublish(department)}>
                      {department.live ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      className="department-delete"
                      onClick={() => deleteDepartment(department)}
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
    </section>
  );
}
