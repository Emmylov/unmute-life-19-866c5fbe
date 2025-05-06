
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route"
    );

    // Set a timeout to redirect to home feed after 5 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-6">
      <div className="text-center max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/40">
        <h1 className="text-6xl font-bold mb-4 text-indigo-600 drop-shadow-md">404</h1>
        <p className="text-xl text-gray-700 mb-6 drop-shadow-sm">Page Not Found</p>
        <p className="text-sm text-gray-600 mb-8">Redirecting you to the home page in 5 seconds...</p>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Link 
            to="/" 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            Go to Home Now
          </Link>
          
          <Link 
            to="/story" 
            className="bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            Try the Interactive Story
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
