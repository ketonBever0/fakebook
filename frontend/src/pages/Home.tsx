import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <div className="hero-section">
        <h1 className="hero-title">Üdvözöl a FakeBook!</h1>
        <h2 className="hero-subtitle">A modern közösségi hálózat</h2>
        <p className="hero-description">
          Csatlakozz hozzánk és fedezd fel a lehetőségeket! Oszd meg gondolataidat,
          kapcsolódj barátokhoz, élvezd a közösségi élményt.
        </p>
        <Link to="/LoginPage" className="cta-button">
          Jelentkezz be a folytatáshoz
        </Link>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3 className="feature-title">Közösség</h3>
          <p className="feature-description">
            Beszélgess a barátaiddal, csatlakozz csoportokhoz és bővítsd hálózatodat
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h3 className="feature-title">Kommunikáció</h3>
          <p className="feature-description">
            Oszd meg gondolataidat és élményeidet
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Biztonság</h3>
          <p className="feature-description">
            Biztonságos és privát közösségi élmény
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
