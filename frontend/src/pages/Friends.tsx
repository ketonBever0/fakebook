import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function Friends() {
  type FriendType = {
    id: number;
    pending: number; // 0 or 1
    when: string; // Timestamp
    senderId: number;
    receiverId: number;
  };

  const [friends, setFriends] = useState<FriendType[]>([]);
  const [formData, setFormData] = useState({
    pending: "1",
    senderId: "",
    receiverId: "",
  });
  const [editingFriendId, setEditingFriendId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<FriendType | null>(null);

  // // Fetch friends on component mount
  // useEffect(() => {
  //   const fetchFriends = async () => {
  //     try {
  //       const res = await axios.get("/api/friends/all"); // Replace with your backend endpoint
  //       console.log("Fetched friends:", res.data);
  //       setFriends(res.data);
  //     } catch (err) {
  //       console.error("Error fetching friends:", err);
  //       alert("Failed to fetch friends.");
  //     }
  //   };
  //   fetchFriends();
  // }, []);

  useEffect(() => {
    const fetchDummyFriends = async () => {
      // Dummy data for testing
      const dummyFriends = [
        {
          id: 1,
          pending: 1, // Friendship request is pending
          when: new Date().toISOString(), // Current timestamp
          senderId: 101, // ID of the sender
          receiverId: 102, // ID of the receiver
        },
        {
          id: 2,
          pending: 0, // Friendship request is accepted
          when: new Date().toISOString(), // Current timestamp
          senderId: 103,
          receiverId: 104,
        },
        {
          id: 3,
          pending: 1, // Friendship request is pending
          when: new Date().toISOString(), // Current timestamp
          senderId: 105,
          receiverId: 106,
        },
      ];

      // Simulate a delay, as if fetching from the backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

      console.log("Fetched dummy friends:", dummyFriends);
      setFriends(dummyFriends); // Update the state with dummy data
    };

    fetchDummyFriends();
  }, []);


  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      isEditing: boolean = false
  ) => {
    if (isEditing && editFormData) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addFriend = async () => {
    if (!formData.senderId || !formData.receiverId) {
      alert("Both Sender ID and Receiver ID are required.");
      return;
    }

    try {
      const res = await axios.post("/api/friends", {
        pending: parseInt(formData.pending),
        senderId: parseInt(formData.senderId),
        receiverId: parseInt(formData.receiverId),
      }); // Replace with your backend endpoint

      alert(res.data.message);

      // Refetch friends after adding
      const fetchRes = await axios.get("/api/friends/all");
      setFriends(fetchRes.data);

      // Reset the form
      setFormData({
        pending: "1",
        senderId: "",
        receiverId: "",
      });
    } catch (err) {
      console.error("Error adding friend:", err);
      alert("Failed to add friend. Please try again.");
    }
  };

  const saveFriend = async (id: number) => {
    try {
      if (editFormData) {
        const res = await axios.put(`/api/friends/${id}`, {
          pending: editFormData.pending,
          senderId: editFormData.senderId,
          receiverId: editFormData.receiverId,
        }); // Replace with your backend endpoint

        alert(res.data.message);

        // Refetch friends after editing
        const fetchRes = await axios.get("/api/friends/all");
        setFriends(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      console.error("Error editing friend:", err);
      alert("Failed to edit friend. Please try again.");
    }
  };

  const deleteFriend = async (id: number) => {
    try {
      const res = await axios.delete(`/api/friends/${id}`); // Replace with your backend endpoint
      alert(res.data.message);

      // Refetch friends after deleting
      const fetchRes = await axios.get("/api/friends/all");
      setFriends(fetchRes.data);
    } catch (err) {
      console.error("Error deleting friend:", err);
      alert("Failed to delete friend. Please try again.");
    }
  };

  const startEditing = (friend: FriendType) => {
    setEditingFriendId(friend.id);
    setEditFormData({ ...friend });
  };

  const cancelEditing = () => {
    setEditingFriendId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>Friends Page</h1>

        <div className="container">
          <h2>Add New Friendship</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }} className="form-container">
            <label htmlFor="pending">Pending</label>
            <select
                id="pending"
                name="pending"
                className="new-user"
                value={formData.pending}
                onChange={(e) => handleChange(e)}
            >
              <option value="1">Pending</option>
              <option value="0">Accepted</option>
            </select>
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
            <button className="save" onClick={addFriend}>
              Add Friendship
            </button>
          </form>
        </div>

        <div>
          <h2>All Friendships</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Pending</th>
              <th>When</th>
              <th>Sender ID</th>
              <th>Receiver ID</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {friends.map((friend) => (
                <tr key={friend.id}>
                  {editingFriendId === friend.id ? (
                      <>
                        <td>{friend.id}</td>
                        <td>
                          <select
                              name="pending"
                              className="edit-user"
                              value={editFormData?.pending || ""}
                              onChange={(e) => handleChange(e, true)}
                          >
                            <option value="1">Pending</option>
                            <option value="0">Accepted</option>
                          </select>
                        </td>
                        <td>{new Date(friend.when).toLocaleString()}</td>
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
                          <button className="save" onClick={() => saveFriend(friend.id)}>
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{friend.id}</td>
                        <td>{friend.pending === 1 ? "Pending" : "Accepted"}</td>
                        <td>{new Date(friend.when).toLocaleString()}</td>
                        <td>{friend.senderId}</td>
                        <td>{friend.receiverId}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(friend)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deleteFriend(friend.id)}>
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
