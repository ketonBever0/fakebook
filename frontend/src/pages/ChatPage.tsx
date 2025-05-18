import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChatPage.css';

interface Message {
    messageId: number;
    text: string;
    when: string;
    sender_id: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
}

const ChatPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [chatPartnerName, setChatPartnerName] = useState<string>('');
    const [newMessage, setNewMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = localStorage.getItem('accessToken');
    const apiBase = 'http://localhost:3000/api';

    const fetchMessages = async () => {
        if (!token || !id) return;
        try {
            setLoading(true);
            const { data } = await axios.get(`${apiBase}/message/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(data.reverse()); // chronological order
            if (data.length > 0) {
                const first = data[0];
                const partnerName = first.sender_id === userData.id ? first.receiverName : first.senderName;
                setChatPartnerName(partnerName);
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post(
                `${apiBase}/message/user/${id}`,
                { text: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMessage('');
            fetchMessages(); // refresh messages
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Optional: live updates
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [id]);

    return (
        <div className="chat-container">
            <h2 className="chat-header">
                Chat with {chatPartnerName || '...'}
            </h2>

            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <div className="messages-box">
                    {messages.map(msg => (
                        <div
                            key={msg.messageId}
                            className={`message ${msg.sender_id === userData.id ? 'sent' : 'received'}`}
                        >
                            <div>
                                <strong>{msg.sender_id === userData.id ? 'You' : msg.senderName}</strong>
                            </div>
                            <div>{msg.text}</div>
                            <div className="message-time">{new Date(msg.when).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="chat-input-area">
            <textarea
                className="chat-textarea"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..."
            />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );

};

export default ChatPage;
