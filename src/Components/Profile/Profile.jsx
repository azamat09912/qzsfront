import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Profile() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState('light');
  const [name, setName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');
  const [avatar, setAvatar] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [movieDescription, setMovieDescription] = useState('');
  const [movieImage, setMovieImage] = useState(null);
  const [movieLink, setMovieLink] = useState('');
  const [movies, setMovies] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletedMovie, setDeletedMovie] = useState(null);
  const [undoTimeoutId, setUndoTimeoutId] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [showUndo, setShowUndo] = useState(false);

  const [selectedPlaylist, setSelectedPlaylist] = useState(() => localStorage.getItem('selectedPlaylist') || 'Все');
  const [allPlaylists, setAllPlaylists] = useState(['Все']);
  const [search, setSearch] = useState('');

  // Для drag and drop
  const dragMovieId = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .get('https://qazaqcinema.onrender.com/api/profile', { headers: getAuthHeaders() })
      .then(({ data }) => {
        setName(data.name);
        setAvatar(data.avatar);
        setTheme(data.theme || 'light');
        setMovies(data.movies || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  // Обновляем theme класс для body
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  // Обновляем список плейлистов на основе фильмов
  useEffect(() => {
    const playlistsFromMovies = [...new Set(movies.map(m => (m.playlist?.trim() || 'Без плейлиста')))];
    setAllPlaylists(['Все', ...playlistsFromMovies]);
  }, [movies]);

  // Сохраняем выбранный плейлист в localStorage
  useEffect(() => {
    localStorage.setItem('selectedPlaylist', selectedPlaylist);
  }, [selectedPlaylist]);

  // Анимация Undo удаления
  useEffect(() => {
    if (!deletedMovie) {
      setShowUndo(false);
      setCountdown(5);
      return;
    }
    setShowUndo(true);
    if (countdown === 0) {
      setShowUndo(false);
      setDeletedMovie(null);
      setCountdown(5);
      return;
    }
    const intervalId = setInterval(() => {
      setCountdown(c => c - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [deletedMovie, countdown]);

  // --- Обработка имени ---
  const handleChangeName = () => {
    const trimmedName = newName.trim();
    if (trimmedName.length < 3 || trimmedName.length > 12) {
      setNameError('Имя должно быть от 3 до 12 символов');
      return;
    }
    axios
      .put('https://qazaqcinema.onrender.com/api/profile/name', { name: trimmedName }, { headers: getAuthHeaders() })
      .then(() => {
        setName(trimmedName);
        setEditingName(false);
        setNewName('');
        setNameError('');
      })
      .catch(() => setNameError('Ошибка обновления имени'));
  };

  // --- Аватар ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      axios
        .put('https://qazaqcinema.onrender.com/api/profile/avatar', { avatar: reader.result }, { headers: getAuthHeaders() })
        .then(() => setAvatar(reader.result))
        .catch(() => alert('Ошибка загрузки аватара'));
    };
    reader.readAsDataURL(file);
  };
  const handleDeleteAvatar = () => {
    axios
      .delete('https://qazaqcinema.onrender.com/api/profile/avatar', { headers: getAuthHeaders() })
      .then(() => setAvatar(''))
      .catch(() => alert('Ошибка удаления аватара'));
  };

  // --- Добавление/Редактирование фильма ---
  const startEditing = (movie) => {
    setEditingMovieId(movie.id);
    setMovieTitle(movie.title);
    setMovieDescription(movie.description);
    setMovieImage(null);
    setMovieLink(movie.link);
    setSelectedPlaylist(movie.playlist || '');
  };
  const clearForm = () => {
    setEditingMovieId(null);
    setMovieTitle('');
    setMovieDescription('');
    setMovieImage(null);
    setMovieLink('');
    setSelectedPlaylist('');
  };
  const handleSubmitMovie = () => {
    if (!movieTitle.trim() || !movieDescription.trim() || !movieLink.trim() || (!movieImage && !editingMovieId)) {
      alert('Заполните все поля!');
      return;
    }
    const sendData = (imageBase64) => {
      const movieData = {
        title: movieTitle.trim(),
        description: movieDescription.trim(),
        link: movieLink.trim(),
        playlist: selectedPlaylist.trim() || 'Без плейлиста',
        image: imageBase64 || (editingMovieId ? movies.find(m => m.id === editingMovieId)?.image : null),
      };

      if (editingMovieId) {
        axios
          .put(`https://qazaqcinema.onrender.com/api/movies/${editingMovieId}`, movieData, { headers: getAuthHeaders() })
          .then(() => {
            setMovies(prev => prev.map(m => m.id === editingMovieId ? { ...m, ...movieData } : m));
            clearForm();
          })
          .catch(() => alert('Ошибка при обновлении фильма'));
      } else {
        axios
          .post('https://qazaqcinema.onrender.com/api/movies', movieData, { headers: getAuthHeaders() })
          .then(({ data }) => {
            setMovies(prev => [...prev, data]);
            clearForm();
          })
          .catch(() => alert('Ошибка при добавлении фильма'));
      }
    };

    if (movieImage) {
      const reader = new FileReader();
      reader.onloadend = () => sendData(reader.result);
      reader.readAsDataURL(movieImage);
    } else {
      sendData(null);
    }
  };

  // --- Удаление фильма с Undo ---
  const handleDeleteMovie = (movieId) => {
    const movieToDelete = movies.find(m => m.id === movieId);
    setDeletedMovie(movieToDelete);
    setMovies(prev => prev.filter(m => m.id !== movieId));
    setCountdown(5);
    const timeoutId = setTimeout(() => {
      axios.delete(`https://qazaqcinema.onrender.com/api/movies/${movieId}`, { headers: getAuthHeaders() })
        .catch(() => alert('Ошибка удаления фильма'));
      setDeletedMovie(null);
      setShowUndo(false);
    }, 5000);
    setUndoTimeoutId(timeoutId);
  };
  const handleUndoDelete = () => {
    if (undoTimeoutId) clearTimeout(undoTimeoutId);
    setMovies(prev => [deletedMovie, ...prev]);
    setDeletedMovie(null);
    setCountdown(5);
    setShowUndo(false);
  };

  // --- Переключение темы ---
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    axios
      .put('https://qazaqcinema.onrender.com/api/profile/theme', { theme: newTheme }, { headers: getAuthHeaders() })
      .then(() => setTheme(newTheme))
      .catch(() => alert('Ошибка переключения темы'));
  };

  // --- Drag & Drop ---
  const onDragStart = (e, movieId) => {
    dragMovieId.current = movieId;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDrop = (e, playlist) => {
    e.preventDefault();
    const id = dragMovieId.current;
    if (!id) return;
    setMovies(prev => {
      const updated = prev.map(m =>
        m.id === id ? { ...m, playlist: playlist || 'Без плейлиста' } : m
      );
      // Можно отправить на сервер обновление плейлиста:
      axios.put(`https://qazaqcinema.onrender.com/api/movies/${id}`, { playlist }, { headers: getAuthHeaders() }).catch(() => { });
      return updated;
    });
    dragMovieId.current = null;
  };
  const onDragOver = (e) => e.preventDefault();

  // Фильтрация и поиск
  const filteredMovies = movies.filter(m =>
    (selectedPlaylist === 'Все' || (m.playlist?.trim() || 'Без плейлиста') === selectedPlaylist) &&
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="profile-page-custom">Загрузка данных профиля...</div>;
  }

  return (
    <div className="profile-page-custom">
      <button className="theme-toggle-custom" onClick={toggleTheme}>
        Переключить тему ({theme})
      </button>

      <div className="profile-header-custom">
        {avatar ? (
          <img src={avatar} alt="Avatar" className="profile-avatar-custom" />
        ) : (
          <div className="avatar-placeholder-custom">Нет фото</div>
        )}

        <div className="profile-name-block-custom">
          {editingName ? (
            <>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Новое имя" />
              <button onClick={handleChangeName}>Сохранить</button>
              <button onClick={() => { setEditingName(false); setNameError(''); }} style={{ marginLeft: 8 }}>Отмена</button>
              {nameError && <div className="error">{nameError}</div>}
            </>
          ) : (
            <>
              <h2>{name}</h2>
              <button onClick={() => { setEditingName(true); setNewName(name); }}>Изменить имя</button>
            </>
          )}
        </div>
      </div>

      <div className="avatar-section-custom">
        {!avatar && <input type="file" accept="image/*" onChange={handleAvatarChange} />}
        {avatar && <button onClick={handleDeleteAvatar}>Удалить фото</button>}
      </div>

      <div className="add-movie-form-custom">
        <h3>{editingMovieId ? 'Редактировать фильм' : 'Добавить фильм'}</h3>

        <input
          list="playlist-options"
          placeholder="Введите или выберите плейлист"
          value={selectedPlaylist}
          onChange={e => setSelectedPlaylist(e.target.value)}
        />
        <datalist id="playlist-options">
          {allPlaylists.filter(pl => pl !== 'Все').map(pl => (
            <option key={pl} value={pl} />
          ))}
        </datalist>


        <input
          placeholder="Название фильма"
          value={movieTitle}
          onChange={e => setMovieTitle(e.target.value)}
        />
        <textarea
          placeholder="Описание"
          value={movieDescription}
          onChange={e => setMovieDescription(e.target.value)}
        />
        <input
          placeholder="Ссылка на фильм"
          value={movieLink}
          onChange={e => setMovieLink(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={e => setMovieImage(e.target.files[0])} />
        <button onClick={handleSubmitMovie}>
          {editingMovieId ? 'Сохранить' : 'Добавить'}
        </button>
        {editingMovieId && <button onClick={clearForm} style={{ marginLeft: 8 }}>Отмена</button>}
      </div>

      <div className="filters">
        <select
          value={selectedPlaylist}
          onChange={e => setSelectedPlaylist(e.target.value)}
          className="playlist-filter"
        >
          {allPlaylists.map(pl => (
            <option key={pl} value={pl}>{pl}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Поиск по названию"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="movies-grid">
        {filteredMovies.map(movie => (
          <div
            key={movie.id}
            className="movie-card-custom"
            draggable
            onDragStart={e => onDragStart(e, movie.id)}
          >
            <a href={movie.link} target="_blank" rel="noopener noreferrer">
              <img
                src={movie.image || 'https://dummyimage.com/200x300/ccc/fff&text=No+Image'}
                alt={movie.title}
              />
            </a>
            <div className="movie-info-custom">
              <h4>{movie.title}</h4>
              <p>{movie.description}</p>
              <p><i>Плейлист: {movie.playlist || 'Без плейлиста'}</i></p>
              <button onClick={() => startEditing(movie)} className="action-btn edit-btn">
                <i className="fas fa-edit"></i> Редактировать
              </button>
              <button onClick={() => handleDeleteMovie(movie.id)} className="action-btn delete-btn">
                <i className="fas fa-trash"></i> Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="dropzones-container">
        <h3>Перетащите фильм в плейлист</h3>
        <div className="dropzones">
          {allPlaylists.filter(pl => pl !== 'Все').map(pl => (
            <div
              key={pl}
              className="dropzone"
              onDrop={e => onDrop(e, pl)}
              onDragOver={onDragOver}
            >
              {pl}
            </div>
          ))}
        </div>
      </div>

      {showUndo && (
        <div className="undo-banner-custom">
          Фильм "{deletedMovie?.title}" удалён. Удаление через {countdown} сек.
          <button onClick={handleUndoDelete}>Отменить</button>
        </div>
      )}

      <button className="logout-button-custom" onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>
        Выйти из аккаунта
      </button>
    </div>
  );
}
