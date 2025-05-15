import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './FriendsPage.css';

interface Friend {
    pending: boolean;
    senderId: number;
    receiverId: number;
    senderName: string;
    receiverName: string;
}

interface User {
    id: number;
    fullname: string;
}

const FriendsPage: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [pending, setPending] = useState<Friend[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = localStorage.getItem('accessToken');
    const apiBase = 'http://localhost:3000/api';

    const loadData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const { data: frData } = await axios.get<Friend[]>(`${apiBase}/friend/user/friend`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPending(frData.filter(f => f.pending));
            setFriends(frData.filter(f => !f.pending));

            const { data: usDataRaw } = await axios.get<any[]>(`${apiBase}/user/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const usData: User[] = usDataRaw.map(u => ({ id: u.ID ?? u.id, fullname: u.FULLNAME ?? u.fullname }));
            setUsers(usData.filter(u => u.id !== userData.id));

            const { data: sugDataRaw } = await axios.get<any[]>(`${apiBase}/friend/suggest/company`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const sugData: User[] = sugDataRaw.map(u => ({ id: u.ID ?? u.id, fullname: u.FULLNAME ?? u.fullname }));
            console.log('Suggestions fetched:', sugData);
            const filteredSug = sugData.filter(u => u.fullname !== 'Fakebook System');
            setSuggestions(filteredSug);
        } catch (err: any) {
            console.error('Error loading data', err);
            setError(err.response?.data?.message || 'Error loading data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [token]);

    const sendRequest = async (id: number) => {
        try {
            await axios.post(`${apiBase}/friend/user/friend/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            loadData();
        } catch (err: any) {
            const msg = err.response?.data?.message;
            console.error('Error sending request:', err);

            if (msg === 'Friend already added!') {
                alert('This user is already your friend.');
            } else if (msg === 'You cannot add yourself as a friend!') {
                alert('You cannot send a friend request to yourself.');
            } else if (msg === 'Requested user not found!') {
                alert('This user does not exist.');
            } else {
                alert(msg || 'Failed to send friend request.');
            }
        }
    };

    const acceptRequest = async (id: number) => { await axios.put(`${apiBase}/friend/user/friend/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } }); loadData(); };
    const declineRequest = async (id: number) => { await axios.delete(`${apiBase}/friend/user/friend/${id}`, { headers: { Authorization: `Bearer ${token}` } }); loadData(); };
    const unfriend = async (id: number) => { await axios.delete(`${apiBase}/friend/user/friend/${id}`, { headers: { Authorization: `Bearer ${token}` } }); loadData(); };

    const friendIds = new Set(friends.map(f => (f.senderId === userData.id ? f.receiverId : f.senderId)));
    const sentIds = new Set(pending.filter(f => f.senderId === userData.id).map(f => f.receiverId));
    const incomingIds = new Set(pending.filter(f => f.receiverId === userData.id).map(f => f.senderId));

    return (
        <div className="friends-container">
            <h2 className="section-title">Suggestions</h2>
            {loading && <p>Loading...</p>}
            {!loading && suggestions.length === 0 && <p>No suggestions at this time.</p>}
            {!loading && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map(u => (
                        <li key={`suggest-${u.id}`} className="user-item">
                            <Link to={`/profile/${u.id}`}>{u.fullname}</Link>
                            <button
                                className="send-btn"
                                onClick={() => sendRequest(u.id)}
                                disabled={sentIds.has(u.id) || friendIds.has(u.id)}
                            >
                                {friendIds.has(u.id) ? 'Friend' : sentIds.has(u.id) ? 'Pending' : 'Send Request'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <h2 className="section-title">All Users</h2>
            {error && <p className="error">{error}</p>}
            {!loading && (
                <ul className="users-list">
                    {users.map(u => {
                        const isFriend = friendIds.has(u.id);
                        const isSent = sentIds.has(u.id);
                        const isIncoming = incomingIds.has(u.id);
                        return (
                            <li key={`user-${u.id}`} className="user-item">
                                <Link to={`/profile/${u.id}`}>{u.fullname}</Link>
                                <div className="user-actions">
                                    {isFriend && (
                                        <button className="unfriend-btn" onClick={() => unfriend(u.id)}>Unfriend</button>
                                    )}
                                    {isIncoming && (
                                        <>
                                            <button className="accept-btn" onClick={() => acceptRequest(u.id)}>Accept</button>
                                            <button className="decline-btn" onClick={() => declineRequest(u.id)}>Decline</button>
                                        </>
                                    )}
                                    <button className="send-btn" onClick={() => sendRequest(u.id)}>
                                        Send Request
                                    </button>
                                    {/*{!isFriend && !isIncoming && (*/}
                                    {/*    <button className="send-btn" onClick={() => sendRequest(u.id)} disabled={isSent}>*/}
                                    {/*        {isSent ? 'Pending' : 'Send Request'}*/}
                                    {/*    </button>*/}
                                    {/*)}*/}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default FriendsPage;
