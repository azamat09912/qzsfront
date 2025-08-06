import React from 'react';
import './Home.css';
import img2 from '../../assets/pexels-julia-volk-6408361.jpg';
import { useNavigate } from 'react-router-dom';
import Home2page from "../Home2page/Home2page.jsx";
import Home3page from "../Home3page/Home3page.jsx";
import Home4page from "../Home4page/Home4page.jsx";
import Home5page from "../Home5page/Home5page.jsx"; // Импортируем Home3page 
import Footer from "../Footer/Footer.jsx"






export default function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/movies');  
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-background" style={{ backgroundImage: `url(${img2})` }}></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Қазақ киносының    <br />     ㅤ ㅤРухы келешегінің таңы</h1>
            <p className='introduction'>
              Жаңа фильмдер, терең рецензиялар және қазақ кино әлеміндегі ең үздік <br />ㅤㅤ  ㅤ тұлғалар  туралы
              мәлімет, Кинематография әлеміне терең үңіліңіз — QazaqCinema
            </p>
            <button className='know-more' onClick={handleClick}>Фильм қарау</button>
          </div>
        </div>
      </div>
      <Home2page />
       <Home3page />
      <Home4page />
      <Home5page />
    
    </div>
  );
}
