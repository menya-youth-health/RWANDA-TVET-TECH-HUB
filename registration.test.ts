import { describe, expect, it } from 'vitest';
import { DEPARTMENTS } from './departments';
import { EMPTY_FORM, LEVELS, TRADES_BY_DEPARTMENT, validate, type RegistrationForm } from './registration';

const good: RegistrationForm = {
  fullName: 'Test Student',
  email: 'a@b.rw',
  password: 'longenough1',
  confirm: 'longenough1',
  school: 'GS Example',
  department: 'iot',
  trade: 'Electronics',
  level: LEVELS[1],
  consent: true,
};

describe('registration form rules', () => {
  it('accepts a complete form', () => {
    expect(validate(good)).toEqual({});
  });
  it('rejects an empty form', () => {
    expect(Object.keys(validate(EMPTY_FORM)).length).toBeGreaterThanOrEqual(6);
  });
  it('rejects mismatched or short passwords and a bad email', () => {
    expect(validate({ ...good, confirm: 'x' }).confirm).toBeDefined();
    expect(validate({ ...good, password: 'short', confirm: 'short' }).password).toBeDefined();
    expect(validate({ ...good, email: 'nope' }).email).toBeDefined();
  });
  it('requires consent and a trade that belongs to the department', () => {
    expect(validate({ ...good, consent: false }).consent).toBeDefined();
    expect(validate({ ...good, trade: 'Mechatronics' }).trade).toBeDefined();
  });
  it('has trades for every department', () => {
    for (const d of DEPARTMENTS) expect((TRADES_BY_DEPARTMENT[d.id] ?? []).length).toBeGreaterThan(0);
  });
});
