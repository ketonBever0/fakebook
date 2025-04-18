import { Link } from 'react-router-dom';
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav>
            <div className="title">Fakebook</div>
            <div className="menu">
                <Link to={"/"}>Home</Link>
                <Link to={"/users"}>Users</Link>
            </div>
        </nav>
    );
}
