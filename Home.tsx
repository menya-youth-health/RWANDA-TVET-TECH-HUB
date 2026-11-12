
import { Link } from 'react-router-dom';
import { COURSES, lessonsOf } from '../data/courses';

const features = [
  {
    icon: '📚',
    title: 'TVET Courses',
    description:
      'Explore technical learning materials, lessons and quizzes designed for TVET students.',
    link: '/course',
    action: 'Explore courses',
  },
  {
    icon: '🔬',
    title: 'Virtual Laboratory',
    description:
      'Practise technical troubleshooting and develop practical problem-solving skills.',
    link: '/lab',
    action: 'Enter virtual lab',
  },
  {
    icon: '📖',
    title: 'Technical Glossary',
    description:
      'Understand important technical terms from electronics, computing, networking and more.',
    link: '/glossary',
    action: 'Explore glossary',
  },
  {
    icon: '🎓',
    title: 'TVET Departments',
    description:
      'Discover different technical departments and explore the skills they teach.',
    link: '/departments',
    action: 'View departments',
  },
];

const learningSteps = [
  {
    number: '01',
    title: 'Choose your department',
    description: 'Find a technical field that matches your interests and career goals.',
  },
  {
    number: '02',
    title: 'Study the lessons',
    description: 'Learn through organised courses, explanations and learning resources.',
  },
  {
    number: '03',
    title: 'Practise your skills',
    description: 'Use practical activities and virtual troubleshooting scenarios.',
  },
  {
    number: '04',
    title: 'Test your knowledge',
    description: 'Complete quizzes and monitor your learning progress.',
  },
];

export default function Home() {
  const totalLessons = COURSES.reduce(
    (total, course) => total + lessonsOf(course).length,
    0,
  );

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <span className="eyebrow">
            Rwanda TVET Tech Hub · Learn. Practise. Innovate.
          </span>

          <h1>
            Building technical skills for a
            <span className="hero-highlight"> smarter future.</span>
          </h1>

          <p className="lead">
            Your learning space for technical and vocational education.
            Explore courses, understand technology, practise troubleshooting
            and develop the skills needed for the modern world.
          </p>

          <div className="actions">
            <Link className="btn btn-accent btn-lg" to="/register">
              Create student account
            </Link>

            <Link className="btn btn-primary btn-lg" to="/course">
              Explore courses
            </Link>

            <Link className="btn btn-outline-light btn-lg" to="/lab">
              Try virtual lab
            </Link>
          </div>

          <div className="home-trust">
            <span>✓ Technical learning</span>
            <span>✓ Practical activities</span>
            <span>✓ Skills development</span>
          </div>

          <p className="small on-dark">
            Rwanda TVET Tech Hub is an independent project and is not an
            official system of the Rwanda TVET Board.
          </p>
        </div>
      </section>

      {/* PLATFORM OVERVIEW */}
      <section className="home-stats">
        <div className="container home-stats-grid">
          <div className="home-stat">
            <strong>{COURSES.length}</strong>
            <span>Learning courses</span>
          </div>

          <div className="home-stat">
            <strong>{totalLessons}</strong>
            <span>Lessons available</span>
          </div>

          <div className="home-stat">
            <strong>24/7</strong>
            <span>Learn at your pace</span>
          </div>

          <div className="home-stat">
            <strong>TVET</strong>
            <span>Technical education</span>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="section">
        <div className="container">
          <div className="home-section-heading">
            <span className="eyebrow">Discover the platform</span>
            <h2>Everything you need to keep learning</h2>
            <p className="muted">
              Access learning resources and practical activities from one
              learning platform.
            </p>
          </div>

          <div className="grid home-feature-grid">
            {features.map((feature) => (
              <article className="card card-hover home-feature" key={feature.title}>
                <div className="home-feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <Link to={feature.link}>{feature.action} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="section section-alt">
        <div className="container">
          <div className="home-section-heading">
            <span className="eyebrow">Start learning</span>
            <h2>Explore learning courses</h2>
            <p className="muted">
              Start with a course, learn the concepts and test your understanding.
            </p>
          </div>

          {COURSES.length === 0 ? (
            <div className="notice">
              Courses will appear here when they are available.
            </div>
          ) : (
            <div className="grid">
              {COURSES.slice(0, 3).map((course) => (
                <article key={course.id} className="card card-hover">
                  <span className="badge badge-ok">Learning resource</span>

                  <h3>{course.title}</h3>

                  <p>{course.summary}</p>

                  <p className="small muted">
                    {lessonsOf(course).length} lessons · {course.quiz.length} quiz
                    questions
                  </p>

                  <Link to={`/course/${course.id}`}>
                    View course →
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="home-centered-action">
            <Link className="btn btn-primary" to="/course">
              View all courses
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div className="home-section-heading">
            <span className="eyebrow">Your learning journey</span>
            <h2>How the platform works</h2>
            <p className="muted">
              Follow a simple path from learning technical concepts to
              developing practical skills.
            </p>
          </div>

          <div className="steps home-steps">
            {learningSteps.map((step) => (
              <article className="step" key={step.number}>
                <span className="step-num">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT FEATURES */}
      <section className="section section-alt">
        <div className="container home-student-section">
          <div>
            <span className="eyebrow">For TVET students</span>
            <h2>Take control of your learning journey.</h2>

            <p className="muted">
              Create an account to access student features, follow your
              learning activities and make progress through available courses.
            </p>

            <div className="actions">
              <Link className="btn btn-accent" to="/register">
                Register now
              </Link>

              <Link className="btn btn-outline" to="/progress">
                View progress
              </Link>
            </div>
          </div>

          <div className="home-student-benefits">
            <div>
              <span>✓</span>
              Access your student account
            </div>
            <div>
              <span>✓</span>
              Explore technical learning materials
            </div>
            <div>
              <span>✓</span>
              Practise with virtual scenarios
            </div>
            <div>
              <span>✓</span>
              Follow your learning progress
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="home-final">
        <div className="container">
          <span className="eyebrow">Your future starts here</span>
          <h2>Learn today. Build tomorrow.</h2>
          <p>
            Develop your knowledge, strengthen your technical skills and
            prepare for new opportunities.
          </p>

          <Link className="btn btn-accent btn-lg" to="/register">
            Get started
          </Link>
        </div>
      </section>
    </>
  );
}
