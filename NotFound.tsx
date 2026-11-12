import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow">
        <h1>Page not found</h1>
        <p className="muted">That page does not exist. It may have moved.</p>
        <Link className="btn btn-primary" to="/">
          Back to the home page
        </Link>
      </div>
    </section>
  );
}
