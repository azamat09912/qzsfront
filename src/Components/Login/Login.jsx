import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateEmail(email)) {
    setMessage('Введите корректный email');
    return;
  }

  if (password.length < 10) {
    setMessage('Пароль должен быть не менее 10 символов');
    return;
  }
  const url = isRegister
    ? 'https://qazaqcinema.onrender.com/api/auth/register'
    : 'https://qazaqcinema.onrender.com/api/auth/login';

  try {
    const response = await axios.post(url, { email, password });
    const data = response.data;
    console.log(data)

    if (isRegister) {
      // ✅ Регистрация — просто сообщение
      setMessage(data.message || 'Регистрация успешна!');
      setIsRegister(false); // переключаем на форму входа
    } else {
      // ✅ Вход — сохраняем токен
      if (data.token) {
        localStorage.setItem('token', data.token);
        setMessage('Вход успешен!');
        setTimeout(() => navigate('/profile'), 1000);
      } else {
        setMessage('Токен не получен от сервера');
      }
    }
  } catch (error) {
    if (error.response) {
      setMessage(error.response.data.error || 'Ошибка сервера');
    } else {
      setMessage('Ошибка сети');
    }
  }
};



  return (
    <div className={`main-wrapper ${darkMode ? 'dark' : 'light'} login-main-wrapper`}>
      <div className="theme-toggle login-theme-toggle">
        <button onClick={() => setDarkMode(!darkMode)} className="login-theme-button login-btn">
          {darkMode ? 'Светлая тема' : 'Тёмная тема'}
        </button>
      </div>

      <div className="auth-container login-container">
        <h2 className="login-title">{isRegister ? 'Регистрация' : 'Вход'}</h2>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="input-group login-email-group">
            <input
              type="email"
              className="login-input login-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
            />
          </div>

          <div className="input-group login-password-group">
            <input
              type={showPass ? 'text' : 'password'}
              className="login-input login-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Пароль"
            />
            <span
              className="toggle-password login-toggle-password"
              onClick={() => setShowPass(!showPass)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowPass(!showPass)}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="login-btn login-submit-btn">
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        {message && (
          <p className={`login-message ${message.includes('успешн') ? 'success' : 'error'}`}>{message}</p>
        )}

        <hr className="login-hr" />

        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage('');
          }}
          className="login-btn login-toggle-btn"
        >
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
}

export default Login;
