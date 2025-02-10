import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-base-200">
      <section className="hero min-h-screen bg-gradient-to-r from-blue-500 to-green-500 md:bg-gradient-to-b md:from-red-500 md:to-yellow-500">
        {/* Overlay for better text contrast */}
        <div className="hero-overlay bg-opacity-60 bg-black"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Discover Amazing Events</h1>
            <p className="mb-5 text-lg">
              Join our community to explore, share, and enjoy unforgettable
              experiences. Whether you're looking for fun, networking, or
              inspiration, we've got you covered!
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Link to="/login" className="btn btn-primary  font-semibold">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary  font-semibold">
                Register
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
