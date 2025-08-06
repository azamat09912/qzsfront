import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import img from '../../assets/QazaqCinema.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Инициализация темы из localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Приоритет: localStorage > системные настройки > светлая тема по умолчанию
    const initialTheme = savedTheme 
      ? savedTheme === 'dark'
      : prefersDark;
    
    setIsDarkTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  // Применение темы при изменении
  useEffect(() => {
    if (!isInitialized) return;
    
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkTheme, isInitialized]);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (!isInitialized) {
    return null; // или лоадер, чтобы избежать мерцания
  }

  return (
    <header className="header">
      <div className="logo-section">
        <Link to="/" className="logo-link">
          <img src={img} alt="QazaqCinema Logo" className="logo-img" />
        </Link> 
      </div>

      <div className={`nav-container ${menuOpen ? 'open' : ''}`}>
        <nav className="nav">
          <Link to="/Movies" onClick={() => setMenuOpen(false)}>Фильмдер</Link>
          <Link to="/Actors" onClick={() => setMenuOpen(false)}>Актерлар</Link>
          <Link to="/Director" onClick={() => setMenuOpen(false)}>Режиссерлар</Link>
          <Link to="/Reviewmovie" onClick={() => setMenuOpen(false)}>Рецензия</Link>
          <Link to="/Profile" onClick={() => setMenuOpen(false)}>Профиль</Link>
        </nav>
        <Link to="/login" className="login-button" onClick={() => setMenuOpen(false)}>Кіру</Link>
      </div>

      <button 
        className={`burger ${menuOpen ? 'open' : ''}`} 
        onClick={toggleMenu}
        aria-label="Меню"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <button 
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Переключить тему"
      >
        {isDarkTheme ? '🌞 Светлая тема' : '🌙 Тёмная тема'}
      </button>
    </header>
  );
}