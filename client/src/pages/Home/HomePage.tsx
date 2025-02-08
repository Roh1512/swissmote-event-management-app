import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main>
      <section className="min-h-80 bg-base-200">
        <h1>Hero Section</h1>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </section>
    </main>
  );
};

export default HomePage;
