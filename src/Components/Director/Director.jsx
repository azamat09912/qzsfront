import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Director.css';

export default function Directors() {
  const [directors, setDirectors] = useState([]);
  const [favoriteDirectors, setFavoriteDirectors] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Загрузка всех режиссёров
  useEffect(() => {
    const fetchDirectors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://qazaqcinema.onrender.com/api/directors?search=${encodeURIComponent(search)}`);
        if (!response.ok) throw new Error('Режиссерлерді жүктеу кезінде қате пайда болды');
        const data = await response.json();
        setDirectors(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchDirectors, 500);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  // Загрузка избранных режиссёров
  useEffect(() => {
    if (!token) return;

    const fetchFavoriteDirectors = async () => {
      try {
        const response = await fetch('https://qazaqcinema.onrender.com/api/directors/favoritedirectors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFavoriteDirectors(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavoriteDirectors();
  }, [token]);

  // Добавить/удалить из избранного
  const toggleFavoriteDirector = async (director) => {
    if (!token) {
      navigate('/login');
      return;
    }

    const isFav = favoriteDirectors.some((fav) => fav.id === director.id);

    try {
      if (isFav) {
        await fetch(`https://qazaqcinema.onrender.com/api/directors/favoritedirectors/${director.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoriteDirectors(favoriteDirectors.filter((fav) => fav.id !== director.id));
      } else {
        await fetch('https://qazaqcinema.onrender.com/api/directors/favoritedirectors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ directorId: director.id }),
        });
        setFavoriteDirectors([...favoriteDirectors, director]);
      }
    } catch (error) {
      console.error('Қате:', error);
      alert('Қате пайда болды. Қайталап көріңіз.');
    }
  };

  const filteredFavorites = favoriteDirectors.filter((director) => {
    const matchesSearch = search
      ? director.name?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesSearch;
  });

  const sortDirectorsByName = (list) => {
    return [...list].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name, 'kk');
      } else {
        return b.name.localeCompare(a.name, 'kk');
      }
    });
  };

  const filtered = showFavorites ? filteredFavorites : directors;
  const directorsToShow = sortDirectorsByName(filtered);

  return (
    <div className="directors-container">
      <h1>Қазақ Режиссерлері</h1>

      <div className="controls">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`toggle-btn ${showFavorites ? 'active' : ''}`}
        >
          {showFavorites ? '← Барлық режиссерлер' : 'Таңдаулылар'}
        </button>

        <div className="sort-wrapper">
          <label htmlFor="sortOrder">Сұрыптау:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="asc">А-дан Я-ға</option>
            <option value="desc">Я-дан А-ға</option>
          </select>
        </div>

        <div className="search-wrapper">
          {!isFocused && (
            <img src="https://cdn-icons-png.freepik.com/512/9135/9135995.png" alt="search" className="search-logo" />
          )}
          <input
            type="text"
            placeholder="Іздеу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              if (search === '') setIsFocused(false);
            }}
          />
        </div>
      </div>

      {isLoading && <div className="loader">Жүктелуде...</div>}
      {error && <div className="error">{error}</div>}

      <div className="directors-grid">
        {directorsToShow.length === 0 && !isLoading && (
          <p className="no-directors">Режиссерлер табылмады</p>
        )}

        {directorsToShow.map((director) => (
          <div key={director.id} className="director-card">
            <img
              src={director.image}
              alt={director.name}
              className="director-photo"
            />
            <h3>{director.name}</h3>
            <p className="director-bio">{director.bio}</p>
            <p className="director-birthyear">Туылған жылы: {director.birthyear}</p>
            <button
              onClick={() => toggleFavoriteDirector(director)}
              className={`fav-btn ${favoriteDirectors.some((fav) => fav.id === director.id) ? 'favorited' : ''}`}
              aria-label="Таңдаулыға қосу"
              title="Таңдаулыға қосу"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={favoriteDirectors.some((fav) => fav.id === director.id) ? 'red' : 'none'}
                stroke={favoriteDirectors.some((fav) => fav.id === director.id) ? 'red' : 'currentColor'}
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