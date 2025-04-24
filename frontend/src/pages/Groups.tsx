import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function Groups() {
  type GroupType = {
    id: number;
    name: string;
  };

  const [groups, setGroups] = useState<GroupType[]>([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<GroupType | null>(null);

  // // Fetch groups on component mount
  // useEffect(() => {
  //   const fetchGroups = async () => {
  //     try {
  //       const res = await axios.get("/api/groups/all"); // Replace with your backend endpoint
  //       console.log("Fetched groups:", res.data);
  //       setGroups(res.data);
  //     } catch (err) {
  //       console.error("Error fetching groups:", err);
  //       alert("Failed to fetch groups.");
  //     }
  //   };
  //   fetchGroups();
  // }, []);

  useEffect(() => {
    const fetchDummyGroups = async () => {
      // Dummy data for testing
      const dummyGroups = [
        { id: 1, name: "Tech Enthusiasts" },
        { id: 2, name: "Photography Lovers" },
        { id: 3, name: "Travel Buddies" },
      ];

      // Simulate a delay to mimic backend data fetching
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      console.log("Fetched dummy groups:", dummyGroups);
      setGroups(dummyGroups); // Update state with dummy data
    };

    fetchDummyGroups();
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

  const addGroup = async () => {
    if (!formData.name.trim()) {
      alert("Group name cannot be empty.");
      return;
    }

    try {
      const res = await axios.post("/api/groups", { name: formData.name }); // Replace with your backend endpoint

      alert(res.data.message);

      // Refetch groups after adding
      const fetchRes = await axios.get("/api/groups/all");
      setGroups(fetchRes.data);

      // Reset the form
      setFormData({ name: "" });
    } catch (err) {
      console.error("Error adding group:", err);
      alert("Failed to add group. Please try again.");
    }
  };

  const saveGroup = async (id: number) => {
    try {
      if (editFormData) {
        const res = await axios.put(`/api/groups/${id}`, { name: editFormData.name }); // Replace with your backend endpoint

        alert(res.data.message);

        // Refetch groups after editing
        const fetchRes = await axios.get("/api/groups/all");
        setGroups(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      console.error("Error editing group:", err);
      alert("Failed to edit group. Please try again.");
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      const res = await axios.delete(`/api/groups/${id}`); // Replace with your backend endpoint
      alert(res.data.message);

      // Refetch groups after deleting
      const fetchRes = await axios.get("/api/groups/all");
      setGroups(fetchRes.data);
    } catch (err) {
      console.error("Error deleting group:", err);
      alert("Failed to delete group. Please try again.");
    }
  };

  const startEditing = (group: GroupType) => {
    setEditingGroupId(group.id);
    setEditFormData({ ...group });
  };

  const cancelEditing = () => {
    setEditingGroupId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>Groups Page</h1>

        <div className="container">
          <h2>Add New Group</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }} className="form-container">
            <label htmlFor="name">Group Name</label>
            <input
                type="text"
                id="name"
                name="name"
                className="new-user"
                placeholder="Group Name"
                value={formData.name}
                onChange={(e) => handleChange(e)}
            />
            <button className="save" onClick={addGroup}>
              Add Group
            </button>
          </form>
        </div>

        <div>
          <h2>All Groups</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {groups.map((group) => (
                <tr key={group.id}>
                  {editingGroupId === group.id ? (
                      <>
                        <td>{group.id}</td>
                        <td>
                          <input
                              type="text"
                              name="name"
                              className="edit-user"
                              value={editFormData?.name || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <button className="save" onClick={() => saveGroup(group.id)}>
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{group.id}</td>
                        <td>{group.name}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(group)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deleteGroup(group.id)}>
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
