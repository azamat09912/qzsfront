import React from 'react';
import './Home3page.css';
import img3 from '../../assets/Bgfilm2.jpg';
import img4 from '../../assets/Bgfilm.jpg'; // пусть это будет центральное фото

export default function Home3page() {
 

   const handleClick = () => {
    navigate('/movies');  
  };

  return (
    <div>
      <div className="home-container1">
        <div className="hero-section1">
          <div
            className="hero-background1"
            style={{ backgroundImage: `url(${img3})` }}
          ></div>
          <div className="hero-content1">
            {/* Добавленное фото */}
            <div className="center-image-wrapper">
              <img src={img4} alt="Центральное фото" className="center-image" />
            </div>

            <div className="hero-text11">
              <h1>Кино әлеміндегі ерекше тұлғалар ㅤ</h1>
              <p className="introduction1">
                Актер — бұл жай ғана рөлді орындаушы емес. <br />
                ㅤㅤОл — сценарийде жазылған кейіпкерге жан бітіріп, <br />
                ㅤㅤㅤоның ішкі жан дүниесін сезімін, ойы мен қайшылығын <br />
                көрерменге нақты әрі шынайы жеткізетін тұлға.
              </p>
              
           
            </div>
          </div>
        </div>
      </div>
    </div>  
    
  );
}