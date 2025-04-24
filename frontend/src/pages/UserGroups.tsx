import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function UserGroups() {
  type UserGroupType = {
    id: string;
    pending: number; // 0 (accepted) or 1 (pending)
    role: string; // Role in the group (e.g., NORMAL, ADMIN)
    userId: number; // User ID
    groupId: number; // Group ID
  };

  const [userGroups, setUserGroups] = useState<UserGroupType[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    pending: "1", // Default to "Pending"
    role: "NORMAL", // Default role
    userId: "",
    groupId: "",
  });
  const [editingUserGroupId, setEditingUserGroupId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<UserGroupType | null>(null);

  // // Fetch user groups on component mount
  // useEffect(() => {
  //   const fetchUserGroups = async () => {
  //     try {
  //       const res = await axios.get("/api/user-groups/all"); // Replace with your backend endpoint
  //       console.log("Fetched user groups:", res.data);
  //       setUserGroups(res.data);
  //     } catch (err) {
  //       console.error("Error fetching user groups:", err);
  //       alert("Failed to fetch user groups.");
  //     }
  //   };
  //   fetchUserGroups();
  // }, []);

  useEffect(() => {
    const fetchDummyUserGroups = async () => {
      const dummyUserGroups = [
        {
          id: "UG1",
          pending: 1, // Pending status
          role: "NORMAL", // Role in the group
          userId: 101, // User ID
          groupId: 201, // Group ID
        },
        {
          id: "UG2",
          pending: 0, // Accepted status
          role: "ADMIN", // Role in the group
          userId: 102,
          groupId: 202,
        },
        {
          id: "UG3",
          pending: 1, // Pending status
          role: "NORMAL", // Role in the group
          userId: 103,
          groupId: 203,
        },
      ];

      // Simulate a delay to mimic backend data fetching
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      console.log("Fetched dummy user groups:", dummyUserGroups);
      setUserGroups(dummyUserGroups); // Update state with dummy data
    };

    fetchDummyUserGroups();
  }, []);



  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      isEditing: boolean = false
  ) => {
    if (isEditing && editFormData) {
      setEditFormData({...editFormData, [e.target.name]: e.target.value});
    } else {
      setFormData({...formData, [e.target.name]: e.target.value});
    }
  };

  const addUserGroup = async () => {
    if (!formData.id.trim() || !formData.userId || !formData.groupId) {
      alert("ID, User ID, and Group ID are required.");
      return;
    }

    try {
      const res = await axios.post("/api/user-groups", {
        id: formData.id,
        pending: parseInt(formData.pending),
        role: formData.role,
        userId: parseInt(formData.userId),
        groupId: parseInt(formData.groupId),
      }); // Replace with your backend endpoint

      alert(res.data.message);

      // Refetch user groups after adding
      const fetchRes = await axios.get("/api/user-groups/all");
      setUserGroups(fetchRes.data);

      // Reset the form
      setFormData({
        id: "",
        pending: "1",
        role: "NORMAL",
        userId: "",
        groupId: "",
      });
    } catch (err) {
      console.error("Error adding user group:", err);
      alert("Failed to add user group. Please try again.");
    }
  };

  const saveUserGroup = async (id: string) => {
    try {
      if (editFormData) {
        const res = await axios.put(`/api/user-groups/${id}`, {
          id: editFormData.id,
          pending: editFormData.pending,
          role: editFormData.role,
          userId: editFormData.userId,
          groupId: editFormData.groupId,
        }); // Replace with your backend endpoint

        alert(res.data.message);

        // Refetch user groups after editing
        const fetchRes = await axios.get("/api/user-groups/all");
        setUserGroups(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      console.error("Error editing user group:", err);
      alert("Failed to edit user group. Please try again.");
    }
  };

  const deleteUserGroup = async (id: string) => {
    try {
      const res = await axios.delete(`/api/user-groups/${id}`); // Replace with your backend endpoint
      alert(res.data.message);

      // Refetch user groups after deleting
      const fetchRes = await axios.get("/api/user-groups/all");
      setUserGroups(fetchRes.data);
    } catch (err) {
      console.error("Error deleting user group:", err);
      alert("Failed to delete user group. Please try again.");
    }
  };

  const startEditing = (userGroup: UserGroupType) => {
    setEditingUserGroupId(userGroup.id);
    setEditFormData({...userGroup});
  };

  const cancelEditing = () => {
    setEditingUserGroupId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>User Groups Page</h1>

        <div className="container">
          <h2>Add New User Group</h2>
          <form
              onSubmit={(e) => e.preventDefault()}
              style={{marginBottom: "20px"}}
              className="form-container"
          >
            <label htmlFor="id">ID</label>
            <input
                type="text"
                id="id"
                name="id"
                className="new-user"
                placeholder="User Group ID"
                value={formData.id}
                onChange={(e) => handleChange(e)}
            />
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
            <label htmlFor="role">Role</label>
            <input
                type="text"
                id="role"
                name="role"
                className="new-user"
                placeholder="Role"
                value={formData.role}
                onChange={(e) => handleChange(e)}
            />
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
            <button className="save" onClick={addUserGroup}>
              Add User Group
            </button>
          </form>
        </div>

        <div>
          <h2>All User Groups</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Pending</th>
              <th>Role</th>
              <th>User ID</th>
              <th>Group ID</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {userGroups.map((userGroup) => (
                <tr key={userGroup.id}>
                  {editingUserGroupId === userGroup.id ? (
                      <>
                        <td>
                          <input
                              type="text"
                              name="id"
                              className="edit-user"
                              value={editFormData?.id || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <select
                              name="pending"
                              className="edit-user"
                              value={editFormData?.pending.toString() || "1"}
                              onChange={(e) => handleChange(e, true)}
                          >
                            <option value="1">Pending</option>
                            <option value="0">Accepted</option>
                          </select>
                        </td>
                        <td>
                          <input
                              type="text"
                              name="role"
                              className="edit-user"
                              value={editFormData?.role || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
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
                              name="groupId"
                              className="edit-user"
                              value={editFormData?.groupId || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <button
                              className="save"
                              onClick={() => saveUserGroup(userGroup.id)}
                          >
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{userGroup.id}</td>
                        <td>{userGroup.pending === 1 ? "Pending" : "Accepted"}</td>
                        <td>{userGroup.role}</td>
                        <td>{userGroup.userId}</td>
                        <td>{userGroup.groupId}</td>
                        <td>
                          <button
                              className="edit"
                              onClick={() => startEditing(userGroup)}
                          >
                            Edit
                          </button>
                          <button
                              className="delete"
                              onClick={() => deleteUserGroup(userGroup.id)}
                          >
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

