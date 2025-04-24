import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css";

export default function Interests() {
  type InterestType = {
    id: number;
    name: string;
  };

  const [interests, setInterests] = useState<InterestType[]>([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingInterestId, setEditingInterestId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<InterestType | null>(null);

  // // Fetch interests on component mount
  // useEffect(() => {
  //   const fetchInterests = async () => {
  //     try {
  //       const res = await axios.get("/api/interests/all"); // Placeholder endpoint
  //       console.log("Fetched interests:", res.data);
  //       setInterests(res.data);
  //     } catch (err) {
  //       console.error("Error fetching interests:", err);
  //       alert("Failed to fetch interests.");
  //     }
  //   };
  //   fetchInterests();
  // }, []);

  useEffect(() => {
    // Dummy data for testing
    const dummyInterests = [
      { id: 1, name: "Programming" },
      { id: 2, name: "Photography" },
      { id: 3, name: "Gaming" },
      { id: 4, name: "Traveling" },
      { id: 5, name: "Cooking" },
    ];

    // Simulate a delay as if fetching from the backend
    const fetchDummyData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      console.log("Fetched dummy interests:", dummyInterests);
      setInterests(dummyInterests);
    };

    fetchDummyData();
  }, []);


  // Handle input changes for both adding and editing forms
  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      isEditing: boolean = false
  ) => {
    try {
      if (isEditing && editFormData) {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
      } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }
    } catch (err) {
      console.error("Error handling input changes:", err);
    }
  };

  // Add a new interest
  const addInterest = async () => {
    if (!formData.name.trim()) {
      alert("Interest name cannot be empty.");
      return;
    }

    try {
      const res = await axios.post("/api/interests", { name: formData.name }); // Placeholder endpoint
      alert(res.data.message);

      // Refetch interests after adding
      const fetchRes = await axios.get("/api/interests/all");
      setInterests(fetchRes.data);

      // Reset the form
      setFormData({ name: "" });
    } catch (err) {
      console.error("Error adding interest:", err);
      alert("Failed to add interest. Please try again.");
    }
  };

  // Edit an interest
  const saveInterest = async (id: number) => {
    try {
      if (editFormData) {
        const res = await axios.put(`/api/interests/${id}`, { name: editFormData.name }); // Placeholder endpoint
        alert(res.data.message);

        // Refetch interests after editing
        const fetchRes = await axios.get("/api/interests/all");
        setInterests(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      console.error("Error editing interest:", err);
      alert("Failed to edit interest. Please try again.");
    }
  };

  // Start editing mode
  const startEditing = (interest: InterestType) => {
    setEditingInterestId(interest.id);
    setEditFormData({ ...interest });
  };

  // Cancel editing mode
  const cancelEditing = () => {
    setEditingInterestId(null);
    setEditFormData(null);
  };

  // Delete an interest
  const deleteInterest = async (id: number) => {
    try {
      const res = await axios.delete(`/api/interests/${id}`); // Placeholder endpoint
      alert(res.data.message);

      // Refetch interests after deleting
      const fetchRes = await axios.get("/api/interests/all");
      setInterests(fetchRes.data);
    } catch (err) {
      console.error("Error deleting interest:", err);
      alert("Failed to delete interest. Please try again.");
    }
  };

  return (
      <div className="container">
        <h1>Interests Page</h1>

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
                              className="edit-interest"
                              type="text"
                              name="name"
                              value={editFormData?.name || ""}
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
