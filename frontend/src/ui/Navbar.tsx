import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const isLoggedIn = localStorage.getItem("accessToken") !== null; // Check if user is logged in

    // Check user role from localStorage (decoded during login)
    const userData = isLoggedIn ? JSON.parse(localStorage.getItem("userData") || "{}") : null;
    const isAdmin = userData?.role === "ADMIN"; // Check if user is an admin

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
                        {isAdmin ? (
                            <>
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
                            </>
                        ) : (
                            <></> // Non-admins don't see admin links
                        )}
                        {/* Add Logout Button for ALL Logged-In Users */}
                        <button
                            className="logout-button"
                            onClick={() => {
                                localStorage.removeItem("accessToken"); // Log out user
                                localStorage.removeItem("userData"); // Clear user data
                                window.location.href = "/"; // Redirect to home
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
