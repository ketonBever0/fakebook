import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import './LoginPage.css';

interface RegisterFormData {
  email: string;
  fullname: string;
  password: string;
  birthDate: string;
  company: string;
}

interface ApiErrorResponse {
  message: string;
}

interface RegisterResponse {
  token: string;
}

const RegisterPage = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    fullname: '',
    password: '',
    birthDate: '',
    company: ''
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
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
    setError('');

    
    if (formData.password !== confirmPassword) {
      setError("A jelszavak nem egyeznek");
      return;
    }

    
    if (!agreeTerms) {
      setError("El kell fogadnod a Felhasználási Feltételeket");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<RegisterResponse>(
        "http://localhost:3000/api/auth/register", 
        formData
      );
      
      localStorage.setItem("accessToken", response.data.token);
      
      alert("Regisztráció sikeres!");
      return;
      onLoginClick();
      
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(
        error.response?.data?.message || 
        'Sikertelen regisztráció. Kérjük, próbáld újra.'
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
      <div className="backlight-circle circle3"></div>
      
      <div className="login-card register-card">
        <div className="login-header">
          <h1>Fiók létrehozása</h1>
          <p>Kérjük, töltsd ki az adataidat a regisztrációhoz</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email cím</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="pelda@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="fullname">Teljes név</label>
            <input
              type="text"
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Teszt Elek"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="birthDate">Születési dátum</label>
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="company">Cég</label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Cég neve (opcionális)"
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Jelszó megerősítése</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="form-options terms-checkbox">
            <div className="remember-me">
              <input
                type="checkbox"
                id="agree-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="agree-terms">Elfogadom az ÁSZF-et</label>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Folyamatban...' : 'Regisztráció'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Már van fiókod? <a href="#login" onClick={(e) => {
            e.preventDefault();
            onLoginClick();
          }}>Bejelentkezés</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;