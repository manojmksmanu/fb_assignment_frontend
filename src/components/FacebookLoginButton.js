// components/FacebookLoginButton.js
import React from "react";
import FacebookLogin from "@greatsumini/react-facebook-login";

const FacebookLoginButton = ({ onSuccess, onError }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow-sm p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-10">
        Welcome to FB Insights Dashboard
      </h1>
      <FacebookLogin
        appId="914299164196328"
        onSuccess={onSuccess}
        onFail={(error) => onError(error.message)}
        scope="public_profile,email,pages_show_list,pages_read_engagement,read_insights"
        render={({ onClick }) => (
          <button
            onClick={onClick}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login with Facebook
          </button>
        )}
      />
    </div>
  );
};

export default FacebookLoginButton;
