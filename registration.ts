// Choices for the registration form.
//
// IMPORTANT: these lists are DRAFT choices. The trade names and study levels
// have not been checked against the official RTB list. Replace them with the
// real list before real students register.

import { DEPARTMENTS } from './departments';

export const OTHER = 'Other / not sure yet';

export const TRADES_BY_DEPARTMENT: Record<string, string[]> = {
  'software-development': ['Software development', 'Web development', 'Mobile application development', OTHER],
  'computer-systems': ['Computer maintenance and support', 'Software development', 'Computer systems and architecture', OTHER],
  'embedded-electronics': ['Electronics', 'Embedded systems', 'Electronics and telecommunication', OTHER],
  iot: ['Internet of Things', 'Embedded systems', 'Electronics', OTHER],
  'os-servers': ['Systems administration', 'Computer systems and architecture', 'Software development', OTHER],
  'networking-security': ['Computer networking', 'Network and cybersecurity', 'Systems administration', OTHER],
  robotics: ['Robotics and automation', 'Electronics', 'Mechatronics', OTHER],
};

export const ALL_TRADES = Array.from(new Set(Object.values(TRADES_BY_DEPARTMENT).flat()));

// Trades shown for a department. With no department chosen yet, show every trade.
export const tradesFor = (department: string): string[] => TRADES_BY_DEPARTMENT[department] ?? ALL_TRADES;

export const LEVELS = ['Level 3', 'Level 4', 'Level 5', OTHER];

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((d) => ({ id: d.id, name: d.name }));

export interface RegistrationForm {
  fullName: string;
  email: string;
  password: string;
  confirm: string;
  school: string;
  department: string;
  trade: string;
  level: string;
  consent: boolean;
}

export type RegistrationErrors = Partial<Record<keyof RegistrationForm, string>>;

export const EMPTY_FORM: RegistrationForm = {
  fullName: '',
  email: '',
  password: '',
  confirm: '',
  school: '',
  department: '',
  trade: '',
  level: '',
  consent: false,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(f: RegistrationForm): RegistrationErrors {
  const e: RegistrationErrors = {};
  if (f.fullName.trim().length < 2) e.fullName = 'Enter your full name.';
  if (!EMAIL.test(f.email.trim())) e.email = 'Enter a valid email address.';
  if (f.password.length < 8) e.password = 'Use at least 8 characters.';
  if (f.confirm !== f.password) e.confirm = 'The two passwords do not match.';
  if (f.school.trim().length < 2) e.school = 'Enter your school name.';
  if (!DEPARTMENT_OPTIONS.some((d) => d.id === f.department)) e.department = 'Choose a department.';
  if (!tradesFor(f.department).includes(f.trade)) e.trade = 'Choose a trade.';
  if (!LEVELS.includes(f.level)) e.level = 'Choose your study level.';
  if (!f.consent) e.consent = 'Please tick the box to continue.';
  return e;
}
