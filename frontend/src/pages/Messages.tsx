import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function Messages() {
  type MessageType = {
    id: number;
    text: string;
    when: string; // Date
    senderId?: number;
    receiverId?: number;
  };

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [formData, setFormData] = useState({
    text: "",
    senderId: "",
    receiverId: "",
  });
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<MessageType | null>(null);

  // // Fetch messages on component mount
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const res = await axios.get("/api/messages/all"); // Replace with your backend endpoint
  //       console.log("Fetched messages:", res.data);
  //       setMessages(res.data);
  //     } catch (err) {
  //       console.error("Error fetching messages:", err);
  //       alert("Failed to fetch messages.");
  //     }
  //   };
  //   fetchMessages();
  // }, []);

  useEffect(() => {
    const fetchDummyMessages = async () => {
      // Simulate dummy data
      const dummyMessages = [
        { id: 1, text: "Hi there!", when: new Date().toISOString(), senderId: 1, receiverId: 2 },
        { id: 2, text: "What’s up?", when: new Date().toISOString(), senderId: 2, receiverId: 1 },
        { id: 3, text: "Long time no see!", when: new Date().toISOString(), senderId: 1, receiverId: 3 },
      ];

      // Simulate a delay, as if fetching from the backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

      console.log("Fetched dummy messages:", dummyMessages);
      setMessages(dummyMessages); // Update state with dummy messages
    };

    fetchDummyMessages();
  }, []);


  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      isEditing: boolean = false
  ) => {
    if (isEditing && editFormData) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addMessage = async () => {
    if (!formData.text.trim()) {
      alert("Message text cannot be empty.");
      return;
    }

    try {
      const res = await axios.post("/api/messages", {
        text: formData.text,
        senderId: formData.senderId ? parseInt(formData.senderId) : null,
        receiverId: formData.receiverId ? parseInt(formData.receiverId) : null,
      }); // Replace with your backend endpoint

      alert(res.data.message);

      // Refetch messages after adding
      const fetchRes = await axios.get("/api/messages/all");
      setMessages(fetchRes.data);

      // Reset the form
      setFormData({
        text: "",
        senderId: "",
        receiverId: "",
      });
    } catch (err) {
      console.error("Error adding message:", err);
      alert("Failed to add message. Please try again.");
    }
  };

  const saveMessage = async (id: number) => {
    try {
      if (editFormData) {
        const res = await axios.put(`/api/messages/${id}`, {
          text: editFormData.text,
          senderId: editFormData.senderId,
          receiverId: editFormData.receiverId,
        }); // Replace with your backend endpoint

        alert(res.data.message);

        // Refetch messages after editing
        const fetchRes = await axios.get("/api/messages/all");
        setMessages(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      console.error("Error editing message:", err);
      alert("Failed to edit message. Please try again.");
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const res = await axios.delete(`/api/messages/${id}`); // Replace with your backend endpoint
      alert(res.data.message);

      // Refetch messages after deleting
      const fetchRes = await axios.get("/api/messages/all");
      setMessages(fetchRes.data);
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message. Please try again.");
    }
  };

  const startEditing = (message: MessageType) => {
    setEditingMessageId(message.id);
    setEditFormData({ ...message });
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>Messages Page</h1>

        <div className="container">
          <h2>Add New Message</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }} className="form-container">
            <label htmlFor="text">Message Text</label>
            <input
                type="text"
                id="text"
                name="text"
                className="new-user"
                placeholder="Message Text"
                value={formData.text}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="senderId">Sender ID</label>
            <input
                type="number"
                id="senderId"
                name="senderId"
                className="new-user"
                placeholder="Sender ID"
                value={formData.senderId}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="receiverId">Receiver ID</label>
            <input
                type="number"
                id="receiverId"
                name="receiverId"
                className="new-user"
                placeholder="Receiver ID"
                value={formData.receiverId}
                onChange={(e) => handleChange(e)}
            />
            <button className="save" onClick={addMessage}>
              Add Message
            </button>
          </form>
        </div>

        <div>
          <h2>All Messages</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Text</th>
              <th>Timestamp</th>
              <th>Sender ID</th>
              <th>Receiver ID</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {messages.map((message) => (
                <tr key={message.id}>
                  {editingMessageId === message.id ? (
                      <>
                        <td>{message.id}</td>
                        <td>
                          <input
                              type="text"
                              name="text"
                              className="edit-user"
                              value={editFormData?.text || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>{new Date(message.when).toLocaleString()}</td>
                        <td>
                          <input
                              type="number"
                              name="senderId"
                              className="edit-user"
                              value={editFormData?.senderId || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              type="number"
                              name="receiverId"
                              className="edit-user"
                              value={editFormData?.receiverId || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <button className="save" onClick={() => saveMessage(message.id)}>
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{message.id}</td>
                        <td>{message.text}</td>
                        <td>{new Date(message.when).toLocaleString()}</td>
                        <td>{message.senderId || "N/A"}</td>
                        <td>{message.receiverId || "N/A"}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(message)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deleteMessage(message.id)}>
                            Delete
                          </button>
                        </td>
                      </>
                  )}
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
