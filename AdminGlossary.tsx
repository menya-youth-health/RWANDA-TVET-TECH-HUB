
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './AdminGlossary.css';

interface GlossaryTerm {
  id: string;
  term: string;
  meaning: string;
  area: string;
  status: 'draft' | 'published';
  created_at: string;
}

const emptyForm = {
  term: '',
  meaning: '',
  area: 'Computer systems',
  status: 'draft' as 'draft' | 'published',
};

const areas = [
  'Computer systems',
  'Electronics',
  'Networking',
  'Operating systems',
  'Embedded systems',
  'IoT',
  'Cybersecurity',
  'Software development',
  'Robotics',
  'Other',
];

export default function AdminGlossary() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  async function loadTerms() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .order('term', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setTerms((data || []) as GlossaryTerm[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTerms();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function editTerm(term: GlossaryTerm) {
    setEditingId(term.id);
    setForm({
      term: term.term,
      meaning: term.meaning,
      area: term.area,
      status: term.status,
    });

    setNotice('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.term.trim() || !form.meaning.trim() || !form.area.trim()) {
      setError('Please complete all fields.');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        throw new Error('Please log in as administrator.');
      }

      const termData = {
        term: form.term.trim(),
        meaning: form.meaning.trim(),
        area: form.area.trim(),
        status: form.status,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase
          .from('glossary_terms')
          .update(termData)
          .eq('id', editingId);

        if (error) throw error;

        setNotice('Glossary term updated successfully.');
      } else {
        const { error } = await supabase
          .from('glossary_terms')
          .insert({
            ...termData,
            created_by: authData.user.id,
          });

        if (error) throw error;

        setNotice('New glossary term added successfully.');
      }

      resetForm();
      await loadTerms();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(term: GlossaryTerm) {
    const newStatus =
      term.status === 'published' ? 'draft' : 'published';

    const { error } = await supabase
      .from('glossary_terms')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', term.id);

    if (error) {
      setError(error.message);
    } else {
      setNotice(
        newStatus === 'published'
          ? 'Term published successfully.'
          : 'Term moved to drafts.'
      );
      await loadTerms();
    }
  }

  async function deleteTerm(term: GlossaryTerm) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${term.term}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('glossary_terms')
      .delete()
      .eq('id', term.id);

    if (error) {
      setError(error.message);
    } else {
      setNotice('Glossary term deleted successfully.');
      await loadTerms();

      if (editingId === term.id) resetForm();
    }
  }

  const shownTerms = terms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(search.toLowerCase()) ||
      term.meaning.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Published' && term.status === 'published') ||
      (filter === 'Drafts' && term.status === 'draft');

    return matchesSearch && matchesFilter;
  });

  return (
    <section className="section">
      <div className="container admin-glossary">
        <div className="admin-glossary-header">
          <div>
            <h1>Manage Glossary</h1>
            <p className="muted">
              Add, edit, organize and publish technical terms for students.
            </p>
          </div>

          <div className="glossary-admin-count">
            <strong>{terms.length}</strong>
            <span>Total terms</span>
          </div>
        </div>

        {notice && (
          <div className="notice notice-success" role="status">
            {notice}
          </div>
        )}

        {error && (
          <div className="notice notice-warn" role="alert">
            {error}
          </div>
        )}

        <div className="admin-glossary-form-card">
          <h2>{editingId ? 'Edit glossary term' : 'Add new term'}</h2>

          <form onSubmit={handleSubmit}>
            <div className="admin-glossary-fields">
              <label>
                Technical term
                <input
                  name="term"
                  value={form.term}
                  onChange={handleChange}
                  placeholder="Example: Microprocessor"
                  required
                />
              </label>

              <label>
                Subject area
                <select
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  required
                >
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-glossary-full">
                Meaning / definition
                <textarea
                  name="meaning"
                  value={form.meaning}
                  onChange={handleChange}
                  placeholder="Write a clear explanation of this technical term..."
                  rows={5}
                  required
                />
              </label>

              <label>
                Publication status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>

            <div className="admin-glossary-actions">
              <button
                className="btn btn-accent"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update term'
                    : 'Add term'}
              </button>

              {editingId && (
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel editing
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-glossary-list">
          <div className="admin-glossary-list-header">
            <h2>Existing terms</h2>

            <div className="admin-glossary-filters">
              <input
                type="search"
                placeholder="Search terms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All terms</option>
                <option value="Published">Published</option>
                <option value="Drafts">Drafts</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p>Loading glossary terms...</p>
          ) : shownTerms.length === 0 ? (
            <div className="notice">
              No glossary terms found.
            </div>
          ) : (
            <div className="admin-glossary-table-wrap">
              <table className="admin-glossary-table">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Subject area</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {shownTerms.map((term) => (
                    <tr key={term.id}>
                      <td>
                        <strong>{term.term}</strong>
                        <p>{term.meaning}</p>
                      </td>

                      <td>{term.area}</td>

                      <td>
                        <span
                          className={`glossary-status ${term.status}`}
                        >
                          {term.status}
                        </span>
                      </td>

                      <td>
                        <div className="glossary-row-actions">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => editTerm(term)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-accent"
                            onClick={() => toggleStatus(term)}
                          >
                            {term.status === 'published'
                              ? 'Unpublish'
                              : 'Publish'}
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteTerm(term)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
