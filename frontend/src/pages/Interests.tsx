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

  // Fetch interests on component mount
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/interest");
        console.log("Fetched interests:", res.data);
        setInterests(res.data);
      } catch (err) {
        console.error("Error fetching interests:", err);
        alert("Failed to fetch interests.");
      }
    };
    fetchInterests();
  }, []);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      isEditing: boolean = false
  ) => {
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
      const res = await axios.post("http://localhost:3000/api/interest", { name: formData.name });

      alert(res.data.message);

      // Refetch interests after adding
      const fetchRes = await axios.get("http://localhost:3000/api/interest");
      setInterests(fetchRes.data);

      // Reset the form
      setFormData({ name: "" });
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This interest already exists!");
      } else {
        console.error("Error adding interest:", err);
        alert("Failed to add interest. Please try again.");
      }
    }
  };

  const saveInterest = async (id: number) => {
    if (!editFormData?.name.trim()) {
      alert("Interest name cannot be empty.");
      return;
    }

    try {
      const res = await axios.put(`http://localhost:3000/api/interest/${id}`, { name: editFormData.name });

      alert(res.data.message);

      // Refetch interests after editing
      const fetchRes = await axios.get("http://localhost:3000/api/interest");
      setInterests(fetchRes.data);

      cancelEditing();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This interest already exists!");
      } else if (err.response?.status === 404) {
        alert("Interest not found.");
      } else {
        console.error("Error editing interest:", err);
        alert("Failed to edit interest. Please try again.");
      }
    }
  };

  const deleteInterest = async (id: number) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/interest/${id}`);
      alert(res.data.message);

      // Refetch interests after deleting
      const fetchRes = await axios.get("http://localhost:3000/api/interest");
      setInterests(fetchRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Interest not found.");
      } else {
        console.error("Error deleting interest:", err);
        alert("Failed to delete interest. Please try again.");
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

        {/* Add New Interest */}
        <div className="container">
          <h2>Add New Interest</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }} className="form-container">
            <label htmlFor="name">Interest Name</label>
            <input
                type="text"
                id="name"
                name="name"
                className="new-user"
                placeholder="Interest Name"
                value={formData.name}
                onChange={(e) => handleChange(e)}
            />
            <button className="save" onClick={addInterest}>
              Add Interest
            </button>
          </form>
        </div>

        {/* Display All Interests */}
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
                          <input
                              type="text"
                              name="name"
                              className="edit-user"
                              value={editFormData?.name ?? ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <button className="save" onClick={() => saveInterest(interest.id)}>
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{interest.id}</td>
                        <td>{interest.name}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(interest)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deleteInterest(interest.id)}>
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
