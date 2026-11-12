export default function About() {
  return (
    <section className="section">
      <div className="container narrow">
        <h1>About this project</h1>
        <p>
          Rwanda TVET Tech Hub is a proposed digital platform that connects classroom learning with
          practical technical skills. It aims to bring learning materials, virtual practical
          activities, projects, assessments and progress tracking into one place for TVET students,
          teachers and schools.
        </p>
        <h2>What this prototype is</h2>
        <p>
          A first version for testing. It has three courses (Computer Systems and Maintenance,
          Software Development and Networking), each with lessons and a quiz, plus the PC
          Troubleshooting Simulator with six scenarios. Log in and registration are shown but not
          connected yet, and progress is saved only in your own browser.
        </p>
        <h2>What it is not</h2>
        <ul>
          <li>It is not an official system of the Rwanda TVET Board.</li>
          <li>It does not claim approval, partnership or endorsement from any institution.</li>
          <li>The lessons and quiz are sample content that has not yet been checked against the official curriculum.</li>
          <li>The simulator is practice only and does not replace work on real hardware.</li>
        </ul>
        <h2>Planned next</h2>
        <p>
          After teachers and students have tried the prototype and given feedback, the full platform
          would add accounts and roles, teacher dashboards, separate data for each school,
          teacher-written content, and further technical departments.
        </p>
        <h2>Give feedback</h2>
        <p>
          Tell the project team what was unclear, what was wrong and what is missing. Your feedback
          decides what is built next.
        </p>
      </div>
    </section>
  );
}
