import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Actors.css'; // Используем CSS от Director

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [favoriteActors, setFavoriteActors] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://qazaqcinema.onrender.com/api/actors?search=${encodeURIComponent(search)}`);
        if (!response.ok) throw new Error('Актерлерді жүктеу кезінде қате пайда болды');
        const data = await response.json();
        setActors(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchActors, 500);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  useEffect(() => {
    if (!token) return;

    const fetchFavoriteActors = async () => {
      try {
        const response = await fetch('https://qazaqcinema.onrender.com/api/actors/favoriteactors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFavoriteActors(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavoriteActors();
  }, [token]);

  const toggleFavoriteActor = async (actor) => {
    if (!token) {
      navigate('/login');
      return;
    }

    const isFav = favoriteActors.some((fav) => fav.id === actor.id);

    try {
      if (isFav) {
        await fetch(`https://qazaqcinema.onrender.com/api/actors/favoriteactors/${actor.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoriteActors(favoriteActors.filter((fav) => fav.id !== actor.id));
      } else {
        await fetch('https://qazaqcinema.onrender.com/api/actors/favoriteactors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ actorId: actor.id }),
        });
        setFavoriteActors([...favoriteActors, actor]);
      }
    } catch (error) {
      console.error('Қате:', error);
      alert('Қате пайда болды. Қайталап көріңіз.');
    }
  };

  const filteredFavorites = favoriteActors.filter((actor) => {
    const matchesSearch = search
      ? actor.name?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesSearch;
  });

  const sortActorsByName = (list) => {
    return [...list].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name, 'kk');
      } else {
        return b.name.localeCompare(a.name, 'kk');
      }
    });
  };

  const filtered = showFavorites ? filteredFavorites : actors;
  const actorsToShow = sortActorsByName(filtered);

  return (
    <div className="directors-container">
      <h1>Қазақ Актерлері</h1>

      <div className="controls">
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`toggle-btn ${showFavorites ? 'active' : ''}`}
        >
          {showFavorites ? '← Барлық актерлер' : 'Таңдаулылар'}
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
        {actorsToShow.length === 0 && !isLoading && (
          <p className="no-directors">Актерлер табылмады</p>
        )}

        {actorsToShow.map((actor) => (
          <div key={actor.id} className="director-card">
            <img
              src={actor.image}
              alt={actor.name}
              className="director-photo"
            />
            <h3>{actor.name}</h3>
            <p className="director-bio">{actor.bio}</p>
            <p className="director-birthyear">Туылған жылы: {actor.birthyear}</p>
            <button
              onClick={() => toggleFavoriteActor(actor)}
              className={`fav-btn ${favoriteActors.some((fav) => fav.id === actor.id) ? 'favorited' : ''}`}
              aria-label="Таңдаулыға қосу"
              title="Таңдаулыға қосу"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={favoriteActors.some((fav) => fav.id === actor.id) ? 'red' : 'none'}
                stroke={favoriteActors.some((fav) => fav.id === actor.id) ? 'red' : 'gray'}
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
