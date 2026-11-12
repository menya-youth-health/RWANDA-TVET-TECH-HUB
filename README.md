# Rwanda TVET Tech Hub: prototype

A small, working first version for testing with teachers and students. It is an **independent prototype**. It is not an official system of the Rwanda TVET Board and it carries no RTB approval, partnership or endorsement.

## What is in it

- Home with a **Start** button (registration) and **Log in** / **Register** buttons at the top right
- Log in and Register pages: full forms with checking (not connected to Supabase yet, nothing is saved or sent)
- **Departments**: a detail page for each of seven departments. Computer Systems and Maintenance, Software Development (SOD) and Networking have courses. Open to everyone.
- **Courses**: Computer Systems and Maintenance (4 lessons, 8 questions), Software Development (6 lessons, 9 questions) and Networking (6 lessons, 9 questions). Each has "mark as complete", a progress bar and a quiz that marks itself and explains every answer.
- The **PC Troubleshooting Simulator**: 6 scenarios with scoring for diagnosis, repair, safety, efficiency and unnecessary replacements
- Glossary (searchable technical terms), My progress, About
- Works on phones, uses system fonts only (light on slow connections)

## What is NOT in it (on purpose)

No working accounts yet, no admin dashboard, no school data, no server. Progress is saved only in the browser on the same device. The other departments (electronics, IoT, operating systems, robotics), offline sync and certificates are planned for the full platform.

## Footer logo

Put your company logo in the `public` folder and name it `moses-tech-logo.png`. It appears in the footer next to "Developed by MOSES TECH COMPANY". If the file is missing, only the text shows.

## Supabase

The project is connected to Supabase through `src/lib/supabase.js`. Copy `.env.example` to `.env.local` and put your own project URL and publishable key in it. `.env.local` is ignored by Git and must never be committed. The Log in and Register forms are not wired to Supabase yet.

## Run it in VS Code

1. Install **Node.js** (the LTS version) from https://nodejs.org and **VS Code** from https://code.visualstudio.com.
2. Unzip this project. In VS Code choose **File > Open Folder** and open the project folder.
3. Open a terminal: **Terminal > New Terminal**.
4. Install the packages (needs internet, only the first time):
   ```
   npm install
   ```
5. Start the site:
   ```
   npm run dev
   ```
   Open the address it prints (usually http://localhost:5173) in your browser.

## Other commands

| Command | What it does |
| --- | --- |
| `npm test` | Runs the simulator tests (safety rules, scoring, scenario data) |
| `npm run build` | Checks the code and builds the site into the `dist` folder |
| `npm run preview` | Shows the built site locally |

To put the site online, upload the contents of the `dist` folder to any static website host.

## Where to change things

| To change | Edit this file |
| --- | --- |
| Computer Systems lessons and quiz | `src/data/course.ts` |
| Software Development lessons and quiz | `src/data/course-sod.ts` |
| Networking lessons and quiz | `src/data/course-networking.ts` |
| Which courses exist | `src/data/courses.ts` |
| Department pages (topics, skills, tools, safety) | `src/data/departments.ts` |
| Glossary terms | `src/data/glossary.ts` |
| Simulator scenarios and actions | `src/data/scenarios.ts` |
| How the simulator works and is scored | `src/lab/engine.ts` |
| Registration form choices (trades, levels) and rules | `src/data/registration.ts` |
| Colours and layout | `src/styles.css` |

To add a simulator scenario, copy an existing one in `src/data/scenarios.ts`, change the text, and run `npm test`. The tests check that every action you mention exists.

## Important before real classroom use

- The lessons, quiz questions and scenarios are **sample content**. They do not follow the official RTB module list. Replace the placeholder module titles with the real ones and have a **qualified teacher check every lesson, question and scenario**.
- Do not describe this as an official or approved platform. It is an independent project, and the About page says so.
- The Log in and Register forms do not store or send anything yet. Do not collect real student data until accounts, privacy rules and database security are finished.
- The trade names and study levels in the form are drafts, not the official RTB list.

## Next steps

After teachers and students have tried it and given feedback, build the full platform (accounts and roles, teacher dashboards, separate data for each school) in stages. Keep the code in Git and commit after each working change.
