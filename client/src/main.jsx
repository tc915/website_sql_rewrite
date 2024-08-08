import React from 'react'; // Import the React library to use React features.
import ReactDOM from 'react-dom/client'; // Import the ReactDOM library for rendering React components to the DOM.
import './index.css'; // Import the CSS file for styling the root of the application.
import { BrowserRouter as Router } from 'react-router-dom'; // Import the BrowserRouter component from react-router-dom for routing.
import App from './App.jsx'; // Import the main App component of the application.
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import the GoogleOAuthProvider component from @react-oauth/google for Google OAuth integration.

// Render the React application to the DOM.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENT_ID}> {/* Provide the Google OAuth client ID from environment variables to the provider for Google authentication. */}
      <Router> {/* Wrap the application in Router to enable routing functionality. */}
        <App /> {/* Render the main App component of the application. */}
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
