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

  if (authenticated) {
    return <App />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter Password:
        <input type="password" value={password} onChange={handlePasswordChange} autoComplete="no"/>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Auth;
