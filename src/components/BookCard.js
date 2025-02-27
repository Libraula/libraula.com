import React from 'react';
import { FiPlus } from 'react-icons/fi';
import '../styles/bookCard.css';

const BookCard = ({ book, handleBookClick, handleAddToQueue }) => {
  return (
    <div className="modern-book-card" onClick={() => handleBookClick(book)}>
      <div className="card-image-container">
        <img src={book.img || "https://placehold.co/400x600"} alt={book.title} loading="lazy" />
        <div className="card-overlay">
          <button
            className="plus-button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToQueue(book);
            }}
          >
            <FiPlus />
          </button>
        </div>
        <div className="card-text-overlay">
          <h3>{book.title}</h3>
          <div className="book-meta">
            <span>{book.author || 'Unknown'}</span>
            <span>{book.pages || 'N/A'} pages</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;