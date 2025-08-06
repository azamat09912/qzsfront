import React, { useState, useEffect } from 'react';
import './ReviewMovies.css';

export default function ReviewMovies() {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch('https://qazaqcinema.onrender.com/api/reviews/all');
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review) return;

    setIsSubmitting(true);
    try {
      await fetch('https://qazaqcinema.onrender.com/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review, rating }),
      });
      setReview('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://qazaqcinema.onrender.com/api/reviews/${id}`, {
        method: 'DELETE',
      });
      fetchReviews();
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error.message);
    }
  };

  return (
    <div className="review-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Оставьте отзыв..."
        />
        <input
          type="number"
          value={rating}
          min="1"
          max="5"
          onChange={(e) => setRating(e.target.value)}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Оставить отзыв'}
        </button>
      </form>

      <div className="review-list">
        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <p>{r.review}</p>
            <small>Оценка: {r.rating}</small>
            <button onClick={() => handleDelete(r.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
