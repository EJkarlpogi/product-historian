
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const AuthPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(true);
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:flex flex-col space-y-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-primary">Product Historian</h1>
              <p className="text-xl text-gray-600 mt-2">
                Track your product changes over time with our powerful management system
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Comprehensive product version history</span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Secure product management dashboard</span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span>Detailed change logs and reports</span>
                </li>
              </ul>
            </div>
          </div>
          <div>
            {showLogin ? (
              <LoginForm 
                onSwitchToSignup={() => setShowLogin(false)} 
              />
            ) : (
              <SignupForm 
                onSwitchToLogin={() => setShowLogin(true)} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
