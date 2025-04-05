
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-unmute-purple/10 to-unmute-pink/10 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold mb-4 unmute-gradient-text">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! This page doesn't exist</p>
        <p className="text-sm text-gray-500 mb-8">Redirecting you to the home feed in a few seconds...</p>
        <Link 
          to="/home" 
          className="unmute-primary-button inline-block"
        >
          Go to Home Feed Now
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
