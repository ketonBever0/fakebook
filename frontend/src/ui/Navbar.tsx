import { Link } from 'react-router-dom';
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav>
            <div className="title">Fakebook</div>
            <div className="menu">
                <Link to={"/"}>Home</Link>
                <Link to={"/users"}>Users</Link>
                <Link to={"/LoginPage"}>Bejelentkezés</Link>
                <Link to={"/RegisterPage"}>Regisztráció</Link>
            </div>
        </nav>
    );
}
