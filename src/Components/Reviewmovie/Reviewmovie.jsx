import React, { useState, useEffect } from 'react';
import './ReviewMovies.css'; 

export default function ReviewMovies() {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('dark-theme');
  };

  const formatDateRelative = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'только что';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} ${getNoun(diffInMinutes, 'минуту', 'минуты', 'минут')} назад`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${getNoun(diffInHours, 'час', 'часа', 'часов')} назад`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ${getNoun(diffInDays, 'день', 'дня', 'дней')} назад`;
    
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getNoun = (number, one, two, five) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) return five;
    n %= 10;
    if (n === 1) return one;
    if (n >= 2 && n <= 4) return two;
    return five;
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews/all');
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Ошибка загрузки рецензий:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
    // Проверяем предпочтения пользователя
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  // Отправка отзыва
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!review.trim()) {
      setMessage('Рецензия не может быть пустой.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://qazaqcinema.onrender.com/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ review, rating: Number(rating) }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Рецензия успешно отправлена!');
        setReview('');
        setRating(5);
        fetchReviews();
      } else {
        setMessage(data.message || '❌ Ошибка при отправке рецензии.');
      }
    } catch {
      setMessage('❌ Сервер недоступен.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Удаление всех отзывов
  const handleDeleteAll = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить все рецензии? Это действие необратимо.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://qazaqcinema.onrender.com/api/reviews/all', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        setMessage('Все рецензии удалены');
        fetchReviews();
      } else {
        const data = await response.json();
        setMessage(data.message || 'Ошибка при удалении рецензий');
      }
    } catch {
      setMessage('Ошибка сервера при удалении');
    }
  };

  // Компонент звездного рейтинга
  const StarRating = ({ value, onChange }) => {
    const stars = Array.from({ length: 10 }, (_, i) => i + 1);
    
    return (
      <div className="star-rating">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`star ${star <= value ? 'active' : ''}`}
          >
            {star <= value ? '★' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="review-container">
      

      <h2 className="review-title">Оставить рецензию</h2>
      
      <form onSubmit={handleSubmit} className="review-form">
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Напишите вашу рецензию здесь..."
          required
          rows={5}
          className="review-textarea"
        />
        
        <div className="rating-container">
          <label className="rating-label">
            Ваша оценка: <span className="rating-value">{rating}</span>/10
          </label>
          <StarRating value={rating} onChange={setRating} />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
        >
          {isSubmitting ? (
            <span className="submit-loading">
              <span className="loading-icon">⏳</span> Отправка...
            </span>
          ) : (
            '📝 Отправить рецензию'
          )}
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

   

      <div className="reviews-section">
        <h3 className="reviews-title">Отзывы пользователей</h3>
        
        {reviews.length === 0 ? (
          <div className="no-reviews">
            Пока нет отзывов. Будьте первым!
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((r) => (
              <div key={r.id} className="review-card">
                <div className="review-header">
                  <div className="avatar-wrapper">
                    <img
                      src={r.avatar || '/default-avatar.png'}
                      alt="Аватар"
                      className="review-avatar"
                      onLoad={(e) => e.target.classList.add('loaded')}
                    />
                  </div>
                  <div className="review-user">
                    <h4 className="user-name">
                      {r.name || 'Анонимный пользователь'}
                    </h4>
                    <small className="review-date">
                      {formatDateRelative(r.created_at)}
                    </small>
                  </div>
                </div>
                
                <div className="review-rating">
                  {'★'.repeat(Math.round(r.rating))}
                  {'☆'.repeat(10 - Math.round(r.rating))}
                  <span className="rating-text">
                    {r.rating}/10
                  </span>
                </div>
                
                <p className="review-content">
                  {r.review}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}