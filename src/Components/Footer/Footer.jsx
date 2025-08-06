import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <div className="links-column">
            <h3>Фильмдер</h3>
            <Link to="/Movies">Барлық фильмдер</Link>
          </div>
          
          <div className="links-column">
            <h3>Актерлар</h3>
            <Link to="/Actors">Барлық актерлар</Link>
          </div>
          
          <div className="links-column">
            <h3>Режиссерлар</h3>
            <Link to="/Director">Барлық режиссерлар</Link>
          </div>
          
          <div className="links-column">
            <h3>Қосымша</h3>
            <Link to="/Reviewmovie">Рецензиялар</Link>
            <Link to="/Profile">Профиль</Link>
            <Link to="/login">Кіру</Link>
          </div>
        </div>
        
        <div className="footer-info">
          <p>© 2023 QazaqCinema. Барлық құқықтар қорғалған.</p>
          <p>Байланыс: info@qazaqcinema.kz</p>
        </div>
      </div>
    </footer>
  );
}