import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { Edit, BookOpen, User, Calendar } from 'lucide-react';
import './BookForm.css';

function EditBook({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishYear: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}`);
      const book = response.data.book;
      setFormData({
        title: book.title,
        author: book.author,
        publishYear: book.publishYear.toString(),
      });
    } catch (err) {
      setError('Failed to fetch book details');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-required fade-in">
        <BookOpen size={64} />
        <h2>Login Required</h2>
        <p>Please login to edit books</p>
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
    setSubmitting(true);

    try {
      await api.put(`/books/${id}`, {
        ...formData,
        publishYear: parseInt(formData.publishYear),
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader loader-large"></div>
      </div>
    );
  }

  return (
    <div className="book-form-page fade-in">
      <div className="book-form-container glass-card">
        <div className="form-header">
          <Edit size={40} className="form-icon" />
          <h1>Edit Book</h1>
          <p>Update book information</p>
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
            <button type="submit" className="btn btn-secondary" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="loader"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Edit size={18} />
                  Update Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBook;