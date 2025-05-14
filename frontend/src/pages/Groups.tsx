import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function Groups() {
  type GroupType = {
    id: number;
    name: string;
    private: boolean;
    memberCount: number;
  };

  const [groups, setGroups] = useState<GroupType[]>([]);
  const [formData, setFormData] = useState({ name: "", private: false });
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<GroupType | null>(null);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/group");
        console.log("Fetched groups:", res.data);
        setGroups(res.data);
      } catch (err) {
        console.error("Error fetching groups:", err);
        alert("Failed to fetch groups.");
      }
    };

    fetchGroups();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    if (isEditing && editFormData) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handlePrivacyChange = (isEditing: boolean) => {
    if (isEditing && editFormData) {
      setEditFormData({ ...editFormData, private: !editFormData.private });
    } else {
      setFormData({ ...formData, private: !formData.private });
    }
  };

  const addGroup = async () => {
    if (!formData.name.trim()) {
      alert("Group name cannot be empty.");
      return;
    }

    try {
      const res = await axios.post(
          "http://localhost:3000/api/group",
          { name: formData.name, private: formData.private },
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );

      alert("Group added successfully!");
      setGroups((prev) => [...prev, res.data]);
      setFormData({ name: "", private: false });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add group.");
      console.error("Error adding group:", err);
    }
  };

  const saveGroup = async (id: number) => {
    if (!editFormData) return;

    try {
      await axios.put(
          `http://localhost:3000/api/group/one/${id}`,
          { name: editFormData.name, private: editFormData.private },
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );

      alert("Group updated successfully!");
      setGroups((prev) =>
          prev.map((group) =>
              group.id === id ? { ...group, name: editFormData.name, private: editFormData.private } : group
          )
      );
      cancelEditing();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to edit group.");
      console.error("Error editing group:", err);
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/group/one/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });

      alert("Group deleted successfully!");
      setGroups((prev) => prev.filter((group) => group.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete group.");
      console.error("Error deleting group:", err);
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
          <form onSubmit={(e) => e.preventDefault()} className="form-container">
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
            <label>
              <input
                  type="checkbox"
                  checked={formData.private}
                  onChange={(e) => setFormData({ ...formData, private: e.target.checked })}
              />
              Private
            </label>
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
              <th>Privacy</th>
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
                          <label>
                            <input type="checkbox" checked={editFormData?.private || false}
                                   onChange={() => handlePrivacyChange(true)}/>
                            Private
                          </label>
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
                        <td>{group.private ? "Private" : "Public"}</td>
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
