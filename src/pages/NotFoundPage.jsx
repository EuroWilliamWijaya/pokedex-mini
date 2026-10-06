import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="not-found">
      <h2>404</h2>
      <p>There's nothing here — this page doesn't exist.</p>
      <Link to="/" className="back-link">← Back to list</Link>
    </div>
  );
}

export default NotFoundPage;