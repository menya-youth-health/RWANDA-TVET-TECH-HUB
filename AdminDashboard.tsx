
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Student {
  id: string;
  full_name: string | null;
  email: string | null;
  role: 'admin' | 'student';
  school: string | null;
  department: string | null;
  trade: string | null;
  study_level: string | null;
  created_at: string | null;
}

export default function AdminDashboard() {
  const { user, profile, signOut } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, full_name, email, role, school, department, trade, study_level, created_at'
        )
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        setStudents([]);
      } else {
        setStudents((data ?? []) as Student[]);
      }

      setLoading(false);
    }

    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return students;

    return students.filter((student) =>
      [
        student.full_name,
        student.email,
        student.school,
        student.department,
        student.trade,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [students, search]);

  async function handleLogout() {
    try {
      await signOut();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not log out.'
      );
    }
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">RWANDA TVET TECH HUB</p>
          <h1>Administrator Dashboard</h1>
          <p>Manage students and monitor your learning platform.</p>
        </div>

        <button className="admin-logout" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <section className="admin-welcome">
        <div>
          <h2>
            Welcome, {profile?.full_name || user?.email || 'Administrator'}
          </h2>
          <p>You are signed in with administrator access.</p>
        </div>
        <span className="admin-role">ADMINISTRATOR</span>
      </section>

      <section className="admin-stat-grid">
        <article className="admin-stat-card">
          <span>Total registered students</span>
          <strong>{loading ? '...' : students.length}</strong>
          <small>Student accounts</small>
        </article>

        <article className="admin-stat-card">
          <span>Matching students</span>
          <strong>{loading ? '...' : filteredStudents.length}</strong>
          <small>Based on your search</small>
        </article>

        <article className="admin-stat-card">
          <span>Administrator</span>
          <strong>1</strong>
          <small>Platform management account</small>
        </article>
      </section>

      <section className="admin-students-section">
        <div className="admin-section-heading">
          <div>
            <h2>Student Management</h2>
            <p>
              View registered student accounts and their study information.
            </p>
          </div>
        </div>

        <input
          className="admin-search"
          type="search"
          placeholder="Search by name, email, school, department or trade..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <p className="admin-message">Loading student records...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="admin-message">
            {students.length === 0
              ? 'No student accounts have been registered yet.'
              : 'No students match your search.'}
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>School</th>
                  <th>Department</th>
                  <th>Trade</th>
                  <th>Study level</th>
                  <th>Registered</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <strong>{student.full_name || 'No name'}</strong>
                      <small>{student.email || 'No email'}</small>
                    </td>
                    <td>{student.school || '—'}</td>
                    <td>{student.department || '—'}</td>
                    <td>{student.trade || '—'}</td>
                    <td>{student.study_level || '—'}</td>
                    <td>
                      {student.created_at
                        ? new Date(student.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}