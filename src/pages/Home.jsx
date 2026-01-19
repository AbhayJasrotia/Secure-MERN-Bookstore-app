import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen, Edit, Trash2, Eye } from 'lucide-react';
import './Home.css';

function Home({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books');
      setBooks(response.data.books);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter(book => book._id !== id));
    } catch (err) {
      alert('Failed to delete book. Make sure you are logged in!');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader loader-large"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="home-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Discover Amazing Books</h1>
        <p className="page-subtitle">
          Explore our collection of {books.length} incredible books
        </p>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={64} />
          <h2>No books yet!</h2>
          <p>Be the first to add a book to our collection</p>
          {user && (
            <Link to="/add-book" className="btn btn-primary">
              Add Your First Book
            </Link>
          )}
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card glass-card">
              <div className="book-cover">
                <div className="book-cover-gradient"></div>
                <BookOpen size={48} />
              </div>
              
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-year">{book.publishYear}</p>
              </div>

              <div className="book-actions">
                <Link to={`/book/${book._id}`} className="btn-icon" title="View Details">
                  <Eye size={18} />
                </Link>
                
                {user && (
                  <>
                    <Link to={`/edit-book/${book._id}`} className="btn-icon btn-icon-edit" title="Edit">
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="btn-icon btn-icon-delete"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;