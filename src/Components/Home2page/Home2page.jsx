import React from 'react';
import './Home2page.css';
import { useNavigate } from 'react-router-dom';

const films = [
  {
    id: 1,
    title: 'Менің атым Қожа',
    rating: 8.6,
    votes: 14000,
    img: 'https://avatars.mds.yandex.net/get-kinopoisk-image/10592371/f8bc887e-3833-4f59-bb12-1a0350b5fee9/600x900'
  },
  {
    id: 2,
    title: 'Жаужүрек Мың Бала',
    rating: 8.1,
    votes: 9800,
    img: 'https://m.media-amazon.com/images/M/MV5BYjBlOWMwZWUtMWZmYS00MDgzLWI3NmUtOThkM2I3NWJiZjQyXkEyXkFqcGc@._V1_.jpg'
  },
  {
    id: 3,
    title: 'Томирис',
    rating: 8.4,
    votes: 12200,
    img: 'https://i.pinimg.com/736x/60/3e/9b/603e9b8251923b5b6f6c33905e7050fc.jpg'
  },
  {
    id: 4,
    title: 'Аманат',
    rating: 7.8,
    votes: 8700,
    img: 'https://upload.wikimedia.org/wikipedia/ru/thumb/d/dc/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%B0_%D0%90%D0%BC%D0%B0%D0%BD%D0%B0%D1%82%2C_2022.jpg/330px-%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%B0_%D0%90%D0%BC%D0%B0%D0%BD%D0%B0%D1%82%2C_2022.jpg'
  },
  {
    id: 5,
    title: 'Шекер',
    rating: 8.0,
    votes: 9100,
    img: 'https://tribune.kz/wp-content/uploads/2022/05/d921da1ad7977956934efdaf0c064e78.webp'
  },
  {
    id: 6,
    title: 'Біржан сал',
    rating: 8.3,
    votes: 7800,
    img: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/d9725029-7a25-4c9e-afb8-7232e42e7783/600x900'
  },
  {
    id: 7,
    title: 'Көшпенділер',
    rating: 7.9,
    votes: 10500,
    img: 'https://www.kino-teatr.ru/movie/posters/big/6/1/3216.jpg'
  },
  {
    id: 8,
    title: 'Балалық шағымның аспаны',
    rating: 8.7,
    votes: 6000,
    img: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4774061/6ef4ce54-93da-4666-9c98-541a08be3b74/600x900'
  },
  {
    id: 9,
    title: 'Құнанбай',
    rating: 8.2,
    votes: 9500,
    img: 'https://upload.wikimedia.org/wikipedia/kk/0/00/%D2%9A%D2%B1%D0%BD%D0%B0%D0%BD%D0%B1%D0%B0%D0%B9.jpg'
  },
  {
    id: 10,
    title: 'Келін',
    rating: 7.6,
    votes: 11000,
    img: 'https://kazgazeta.kz/wp-content/uploads//%D0%9A%D0%B5%D0%BB%D0%B8%D0%BD.jpg'
  }
];

export default function Home2page() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/movies');
  };
  return (
    <div className="best-films-container">
      <h2>Ең үздік қазақ фильмдері</h2>
      <div className="films-scroll">
        {films.map(film => (
          <div key={film.id} className="film-poster">
            <img src={film.img} alt={film.title} />
            <div className="overlay">
              <h3>{film.title}</h3>
              <p>⭐ {film.rating} · {film.votes.toLocaleString()} дауыс</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    
  );
}
