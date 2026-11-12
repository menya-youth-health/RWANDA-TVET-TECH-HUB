
import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  DEPARTMENT_OPTIONS,
  EMPTY_FORM,
  LEVELS,
  tradesFor,
  validate,
  type RegistrationErrors,
  type RegistrationForm,
} from '../data/registration';

export default function Register() {
  const [params] = useSearchParams();
  const wanted = params.get('dept') ?? '';

  const [form, setForm] = useState<RegistrationForm>({
    ...EMPTY_FORM,
    department: DEPARTMENT_OPTIONS.some((d) => d.id === wanted) ? wanted : '',
  });

  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof RegistrationForm>(
    key: K,
    value: RegistrationForm[K]
  ) => {
    setForm((f) => {
      const next = { ...f, [key]: value };

      if (
        key === 'department' &&
        !tradesFor(String(value)).includes(f.trade)
      ) {
        next.trade = '';
      }

      return next;
    });

    setMessage('');
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    const found = validate(form);
    setErrors(found);

    if (Object.keys(found).length > 0) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            school: form.school.trim(),
            department: form.department,
            trade: form.trade,
            study_level: form.level,
            consent: form.consent,
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Registration could not be completed. Please try again.');
      }

      setMessageType('success');

      if (data.session) {
        setMessage(
          'Your account has been created successfully! You can now log in.'
        );
      } else {
        setMessage(
          'Your account has been created. Please check your email for a confirmation link before logging in.'
        );
      }

      setForm((f) => ({
        ...f,
        password: '',
        confirm: '',
      }));
    } catch (error) {
      setMessageType('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const trades = tradesFor(form.department);

  const field = (key: keyof RegistrationForm) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `err-${key}` : undefined,
  });

  const err = (key: keyof RegistrationForm) =>
    errors[key] ? (
      <span id={`err-${key}`} className="field-error" role="alert">
        {errors[key]}
      </span>
    ) : null;

  return (
    <section className="section">
      <div className="container narrow">
        <h1>Create your account</h1>
        <p className="muted">
          Join RWANDA TVET TECH HUB. Choose the area you are interested in.
        </p>

        {message && (
          <div
            className={`notice ${messageType === 'success' ? 'notice-ok' : 'notice-warn'}`}
            role="status"
          >
            {message}
            {messageType === 'success' && (
              <>
                {' '}
                <Link to="/login">Go to login</Link>
              </>
            )}
          </div>
        )}

        <form className="card form" onSubmit={submit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="fullName">Full name *</label>
              <input
                id="fullName"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                {...field('fullName')}
              />
              {err('fullName')}
            </div>

            <div className="field">
              <label htmlFor="email">Email address *</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                {...field('email')}
              />
              {err('email')}
            </div>

            <div className="field">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                {...field('password')}
              />
              {err('password')}
            </div>

            <div className="field">
              <label htmlFor="confirm">Confirm password *</label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={(e) => set('confirm', e.target.value)}
                {...field('confirm')}
              />
              {err('confirm')}
            </div>
          </div>

          <div className="field">
            <label htmlFor="school">School *</label>
            <input
              id="school"
              autoComplete="organization"
              placeholder="Enter your school name"
              value={form.school}
              onChange={(e) => set('school', e.target.value)}
              {...field('school')}
            />
            {err('school')}
          </div>

          <div className="field">
            <label htmlFor="department">TVET sector / department *</label>
            <select
              id="department"
              value={form.department}
              onChange={(e) => set('department', e.target.value)}
              {...field('department')}
            >
              <option value="">Select department</option>
              {DEPARTMENT_OPTIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {err('department')}
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="trade">TVET trade *</label>
              <select
                id="trade"
                value={form.trade}
                onChange={(e) => set('trade', e.target.value)}
                {...field('trade')}
              >
                <option value="">Select trade</option>
                {trades.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {err('trade')}
            </div>

            <div className="field">
              <label htmlFor="level">Study level *</label>
              <select
                id="level"
                value={form.level}
                onChange={(e) => set('level', e.target.value)}
                {...field('level')}
              >
                <option value="">Select level</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {err('level')}
            </div>
          </div>

          <div className="field">
            <label className="option" htmlFor="consent">
              <input
                id="consent"
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set('consent', e.target.checked)}
                {...field('consent')}
              />
              <span>
                I understand that this is an independent project, not an
                official Rwanda TVET Board system, and that my details will
                be used only to run my learning account.
              </span>
            </label>
            {err('consent')}
          </div>

          <button
            type="submit"
            className="btn btn-accent"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="small muted">
            Fields marked * are required. Use a password you do not use
            anywhere else.
          </p>
        </form>

        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}
