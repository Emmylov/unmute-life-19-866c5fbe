
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route"
    );

    // Set a timeout to redirect to home feed after 3 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/home");
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-indigo-600 drop-shadow-md">404</h1>
        <p className="text-xl text-gray-700 mb-6 drop-shadow-sm">Oops! This page doesn't exist</p>
        <p className="text-sm text-gray-600 mb-8">Redirecting you to the home feed in a few seconds...</p>
        <Link 
          to="/home" 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
        >
          Go to Home Feed Now
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
