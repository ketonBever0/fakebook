import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

const LoginPage = ({ onRegisterClick }: { onRegisterClick: () => void }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          formData
      );

      // Save the token and user data to localStorage
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user)); // Store user data as JSON

      console.log("Access Token Set:", response.data.token);
      console.log("User Data Set:", response.data.user);

      if (rememberMe) {
        localStorage.setItem("userEmail", formData.email);
      } else {
        localStorage.removeItem("userEmail");
      }

      alert("Sikeres bejelentkezés!");

      navigate("/profile");
      window.location.reload();
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(
          error.response?.data?.message ||
          "Sikertelen bejelentkezés, a jelszó vagy e-mail cím nem megfelelő"
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="backlight-circle circle1"></div>
      <div className="backlight-circle circle2"></div>

      <div className="login-card">
        <div className="login-header">
          <h1>Bejelentkezés</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Jelszó</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me">Adatok megjegyzése</label>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>

        <div className="login-footer">
          <p>Még nincs fiókod? <a href="#signup" onClick={(e) => {
            e.preventDefault();
            onRegisterClick();
          }}>Regisztráció</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;