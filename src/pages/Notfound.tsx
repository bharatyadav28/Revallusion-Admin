import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-6xl font-extrabold text-center mb-4">404</h1>
      <p className="text-xl mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 text-lg font-semibold text-white bg-[var(--lightpurple)] rounded-lg hover:bg-[var(--softpurple)] transition duration-200"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
