import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./ProfilePage.css";

interface User {
    id: number;
    email: string;
    fullname: string;
    birthDate: string;
    company?: string;
    role: string;
}

interface Post {
    id: number;
    text: string;
    imageUrl?: string;
    authorId: number;
}

interface Comment {
    id: number;
    text: string;
    authorId: number;
    postId: number;
    authorName?: string;
}


const ProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState<User | null>(null); // Profile being viewed
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // Logged-in user
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
    const [newCommentText, setNewCommentText] = useState<{ [key: number]: string }>({});
    const [newPostText, setNewPostText] = useState<string>("");
    const [newPostImageUrl, setNewPostImageUrl] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get logged-in user
                const userData = localStorage.getItem("userData");
                if (!userData) {
                    navigate("/login");
                    return;
                }
                const parsedUserData: User = JSON.parse(userData);
                setLoggedInUser(parsedUserData);

                // Get the profile being viewed
                const profileResponse = await axios.get(`http://localhost:3000/api/user/one/${userId}`);
                setProfileUser(profileResponse.data);

                // Get posts of the viewed profile
                const postsResponse = await axios.get(`http://localhost:3000/api/post/all`);
                const userPosts = postsResponse.data.filter((post: Post) => post.authorId === parseInt(userId));
                setPosts(userPosts);

                // Get comments with author names
                const commentsData: { [key: number]: Comment[] } = {};
                await Promise.all(userPosts.map(async (post) => {
                    const commentsResponse = await axios.get(`http://localhost:3000/api/comment/post/${post.id}`);
                    const commentsWithAuthors = await Promise.all(
                        commentsResponse.data.map(async (comment: Comment) => {
                            const authorResponse = await axios.get(`http://localhost:3000/api/user/one/${comment.authorId}`);
                            return { ...comment, authorName: authorResponse.data.fullname };
                        })
                    );
                    commentsData[post.id] = commentsWithAuthors;
                }));

                setComments(commentsData);
            } catch (err) {
                setError("Nem sikerült lekérni a felhasználói adatokat.");
            }
        };

        fetchData();
    }, [userId, navigate]);

    const handleNewPostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedInUser || loggedInUser.id !== parseInt(userId)) return; // Ensure only logged-in user can post

        try {
            await axios.post("http://localhost:3000/api/post", {
                text: newPostText,
                imageUrl: newPostImageUrl,
                authorId: loggedInUser.id
            });

            setPosts([{ id: Date.now(), text: newPostText, imageUrl: newPostImageUrl, authorId: loggedInUser.id }, ...posts]);
            setNewPostText("");
            setNewPostImageUrl("");
        } catch {
            setError("Nem sikerült létrehozni a bejegyzést.");
        }
    };

    const handleNewCommentSubmit = async (postId: number) => {
        if (!loggedInUser || !newCommentText[postId]) return; // Ensure comments come from logged-in user

        try {
            await axios.post(`http://localhost:3000/api/comment/post/${postId}`, {
                text: newCommentText[postId],
                authorId: loggedInUser.id
            });

            setComments({
                ...comments,
                [postId]: [...(comments[postId] || []), { id: Date.now(), text: newCommentText[postId], authorId: loggedInUser.id, postId }]
            });

            setNewCommentText({ ...newCommentText, [postId]: "" });
        } catch {
            setError("Nem sikerült létrehozni a hozzászólást.");
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h1>Felhasználói profil</h1>
                </div>

                {error && <div className="error-message">{error}</div>}

                {profileUser && (
                    <div className="profile-details">
                        <p><strong>Email:</strong> {profileUser.email}</p>
                        <p><strong>Teljes név:</strong> {profileUser.fullname}</p>
                        <p><strong>Születési dátum:</strong> {profileUser.birthDate}</p>
                        {profileUser.company && <p><strong>Cég:</strong> {profileUser.company}</p>}
                        <p><strong>Szerepkör:</strong> {profileUser.role}</p>
                    </div>
                )}

                {loggedInUser?.id === parseInt(userId) && ( // Only show post form on own profile
                    <>
                        <h2 className="profile-posts-title">Új bejegyzés létrehozása</h2>
                        <form className="new-post-form" onSubmit={handleNewPostSubmit}>
                            <textarea placeholder="Írd meg a bejegyzésed..." value={newPostText} onChange={(e) => setNewPostText(e.target.value)} required />
                            <input type="text" placeholder="Kép URL (opcionális)" value={newPostImageUrl} onChange={(e) => setNewPostImageUrl(e.target.value)} />
                            <button type="submit" className="profile-button">Bejegyzés létrehozása</button>
                        </form>
                    </>
                )}

                <h2 className="profile-posts-title">Bejegyzések</h2>
                <div className="profile-posts">
                    {posts.map(post => (
                        <div key={post.id} className="post">
                            <p>{post.text}</p>
                            {post.imageUrl && <img src={post.imageUrl} alt="Post" />}

                            <div className="comment-form">
                                <input type="text" placeholder="Írd meg hozzászólásod..." value={newCommentText[post.id] || ""}
                                       onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })} />
                                <button onClick={() => handleNewCommentSubmit(post.id)}>Hozzászólás</button>
                            </div>

                            <div className="post-comments">
                                {comments[post.id]?.map(comment => (
                                    <p key={comment.id} className="comment">
                                        <Link to={`/profile/${comment.authorId}`} className="comment-author">{comment.authorName}</Link>: {comment.text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="profile-button" onClick={() => navigate("/")}>Vissza a főoldalra</button>
            </div>
        </div>
    );
};

export default ProfilePage;
