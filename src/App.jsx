import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Movies from './Components/Movies/Movies';
import Actors from './Components/Actors/Actors';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer'; // Импортируем Footer
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile'; 
import Director from './Components/Director/Director'; 
import Reviewmovie from './Components/Reviewmovie/Reviewmovie';
import { ThemeProvider } from './Components/ThemeContext/ThemeContext';
import './App.css'; // Добавляем стили для основного layout

function App() {
  return (
    <ThemeProvider> 
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Movies" element={<Movies />} />
              <Route path="/Actors" element={<Actors />} />
              <Route path="/Login/:id" element={<div>Login page</div>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/Director" element={<Director />} />
              <Route path="/Reviewmovie" element={<Reviewmovie />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;