import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
    const isLoggedIn = localStorage.getItem("accessToken") !== null;
    const userData = isLoggedIn ? JSON.parse(localStorage.getItem("userData") || "{}") : null;
    const isAdmin = userData?.role === "ADMIN";

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav>
            <div className="title">Fakebook</div>
            <div className="menu">
                <Link to={"/"}>Home</Link>
                {!isLoggedIn && (
                    <>
                        <Link to={"/LoginPage"}>Bejelentkezés</Link>
                        <Link to={"/RegisterPage"}>Regisztráció</Link>
                    </>
                )}
                {isLoggedIn && (
                    <>
                        <Link to={`/profile/${userData?.id}`}>My Profile</Link>
                        <Link to={"/my-groups"}>Csoportok</Link>
                        <Link to={"/my-friends"}>Barátok</Link>
                        {isAdmin && (
                            <div className="dropdown">
                                <button
                                    className="dropdown-toggle"
                                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                                >
                                    Admin Pages ▼
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
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
                                )}
                            </div>
                        )}
                        <button
                            className="logout-button"
                            onClick={() => {
                                localStorage.removeItem("accessToken");
                                localStorage.removeItem("userData");
                                window.location.href = "/";
                            }}
                        >
                            Kijelentkezés
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
