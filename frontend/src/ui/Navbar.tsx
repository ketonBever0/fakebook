import { Link } from 'react-router-dom';
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav>
            <div className="title">Fakebook</div>
            <div className="menu">
                <Link to={"/"}>Home</Link>
                <Link to={"/users"}>Users</Link>
                <Link to={"/interests"}>Interests</Link>
                <Link to={"/messages"}>Messages</Link>
                <Link to={"/posts"}>Posts</Link>
                <Link to={"/comments"}>Comments</Link>
                <Link to={"/friends"}>Friends</Link>
                <Link to={"/groups"}>Groups</Link>
                <Link to={"/group-messages"}>Group Messages</Link>
                <Link to={"/user-groups"}>User Groups</Link>
                <Link to={"/user-interests"}>User Interests</Link>
                <Link to={"/forbidden-expressions"}>Forbidden Expressions</Link>
            </div>
        </nav>
    );
}
