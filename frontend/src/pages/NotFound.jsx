import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page centered">
    <div className="not-found">
      <h1>404</h1>
      <p>Oops, this page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  </div>
);

export default NotFound;
