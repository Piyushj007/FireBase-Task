import React, { useState } from "react";
import App from './App.jsx';

const Auth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const authenticate = () => {
    if (password === import.meta.env.VITE_masterKey) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticate();
  };

  // If authenticated is true, render the App component
  if (authenticated) {
    return <App />;
  }

  // If not authenticated, render the authentication form
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Auth;
