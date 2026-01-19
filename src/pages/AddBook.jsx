import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Plus, BookOpen, User, Calendar } from 'lucide-react';
import './BookForm.css';

function AddBook({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishYear: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="auth-required fade-in">
        <BookOpen size={64} />
        <h2>Login Required</h2>
        <p>Please login to add books to the collection</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Go to Login
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/books', {
        ...formData,
        publishYear: parseInt(formData.publishYear),
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form-page fade-in">
      <div className="book-form-container glass-card">
        <div className="form-header">
          <Plus size={40} className="form-icon" />
          <h1>Add New Book</h1>
          <p>Share a new book with the community</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label>
              <BookOpen size={16} />
              Book Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <User size={16} />
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Calendar size={16} />
              Publish Year
            </label>
            <input
              type="number"
              name="publishYear"
              value={formData.publishYear}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., 2024"
              min="1000"
              max="2024"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="loader"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBook;