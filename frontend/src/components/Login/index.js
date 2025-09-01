import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import './index.css';
import Header from '../Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://customerdetails-ctv2.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('token', data.jwtToken);

      localStorage.setItem('user_id', data.userId);
      navigate('/customers');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <>
    <Header />
    <div className="login-container">
      

      <form onSubmit={handleLogin} className="login-form">
        <p className="welcome-message">
         Welcome to <strong>CustomerService</strong>! If you're already registered, please log in below.  
         New here? <span className="register-link" onClick={() => navigate('/register')}>Register now</span>
      </p>
        <label>EMAIL</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>PASSWORD</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? <ClipLoader size={20} color="#fff" /> : 'Login'}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={handleRegisterRedirect}
          >
            Register
          </button>
        </div>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  </>
  );
};

export default Login;
