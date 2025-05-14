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
  const [formData, setFormData] = useState({ userId: "", interestId: "" });
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserInterests = async () => {
      if (!userData?.id) return;

      try {
        const res = await axios.get(`http://localhost:3000/api/interest/user/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInterests(res.data);
      } catch (err) {
        alert("Failed to fetch user interests.");
        console.error("Error fetching user interests:", err);
      }
    };

    fetchUserInterests();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addUserInterest = async () => {
    if (!formData.userId || !formData.interestId) {
      alert("Both User ID and Interest ID are required.");
      return;
    }

    try {
      await axios.post(
          `http://localhost:3000/api/interest/user/${formData.interestId}`,
          { userId: parseInt(formData.userId) },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserInterests((prev) => [...prev, { id: Date.now(), userId: parseInt(formData.userId), interestId: parseInt(formData.interestId) }]);
      setFormData({ userId: "", interestId: "" });
      alert("User interest added successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user interest.");
      console.error("Error adding user interest:", err);
    }
  };

  const deleteUserInterest = async (userId: number, interestId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/interest/user/${userId}/${interestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserInterests((prev) => prev.filter((ui) => ui.userId !== userId || ui.interestId !== interestId));
      alert("User interest deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user interest.");
      console.error("Error deleting user interest:", err);
    }
  };

  return (
      <div className="container">
        <h1>User Interests Page</h1>

        <div className="container">
          <h2>Add New User Interest</h2>
          <form onSubmit={(e) => e.preventDefault()} className="form-container">
            <label htmlFor="userId">User ID</label>
            <input type="number" name="userId" value={formData.userId} onChange={(e) => handleChange(e)} />
            <label htmlFor="interestId">Interest ID</label>
            <input type="number" name="interestId" value={formData.interestId} onChange={(e) => handleChange(e)} />
            <button onClick={addUserInterest}>Add User Interest</button>
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
            {userInterests.map((ui) => (
                <tr key={ui.id}>
                  <td>{ui.id}</td>
                  <td>{ui.userId}</td>
                  <td>{ui.interestId}</td>
                  <td>
                    <button onClick={() => deleteUserInterest(ui.userId, ui.interestId)}>Delete</button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
