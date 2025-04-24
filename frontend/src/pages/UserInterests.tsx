import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function UserInterests() {
  type UserInterestType = {
    id: number;
    userId: number;
    interestId: number;
  };

  const [userInterests, setUserInterests] = useState<UserInterestType[]>([]);
  const [formData, setFormData] = useState({
    userId: "",
    interestId: "",
  });
  const [editingUserInterestId, setEditingUserInterestId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UserInterestType | null>(null);

  // // Fetch user interests on component mount
  // useEffect(() => {
  //   const fetchUserInterests = async () => {
  //     try {
  //       const res = await axios.get("/api/user-interests/all"); // Replace with your backend endpoint
  //       console.log("Fetched user interests:", res.data);
  //       setUserInterests(res.data);
  //     } catch (err) {
  //       console.error("Error fetching user interests:", err);
  //       alert("Failed to fetch user interests.");
  //     }
  //   };
  //   fetchUserInterests();
  // }, []);

  useEffect(() => {
    const fetchDummyUserInterests = async () => {
      const dummyUserInterests = [
        { id: 1, userId: 101, interestId: 201 },
        { id: 2, userId: 102, interestId: 202 },
        { id: 3, userId: 103, interestId: 203 },
      ];

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      console.log("Fetched dummy user interests:", dummyUserInterests);
      setUserInterests(dummyUserInterests); // Update state with dummy data
    };

    fetchDummyUserInterests();
  }, []);


  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      isEditing: boolean = false
  ) => {
    if (isEditing && editFormData) {
      setEditFormData({ ...editFormData, [e.target.name]: parseInt(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addUserInterest = async () => {
    if (!formData.userId || !formData.interestId) {
      alert("Both User ID and Interest ID are required.");
      return;
    }

    try {
      const res = await axios.post("/api/user-interests", {
        userId: parseInt(formData.userId),
        interestId: parseInt(formData.interestId),
      }); // Replace with your backend endpoint

      alert(res.data.message);

      // Refetch user interests after adding
      const fetchRes = await axios.get("/api/user-interests/all");
      setUserInterests(fetchRes.data);

      // Reset the form
      setFormData({
        userId: "",
        interestId: "",
      });
    } catch (err) {
      console.error("Error adding user interest:", err);
      alert("Failed to add user interest. Please try again.");
    }
  };

  const saveUserInterest = async (id: number) => {
    try {
      if (editFormData) {
        const res = await axios.put(`/api/user-interests/${id}`, {
          userId: editFormData.userId,
          interestId: editFormData.interestId,
        }); // Replace with your backend endpoint

        alert(res.data.message);

        // Refetch user interests after editing
        const fetchRes = await axios.get("/api/user-interests/all");
        setUserInterests(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      console.error("Error editing user interest:", err);
      alert("Failed to edit user interest. Please try again.");
    }
  };

  const deleteUserInterest = async (id: number) => {
    try {
      const res = await axios.delete(`/api/user-interests/${id}`); // Replace with your backend endpoint
      alert(res.data.message);

      // Refetch user interests after deleting
      const fetchRes = await axios.get("/api/user-interests/all");
      setUserInterests(fetchRes.data);
    } catch (err) {
      console.error("Error deleting user interest:", err);
      alert("Failed to delete user interest. Please try again.");
    }
  };

  const startEditing = (userInterest: UserInterestType) => {
    setEditingUserInterestId(userInterest.id);
    setEditFormData({ ...userInterest });
  };

  const cancelEditing = () => {
    setEditingUserInterestId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>User Interests Page</h1>

        <div className="container">
          <h2>Add New User Interest</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }} className="form-container">
            <label htmlFor="userId">User ID</label>
            <input
                type="number"
                id="userId"
                name="userId"
                className="new-user"
                placeholder="User ID"
                value={formData.userId}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="interestId">Interest ID</label>
            <input
                type="number"
                id="interestId"
                name="interestId"
                className="new-user"
                placeholder="Interest ID"
                value={formData.interestId}
                onChange={(e) => handleChange(e)}
            />
            <button className="save" onClick={addUserInterest}>
              Add User Interest
            </button>
          </form>
        </div>

        <div>
          <h2>All User Interests</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Interest ID</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {userInterests.map((userInterest) => (
                <tr key={userInterest.id}>
                  {editingUserInterestId === userInterest.id ? (
                      <>
                        <td>{userInterest.id}</td>
                        <td>
                          <input
                              type="number"
                              name="userId"
                              className="edit-user"
                              value={editFormData?.userId || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              type="number"
                              name="interestId"
                              className="edit-user"
                              value={editFormData?.interestId || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <button className="save" onClick={() => saveUserInterest(userInterest.id)}>
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{userInterest.id}</td>
                        <td>{userInterest.userId}</td>
                        <td>{userInterest.interestId}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(userInterest)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deleteUserInterest(userInterest.id)}>
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
