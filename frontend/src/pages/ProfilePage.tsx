import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./ProfilePage.css";
import PostImageUpload from "../components/PostImageUpload";
import { FileProvider } from "../context/FileContext";

interface User {
    id: number;
    email: string;
    fullname: string;
    birthDate: string;
    company?: string;
    role: string;
    interests?: { id: number; name: string }[];
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

interface Interest {
    id: number;
    name: string;
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
    const [allInterests, setAllInterests] = useState<Interest[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<number[]>([]);
    const [loadingInterestId, setLoadingInterestId] = useState<number | null>(null);
    const [inputFiles, setInputFiles] = useState<FileList | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = localStorage.getItem("userData");
                if (!userData) {
                    navigate("/login");
                    return;
                }
                const parsedUserData: User = JSON.parse(userData);
                setLoggedInUser(parsedUserData);

                const profileResponse = await axios.get(`http://localhost:3000/api/user/one/${userId}`);
                setProfileUser(profileResponse.data);

                const postsResponse = await axios.get(`http://localhost:3000/api/post/all`);
                const userPosts = postsResponse.data.filter((post: Post) => post.authorId === parseInt(userId));
                setPosts(userPosts);

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

                // Fetch user interests
                const interestsResponse = await axios.get(`http://localhost:3000/api/interest/user/${userId}`);
                setProfileUser((prev) => prev ? { ...prev, interests: interestsResponse.data } : null);

                // Set the selected interests based on the fetched user interests
                setSelectedInterests(interestsResponse.data.map((interest) => interest.id));

                // Fetch all available interests
                const allInterestsResponse = await axios.get("http://localhost:3000/api/interest");
                setAllInterests(allInterestsResponse.data);


            } catch (err) {
                setError("Nem sikerült lekérni az adatokat.");
            }
        };

        fetchData();
    }, [userId, navigate]);

    const handleInterestChange = async (interestId: number, isChecked: boolean) => {
        if (loadingInterestId === interestId) return;
        setLoadingInterestId(interestId);

        try {
            if (isChecked) {
                await axios.post(`http://localhost:3000/api/interest/user/${interestId}`, {
                    userId: loggedInUser?.id,
                });
                // Add interestId to the list of selected interests
                setSelectedInterests((prev) => [...prev, interestId]);
            } else {
                await axios.delete(`http://localhost:3000/api/interest/user/${loggedInUser?.id}/${interestId}`);
                // Remove interestId from the list of selected interests
                setSelectedInterests((prev) => prev.filter((id) => id !== interestId));
            }

            // Optionally update profileUser interests (for UI synchronization)
            if (profileUser) {
                const updatedProfileInterests = isChecked
                    ? [...(profileUser.interests || []), allInterests.find((i) => i.id === interestId)!]
                    : (profileUser.interests || []).filter((i) => i.id !== interestId);
                setProfileUser({ ...profileUser, interests: updatedProfileInterests });
            }

        } catch (err) {
            console.error("Interest modification error:", err);
            setError("Nem sikerült módosítani az érdeklődési kört.");
        } finally {
            setLoadingInterestId(null);
        }
    };


    const handleNewPostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedInUser || loggedInUser.id !== parseInt(userId || "0")) return;

        try {
            const formData = new FormData();
            formData.append('text', newPostText);
            formData.append('authorId', loggedInUser.id.toString());
            
            if (inputFiles && inputFiles[0]) {
                formData.append('image', inputFiles[0]);
            }

            const response = await axios.post("http://localhost:3000/api/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setPosts([response.data, ...posts]);
            setNewPostText("");
            setNewPostImageUrl("");
            setInputFiles(null);
        } catch (error: any) {
            const message = error.response?.data?.message;

            if (message === "Obscene expression found in post!") {
                alert("A bejegyzés obszcén kifejezést tartalmaz!");
            } else {
                alert("Nem sikerült létrehozni a bejegyzést.");
            }

            console.error("Post creation failed:", error);
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
        } catch (error: any) {
            const message = error.response?.data?.message;

            if (message === 'Post not found!') {
                alert('A hozzászólni kívánt bejegyzés nem található!');
            } else if (message === 'Obscene expression found in comment!') {
                alert('A hozzászólás obszcén kifejezést tartalmaz!');
            } else {
                alert("Nem sikerült létrehozni a hozzászólást.");
            }
            console.error("Error creating comment:", error);
        }
    };

    const handleImageUploaded = (imageUrl: string) => {
        setNewPostImageUrl(imageUrl);
    };

    return (
        <div className="profile-container">
            <FileProvider>
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

                            <h3>Érdeklődési körök</h3>
                            <ul>
                                {profileUser.interests?.map((interest) => (
                                    <li key={interest.id}>{interest.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {loggedInUser?.id === parseInt(userId) && (
                        <div className="profile-edit-interests">
                            <h3>Szerkeszd az érdeklődési köreidet</h3>
                            {allInterests.map((interest) => (
                                <label key={interest.id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedInterests.includes(interest.id)}  // This ensures that the checkbox reflects the state
                                        onChange={(e) => handleInterestChange(interest.id, e.target.checked)}  // Handle user interactions
                                    />

                                    {interest.name}
                                </label>
                            ))}
                        </div>
                    )}

                    {loggedInUser?.id === parseInt(userId) && ( // Only show post form on own profile
                        <>
                            <h2 className="profile-posts-title">Új bejegyzés létrehozása</h2>
                            <form className="new-post-form" onSubmit={handleNewPostSubmit}>
                                <textarea 
                                    placeholder="Írd meg a bejegyzésed..." 
                                    value={newPostText} 
                                    onChange={(e) => setNewPostText(e.target.value)} 
                                    required 
                                />
                                <PostImageUpload onImageUploaded={handleImageUploaded} />
                                {newPostImageUrl && (
                                    <div className="preview-image">
                                        <img src={newPostImageUrl} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
                                    </div>
                                )}
                                <button type="submit" className="profile-button">Bejegyzés létrehozása</button>
                            </form>
                        </>
                    )}

                    <h2 className="profile-posts-title">Bejegyzések</h2>
                    <div className="profile-posts">
                        {posts.map((post: Post) => (
                            <div key={post.id} className="post">
                                <p>{post.text}</p>
                                {post.imageUrl && (
                                    <div className="post-image">
                                        <img src={post.imageUrl} alt="Post" style={{ maxWidth: '100%', marginTop: '10px' }} />
                                    </div>
                                )}

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
            </FileProvider>
        </div>
    );
};

export default ProfilePage;