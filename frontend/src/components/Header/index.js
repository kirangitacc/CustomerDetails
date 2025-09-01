import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const hideNav = location.pathname === '/' || location.pathname === '/register';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <header className="header">
      <div className="logo"> CS</div>

      {!hideNav && isLoggedIn && (
        <>
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? '✖' : '☰'}
          </button>

          <nav className={`nav-buttons ${menuOpen ? 'open' : ''}`}>
            <button onClick={() => { navigate('/customers'); setMenuOpen(false); }}>Home</button>
            <button onClick={() => { navigate('/customers/new'); setMenuOpen(false); }}>Create customer</button>
            <button onClick={() => { navigate('/profile'); setMenuOpen(false); }}>Profile</button>
            <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header;
