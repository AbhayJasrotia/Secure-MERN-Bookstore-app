import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, LogIn, LogOut, UserPlus } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <BookOpen size={28} />
          <span>BookStore</span>
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <span className="navbar-user">
                Hey, {user.username}!
              </span>
              <Link to="/add-book" className="btn btn-primary">
                <Plus size={18} />
                Add Book
              </Link>
              <button onClick={handleLogout} className="btn btn-outline">
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                <UserPlus size={18} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;