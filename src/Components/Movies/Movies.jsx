import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Movies.css';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false); // для скрытия логотипа
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Загрузка фильмов
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://qazaqcinema.onrender.com/api/fvmovies?search=${encodeURIComponent(search)}&genre=${encodeURIComponent(selectedGenre)}`
        );
        if (!response.ok) throw new Error('Фильмдерді жүктеу кезінде қате пайда болды');
        const data = await response.json();
        setMovies(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMovies, 500);
    return () => clearTimeout(debounceTimer);
  }, [search, selectedGenre]);

  // Загрузка избранных
  useEffect(() => {
    if (!token) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch('https://qazaqcinema.onrender.com/api/fvmovies/favoritemovies', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Таңдаулыларды жүктеу кезінде қате пайда болды');
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavorites();
  }, [token]);

  const toggleFavorite = async (movie) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const isFav = favorites.some((fav) => fav.id === movie.id);

      if (isFav) {
        await fetch(`https://qazaqcinema.onrender.com/api/fvmovies/favoritemovies/${movie.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter((fav) => fav.id !== movie.id));
      } else {
        await fetch('https://qazaqcinema.onrender.com/api/fvmovies/favoritemovies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ movieId: movie.id }),
        });
        setFavorites([...favorites, movie]);
      }
    } catch (error) {
      console.error('Қате:', error);
      alert('Қате пайда болды. Қайталап көріңіз.');
    }
  };

  const filteredFavorites = favorites.filter((movie) => {
  const matchesGenre = selectedGenre
    ? movie.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
    : true;

  const matchesSearch = search
    ? movie.title?.toLowerCase().includes(search.toLowerCase())
    : true;

  return matchesGenre && matchesSearch;
});

const moviesToShow = showFavorites ? filteredFavorites : movies;



  return (
    <div className="movies-container">
      <h1>Қазақ Фильмдері</h1>

      <div className="controls">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`toggle-btn ${showFavorites ? 'active' : ''}`}
        >
          {showFavorites ? '← Барлық фильмдер' : 'Таңдаулылар'}
        </button>

        {/* Поисковая строка с логотипом */}
        <div className="search-wrapper">
          {!isFocused && (
            <img src="https://cdn-icons-png.freepik.com/512/9135/9135995.png" alt="search" className="search-logo" />
          )}
          <input
            type="text"
            placeholder=""
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              if (search === '') setIsFocused(false);
            }}
          />
        </div>

        <select
          className="genre-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value=""> Барлық жанрлар</option>
          <option value="Комедия">Комедия</option>
          <option value="Драма">Драма</option>
          <option value="Хоррор">Хоррор</option>
          <option value="Боевик">Боевик</option>
          <option value="Мелодрама">Мелодрама</option>
          <option value="Биография">Биография</option>
          <option value="Триллер">Триллер</option>
          <option value="Криминальная драма">Криминальная драма</option>
          <option value="Исторический">Исторический</option>
          <option value="Историческая драма">Историческая драма</option>
        </select>
      </div>

      {isLoading && <div className="loader">Жүктелуде...</div>}
      {error && <div className="error">{error}</div>}

      <div className="movies-grid">
        {moviesToShow.length === 0 && !isLoading && (
          <p className="no-movies">Фильмдер табылмады</p>
        )}

        {moviesToShow.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={movie.image}
              alt={movie.title}
              onClick={() => window.open(movie.youtubeUrl, '_blank')}
              className="movie-poster"
            />
            <h3>{movie.title}</h3>
            {'year' in movie && <p>Жыл: {movie.year}</p>}
            {'rating' in movie && <p>Рейтинг: {movie.rating}</p>}
            <button
              onClick={() => toggleFavorite(movie)}
              className={`fav-btn ${favorites.some((fav) => fav.id === movie.id) ? 'favorited' : ''}`}
              aria-label="Таңдаулыға қосу"
              title="Таңдаулыға қосу"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={favorites.some((fav) => fav.id === movie.id) ? 'red' : 'none'}
                stroke={favorites.some((fav) => fav.id === movie.id) ? 'red' : 'gray'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="24"
                height="24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
