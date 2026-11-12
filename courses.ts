// All courses in one place. A course belongs to a department and has modules,
// lessons and a quiz.

import { MODULES, QUIZ, type Lesson, type Module, type Question } from './course';
import { SOD_MODULES, SOD_QUIZ } from './course-sod';
import { NET_MODULES, NET_QUIZ } from './course-networking';

export interface Course {
  id: string;
  title: string;
  departmentId: string;
  summary: string;
  modules: Module[];
  quiz: Question[];
}

export const COURSES: Course[] = [
  {
    id: 'computer-systems',
    title: 'Computer Systems and Maintenance',
    departmentId: 'computer-systems',
    summary: 'Computer parts, how a computer starts, safe maintenance and finding faults.',
    modules: MODULES,
    quiz: QUIZ,
  },
  {
    id: 'software-development',
    title: 'Software Development (SOD)',
    departmentId: 'software-development',
    summary: 'Programming basics, the web, databases and SQL, testing and version control.',
    modules: SOD_MODULES,
    quiz: SOD_QUIZ,
  },
  {
    id: 'networking',
    title: 'Networking',
    departmentId: 'networking-security',
    summary: 'Network parts, IP addressing, cabling, troubleshooting with ping and security basics.',
    modules: NET_MODULES,
    quiz: NET_QUIZ,
  },
];

export const COURSES_BY_ID: Record<string, Course> = Object.fromEntries(COURSES.map((c) => [c.id, c]));

export const lessonsOf = (c: Course): Lesson[] => c.modules.flatMap((m) => m.lessons);
