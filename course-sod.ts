// Software Development (SOD) course for the prototype.
//
// IMPORTANT: SAMPLE / PLACEHOLDER content. It does not follow the official RTB
// module list. Have a qualified teacher check every lesson and quiz question.

import type { Module, Question } from './course';

export const SOD_MODULES: Module[] = [
  {
    id: 'sod-m1',
    title: 'Programming fundamentals',
    placeholder: true,
    lessons: [
      {
        id: 'what-is-software-development',
        title: 'What is software development?',
        minutes: 8,
        objectives: [
          'Describe what a software developer does',
          'Name the main stages of building software',
          'Explain what a bug is',
        ],
        blocks: [
          {
            type: 'p',
            text: 'Software development is the work of planning, writing, testing and maintaining programs that solve a problem for people. A developer turns a need, for example "a school wants to record student marks", into software that works reliably.',
          },
          { type: 'h', text: 'The main stages' },
          {
            type: 'ol',
            items: [
              'Requirements: find out what the users need.',
              'Design: plan how the program is organised and what screens it needs.',
              'Implementation: write the code.',
              'Testing: check that it works and look for bugs.',
              'Deployment: make it available to users.',
              'Maintenance: fix problems and add improvements over time.',
            ],
          },
          {
            type: 'p',
            text: 'A bug is a mistake in a program that makes it behave in a way nobody intended. Finding and fixing bugs is called debugging.',
          },
          { type: 'h', text: 'Habits of a good developer' },
          {
            type: 'ul',
            items: [
              'Break a big problem into small steps.',
              'Write clear code that other people can read.',
              'Test your own work before sharing it.',
              'Keep learning, because tools change quickly.',
            ],
          },
        ],
      },
      {
        id: 'variables-and-decisions',
        title: 'Variables and decisions',
        minutes: 12,
        objectives: [
          'Explain what a variable is',
          'Tell numbers, text and true/false values apart',
          'Read a simple if statement',
        ],
        blocks: [
          {
            type: 'p',
            text: 'A variable is a named place in memory where a program keeps a value. The three types you meet first are numbers (17 or 3.5), text, also called strings ("Kigali"), and booleans, which are either true or false.',
          },
          {
            type: 'code',
            text: 'let name = "Aline";\nlet marks = 72;\nlet passed = marks >= 50;',
          },
          {
            type: 'p',
            text: 'The last line compares two numbers and stores the answer, true or false, in the variable passed. A decision lets a program choose what to do next.',
          },
          {
            type: 'code',
            text: 'if (marks >= 50) {\n  console.log("Pass");\n} else {\n  console.log("Try again");\n}',
          },
          {
            type: 'p',
            text: 'These examples use JavaScript, but the same ideas exist in Python, Java, C# and PHP. Only the spelling of the instructions, called the syntax, changes.',
          },
        ],
      },
      {
        id: 'loops-and-functions',
        title: 'Loops and functions',
        minutes: 12,
        objectives: [
          'Explain what a loop does',
          'Explain why programmers use functions',
          'Read a short function',
        ],
        blocks: [
          {
            type: 'p',
            text: 'A loop repeats a set of steps. This loop runs three times and prints a line each time:',
          },
          {
            type: 'code',
            text: 'for (let i = 1; i <= 3; i++) {\n  console.log("Student " + i);\n}',
          },
          {
            type: 'p',
            text: 'A function is a named block of code that you can run whenever you need it. It can take inputs, called parameters, and give back a result.',
          },
          {
            type: 'code',
            text: 'function average(a, b) {\n  return (a + b) / 2;\n}\n\nconsole.log(average(60, 80)); // prints 70',
          },
          { type: 'h', text: 'Why use functions?' },
          {
            type: 'ul',
            items: [
              'You write the steps once and reuse them.',
              'Small functions are easier to test.',
              'Good names make the program easier to read.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'sod-m2',
    title: 'Web, data and teamwork',
    placeholder: true,
    lessons: [
      {
        id: 'web-basics',
        title: 'Web basics: HTML, CSS and JavaScript',
        minutes: 10,
        objectives: [
          'Say what HTML, CSS and JavaScript each do',
          'Explain what a browser and a server do',
        ],
        blocks: [
          {
            type: 'p',
            text: 'When you open a website, your browser asks a server for the page. The server sends back files, and the browser shows them. Three languages work together to build most pages:',
          },
          {
            type: 'ul',
            items: [
              'HTML gives the page its structure and content: headings, paragraphs, images and buttons.',
              'CSS controls how the page looks: colours, spacing and layout.',
              'JavaScript makes the page react to the user: clicks, forms and live updates.',
            ],
          },
          { type: 'code', text: '<h1>Welcome</h1>\n<p>This is a paragraph.</p>\n<button>Click me</button>' },
          { type: 'p', text: 'CSS then styles those elements, for example:' },
          { type: 'code', text: 'h1 {\n  color: darkblue;\n}' },
        ],
      },
      {
        id: 'databases-and-sql',
        title: 'Databases and SQL basics',
        minutes: 12,
        objectives: [
          'Explain tables, rows and columns',
          'Read a simple SELECT statement',
          'Explain why UPDATE and DELETE need a WHERE clause',
        ],
        blocks: [
          {
            type: 'p',
            text: 'A database stores data in an organised way. In a relational database the data sits in tables. Each row is one record, such as one student, and each column is one field, such as name or level. A primary key is a field that is different for every row, so each record can be found exactly.',
          },
          { type: 'p', text: 'SQL is the language used to ask a database for data:' },
          { type: 'code', text: 'SELECT name, level FROM students WHERE level = 4;' },
          {
            type: 'ul',
            items: [
              'SELECT reads data.',
              'INSERT adds a new row.',
              'UPDATE changes existing rows.',
              'DELETE removes rows.',
            ],
          },
          {
            type: 'p',
            text: 'Always use WHERE with UPDATE and DELETE. Without it, the command changes or removes every row in the table. Never store passwords as plain text; store a protected form of them instead.',
          },
        ],
      },
      {
        id: 'testing-and-git',
        title: 'Testing and version control with Git',
        minutes: 10,
        objectives: [
          'Explain why software is tested',
          'Explain what a Git commit is',
        ],
        blocks: [
          {
            type: 'p',
            text: 'Testing checks that a program does what it should. You can test by hand, by trying the program yourself, or with automated tests, which are small programs that check other code. A unit test checks one small piece, such as one function.',
          },
          {
            type: 'p',
            text: 'Version control records the history of your code. Git is the most widely used tool for this. A repository holds your project and its history. A commit saves a snapshot of your changes with a message that says what you did. A branch lets you work on a change without disturbing the main version.',
          },
          { type: 'code', text: 'git add .\ngit commit -m "Add the login page"' },
          {
            type: 'ul',
            items: [
              'Commit often, in small steps.',
              'Write messages that explain the change.',
              'Never commit passwords or secret keys.',
            ],
          },
        ],
      },
    ],
  },
];

export const SOD_QUIZ: Question[] = [
  {
    id: 's1',
    prompt: 'Which stage comes right after the code has been written?',
    options: ['Testing', 'Requirements', 'Design', 'Maintenance'],
    correct: 0,
    explanation: 'After implementation, the software is tested to find bugs before it is deployed.',
  },
  {
    id: 's2',
    prompt: 'What is a bug?',
    options: [
      'A mistake in a program that makes it behave in an unintended way',
      'A fast computer processor',
      'A type of database',
      'A tool for saving code',
    ],
    correct: 0,
    explanation: 'A bug is a mistake in a program. Fixing bugs is called debugging.',
  },
  {
    id: 's3',
    prompt: 'Which type of value can only be true or false?',
    options: ['Number', 'Text (string)', 'Boolean', 'Loop'],
    correct: 2,
    explanation: 'A boolean has exactly two possible values: true and false.',
  },
  {
    id: 's4',
    prompt: 'The variable marks is 40. What does the code below print?\n\nif (marks >= 50) { print "Pass" } else { print "Try again" }',
    options: ['Pass', 'Try again', 'Nothing', 'An error'],
    correct: 1,
    explanation: '40 is not greater than or equal to 50, so the else part runs.',
  },
  {
    id: 's5',
    prompt: 'What is a function?',
    options: [
      'A named block of code that can be reused',
      'A table in a database',
      'A mistake in a program',
      'A web browser',
    ],
    correct: 0,
    explanation: 'A function is a named, reusable block of code that can take inputs and return a result.',
  },
  {
    id: 's6',
    prompt: 'Which language makes a web page react to clicks and user input?',
    options: ['HTML', 'CSS', 'JavaScript', 'SQL'],
    correct: 2,
    explanation: 'HTML gives structure, CSS gives appearance and JavaScript gives behaviour.',
  },
  {
    id: 's7',
    prompt: 'Which SQL command reads data from a table?',
    options: ['SELECT', 'INSERT', 'DELETE', 'UPDATE'],
    correct: 0,
    explanation: 'SELECT reads data. INSERT adds rows, UPDATE changes rows and DELETE removes rows.',
  },
  {
    id: 's8',
    prompt: 'True or false: it is safe to run UPDATE or DELETE without a WHERE clause.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'Without WHERE, the command affects every row in the table.',
  },
  {
    id: 's9',
    prompt: 'What does a Git commit do?',
    options: [
      'Saves a snapshot of your changes with a message',
      'Deletes the project',
      'Makes the website faster',
      'Starts the database',
    ],
    correct: 0,
    explanation: 'A commit records a snapshot of your work so you can return to it later.',
  },
];
