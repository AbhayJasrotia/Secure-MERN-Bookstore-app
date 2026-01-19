import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen, User, Calendar, Edit, Trash2, ArrowLeft } from 'lucide-react';
import './BookDetails.css';

function BookDetails({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await api.get(`/books/${id}`);
      setBook(response.data.book);
    } catch (err) {
      setError('Failed to fetch book details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await api.delete(`/books/${id}`);
      navigate('/');
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader loader-large"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="error-state">
        <BookOpen size={64} />
        <h2>Book Not Found</h2>
        <p>{error || 'The book you are looking for does not exist'}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="book-details-page fade-in">
      <button onClick={() => navigate('/')} className="back-button">
        <ArrowLeft size={18} />
        Back to Books
      </button>

      <div className="book-details-container glass-card">
        <div className="book-details-cover">
          <div className="book-details-cover-gradient"></div>
          <BookOpen size={80} />
        </div>

        <div className="book-details-content">
          <h1 className="book-details-title">{book.title}</h1>

          <div className="book-details-info">
            <div className="info-item">
              <User size={20} />
              <div>
                <span className="info-label">Author</span>
                <span className="info-value">{book.author}</span>
              </div>
            </div>

            <div className="info-item">
              <Calendar size={20} />
              <div>
                <span className="info-label">Published</span>
                <span className="info-value">{book.publishYear}</span>
              </div>
            </div>
          </div>

          <div className="book-meta">
            <div className="meta-item">
              <span className="meta-label">Added on</span>
              <span className="meta-value">
                {new Date(book.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last updated</span>
              <span className="meta-value">
                {new Date(book.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {user && (
            <div className="book-details-actions">
              <Link to={`/edit-book/${book._id}`} className="btn btn-secondary">
                <Edit size={18} />
                Edit Book
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                <Trash2 size={18} />
                Delete Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;