import React, { useContext, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';

export const LoginSignup = () => {
  const { login, signup, error } = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    signup(username, email, password);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div>
      <h2>{isLoginMode ? 'Login' : 'Signup'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={isLoginMode ? handleLogin : handleSignup}>
        {!isLoginMode && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLoginMode ? 'Login' : 'Signup'}</button>
      </form>
      <button onClick={toggleMode}>
        {isLoginMode ? 'Switch to Signup' : 'Switch to Login'}
      </button>
    </div>
  );
};