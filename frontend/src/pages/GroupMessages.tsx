import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function GroupMessages() {
  type GroupMessageType = {
    id: number;
    text: string;
    when: string; // Timestamp
    groupId: number;
    senderId: number | null; // Allow senderId to be null
  };


  const [groupMessages, setGroupMessages] = useState<GroupMessageType[]>([]);
  const [formData, setFormData] = useState({
    text: "",
    groupId: "",
    senderId: "",
  });
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<GroupMessageType | null>(null);

  // // Fetch group messages on component mount
  // useEffect(() => {
  //   const fetchGroupMessages = async () => {
  //     try {
  //       const res = await axios.get("/api/group-messages/all"); // Replace with your backend endpoint
  //       console.log("Fetched group messages:", res.data);
  //       setGroupMessages(res.data);
  //     } catch (err) {
  //       console.error("Error fetching group messages:", err);
  //       alert("Failed to fetch group messages.");
  //     }
  //   };
  //   fetchGroupMessages();
  // }, []);

  useEffect(() => {
    const fetchDummyGroupMessages = async () => {
      const dummyGroupMessages: GroupMessageType[] = [
        {
          id: 1,
          text: "Welcome to the group!",
          when: new Date().toISOString(),
          groupId: 101,
          senderId: 201,
        },
        {
          id: 2,
          text: "Let’s plan our next meeting.",
          when: new Date().toISOString(),
          groupId: 102,
          senderId: 202,
        },
        {
          id: 3,
          text: "Don’t forget to check the updates.",
          when: new Date().toISOString(),
          groupId: 103,
          senderId: null, // No sender
        },
      ];

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      console.log("Fetched dummy group messages:", dummyGroupMessages);
      setGroupMessages(dummyGroupMessages); // Update state with dummy data
    };

    fetchDummyGroupMessages();
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

  const addGroupMessage = async () => {
    if (!formData.text.trim()) {
      alert("Message text cannot be empty.");
      return;
    }

    try {
      const res = await axios.post("/api/group-messages", {
        text: formData.text,
        groupId: parseInt(formData.groupId),
        senderId: formData.senderId ? parseInt(formData.senderId) : null,
      }); // Replace with your backend endpoint

      alert(res.data.message);

      // Refetch group messages after adding
      const fetchRes = await axios.get("/api/group-messages/all");
      setGroupMessages(fetchRes.data);

      // Reset the form
      setFormData({
        text: "",
        groupId: "",
        senderId: "",
      });
    } catch (err) {
      console.error("Error adding group message:", err);
      alert("Failed to add group message. Please try again.");
    }
  };

  const saveGroupMessage = async (id: number) => {
    try {
      if (editFormData) {
        const res = await axios.put(`/api/group-messages/${id}`, {
          text: editFormData.text,
          groupId: editFormData.groupId,
          senderId: editFormData.senderId,
        }); // Replace with your backend endpoint

        alert(res.data.message);

        // Refetch group messages after editing
        const fetchRes = await axios.get("/api/group-messages/all");
        setGroupMessages(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      console.error("Error editing group message:", err);
      alert("Failed to edit group message. Please try again.");
    }
  };

  const deleteGroupMessage = async (id: number) => {
    try {
      const res = await axios.delete(`/api/group-messages/${id}`); // Replace with your backend endpoint
      alert(res.data.message);

      // Refetch group messages after deleting
      const fetchRes = await axios.get("/api/group-messages/all");
      setGroupMessages(fetchRes.data);
    } catch (err) {
      console.error("Error deleting group message:", err);
      alert("Failed to delete group message. Please try again.");
    }
  };

  const startEditing = (message: GroupMessageType) => {
    setEditingMessageId(message.id);
    setEditFormData({ ...message });
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>Group Messages Page</h1>

        <div className="container">
          <h2>Add New Group Message</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }} className="form-container">
            <label htmlFor="text">Message Text</label>
            <textarea
                id="text"
                name="text"
                className="new-user"
                placeholder="Message Text"
                value={formData.text}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="groupId">Group ID</label>
            <input
                type="number"
                id="groupId"
                name="groupId"
                className="new-user"
                placeholder="Group ID"
                value={formData.groupId}
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
            <button className="save" onClick={addGroupMessage}>
              Add Group Message
            </button>
          </form>
        </div>

        <div>
          <h2>All Group Messages</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Text</th>
              <th>Timestamp</th>
              <th>Group ID</th>
              <th>Sender ID</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {groupMessages.map((message) => (
                <tr key={message.id}>
                  {editingMessageId === message.id ? (
                      <>
                        <td>{message.id}</td>
                        <td>
                      <textarea
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
                              name="groupId"
                              className="edit-user"
                              value={editFormData?.groupId || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
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
                          <button className="save" onClick={() => saveGroupMessage(message.id)}>
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
                        <td>{message.groupId}</td>
                        <td>{message.senderId || "No Sender ID"}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(message)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deleteGroupMessage(message.id)}>
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
