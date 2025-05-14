import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function Interests() {
  type InterestType = {
    id: number;
    name: string;
  };

  const [interests, setInterests] = useState<InterestType[]>([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingInterestId, setEditingInterestId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<InterestType | null>(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/interest");
        setInterests(res.data);
      } catch (err) {
        alert("Failed to fetch interests.");
        console.error("Error fetching interests:", err);
      }
    };

    fetchInterests();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    if (isEditing && editFormData) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addInterest = async () => {
    if (!formData.name.trim()) {
      alert("Interest name cannot be empty.");
      return;
    }

    try {
      const res = await axios.post(
          "http://localhost:3000/api/interest",
          { name: formData.name },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      setInterests((prev) => [...prev, res.data]);
      setFormData({ name: "" });
      alert("Interest added successfully!");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This interest already exists!");
      } else {
        console.error("Error adding interest:", err);
        alert("Failed to add interest.");
      }
    }
  };

  const saveInterest = async (id: number) => {
    if (!editFormData?.name.trim()) {
      alert("Interest name cannot be empty.");
      return;
    }

    try {
      await axios.put(
          `http://localhost:3000/api/interest/${id}`,
          { name: editFormData.name },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      setInterests((prev) =>
          prev.map((interest) =>
              interest.id === id ? { ...interest, name: editFormData.name } : interest
          )
      );
      cancelEditing();
      alert("Interest updated successfully!");
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This interest already exists!");
      } else if (err.response?.status === 404) {
        alert("Interest not found.");
      } else {
        console.error("Error editing interest:", err);
        alert("Failed to edit interest.");
      }
    }
  };

  const deleteInterest = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/interest/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInterests((prev) => prev.filter((interest) => interest.id !== id));
      alert("Interest deleted successfully!");
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Interest not found.");
      } else {
        console.error("Error deleting interest:", err);
        alert("Failed to delete interest.");
      }
    }
  };

  const startEditing = (interest: InterestType) => {
    setEditingInterestId(interest.id);
    setEditFormData({ ...interest });
  };

  const cancelEditing = () => {
    setEditingInterestId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>Interests Page</h1>

        <div className="container">
          <h2>Add New Interest</h2>
          <form onSubmit={(e) => e.preventDefault()} className="form-container">
            <label htmlFor="name">Interest Name</label>
            <input type="text" name="name" placeholder="Interest Name" value={formData.name} onChange={(e) => handleChange(e)} />
            <button onClick={addInterest}>Add Interest</button>
          </form>
        </div>

        <div>
          <h2>All Interests</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {interests.map((interest) => (
                <tr key={interest.id}>
                  {editingInterestId === interest.id ? (
                      <>
                        <td>{interest.id}</td>
                        <td>
                          <input type="text" name="name" value={editFormData?.name || ""} onChange={(e) => handleChange(e, true)} />
                        </td>
                        <td>
                          <button onClick={() => saveInterest(interest.id)}>Save</button>
                          <button onClick={cancelEditing}>Cancel</button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{interest.id}</td>
                        <td>{interest.name}</td>
                        <td>
                          <button onClick={() => startEditing(interest)}>Edit</button>
                          <button onClick={() => deleteInterest(interest.id)}>Delete</button>
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
