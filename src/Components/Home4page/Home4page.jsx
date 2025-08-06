import React from 'react';
import './Home4page.css';
import directorBg from '../../assets/bx.jpg'; // Фон для режиссеров
import directorPhoto from '../../assets/bv.jpg'; // Фото режиссера

export default function Home4page() {
  const handleDirectorClick = () => {
    window.scrollTo({ top: 800, behavior: 'smooth' });
  };

  return (
    <div className="director-container">
      <div className="director-section">
        <div 
          className="director-background"
          style={{ backgroundImage: `url(${directorBg})` }}
        ></div>
        
        <div className="director-content">
          {/* Фото режиссера */}
          <div className="director-image-wrapper">
            <img 
              src={directorPhoto} 
              alt="Режиссер" 
              className="director-image" 
            />
          </div>

          {/* Текстовый блок */}
          <div className="director-text">
            <h2>Фильм әлемінің архитекторлары</h2>
            <p className="director-intro">
              Режиссер — бұл кинодағы барлық өнердің синтезі. <br />
              Ол — визуалды поэзия мен драматургияның шебері, <br />
              әр кадрдың, әр сеундтің мағынасын жасаушы.
            </p>
            
           
          </div>
        </div>
      </div>
    </div>
  );
}