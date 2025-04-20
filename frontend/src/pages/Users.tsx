import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./Users.css";


export default function Users() {
  type UserType = {
    id: number;
    email: string;
    fullname: string;
    birthDate: string;
    company: string;
    picture_url?: string;
    registered_at?: string;
    last_login?: string;
    role?: string;
  };


  const [users, setUsers] = useState<UserType[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    password: "",
    confirmPassword: "", // For confirmation
    birthDate: "",
    company: "",
  });


  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/all");
        console.log("Fetched users:", res.data); // Debugging logs
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Failed to fetch users.");
      }
    };
    fetchUsers();
  }, []); // Empty dependency array prevents repeated fetches



  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      isEditing: boolean = false
  ) => {
    try {
      if (isEditing && editFormData) {
        const updatedData = {
          ...editFormData,
          [e.target.name]: e.target.value,
        };
        setEditFormData(updatedData);
        console.log("Edit Form Data Updated:", updatedData); // Debugging log
      } else {
        const updatedFormData = {
          ...formData,
          [e.target.name]: e.target.value,
        };
        setFormData(updatedFormData);
        console.log("New Form Data Updated:", updatedFormData); // Debugging log
      }
    } catch (err) {
      console.error("Error handling input changes:", err);
    }
  };

  const addUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return; // Abort submission
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        email: formData.email,
        fullname: formData.fullname,
        password: formData.password, // Only send one password to the backend
        birthDate: formData.birthDate,
        company: formData.company,
      });

      alert(res.data.message);

      // Refetch all users to update the table
      const fetchRes = await axios.get("http://localhost:3000/api/user/all");
      setUsers(fetchRes.data);

      // Reset the form fields
      setFormData({
        email: "",
        fullname: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
        company: "",
      });
    } catch (err) {
      console.error("Error adding user:", err);

      if (err.response) {
        const { status, data } = err.response;

        if (status === 400) {
          alert(`Helytelen adatok: ${data.message.join(", ")}`);
        } else if (status === 409) {
          alert(`E-mail cím foglalt: ${data.message}`);
        } else if (status === 406) {
          alert(`Hiba: ${data.message}`);
        } else {
          alert("Ismeretlen hiba történt. Próbáld újra!");
        }
      } else {
        alert("Kapcsolódási hiba. Próbáld később!");
      }
    }
  };

  const startEditing = (user: UserType) => {
    setEditingUserId(user.id);
    setEditFormData({ ...user });
    console.log("Editing User Data:", user); // Debugging log
  };

  const saveUser = async (id: number) => {
    try {
      if (editFormData) {
        console.log("Data to be Sent to Backend:", editFormData); // Debugging log

        const res = await axios.put(`http://localhost:3000/api/user/one/${id}`, {
          email: editFormData.email,
          fullname: editFormData.fullname,
          birthDate: format(new Date(editFormData.birthDate), "yyyy-MM-dd"),
          company: editFormData.company,
          role: editFormData.role,
        });

        console.log("PUT request sent with Axios");
        console.log("Updated User from Backend:", res.data);

        const fetchRes = await axios.get("http://localhost:3000/api/user/all");
        setUsers(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      console.error("Error during PUT request:", err);

      if (err.response) {
        const { status, data } = err.response;
        console.warn(`Backend responded with status ${status}:`, data);

        if (status === 400) {
          alert(`Invalid data: ${data.message.join(", ")}`);
        } else if (status === 409) {
          alert(`Email address already in use: ${data.message}`);
        } else if (status === 406) {
          alert(`Error: ${data.message}`);
        } else {
          alert("An unknown error occurred. Please try again.");
        }
      } else if (err.request) {
        console.error("The request was made but no response was received:", err.request);
        alert("Connection error. The server may be unavailable.");
      } else {
        console.error("Error setting up the PUT request:", err.message);
        alert(`Unexpected error: ${err.message}`);
      }
    }
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditFormData(null);
  };

  const deleteUser = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/user/one/${id}`);
      console.log("User deleted:", response.data.message);

      const fetchResponse = await axios.get("http://localhost:3000/api/user/all");
      setUsers(fetchResponse.data);
    } catch (err: any) {
      console.error("Error deleting user:", err);

      if (err.response) {
        const { status, data } = err.response;
        alert(data.message || "Error deleting user");
      } else {
        alert("Connection error. Please try again later.");
      }
    }
  };

  return (
      <div className="container">
        <h1>Users Page</h1>

        <div className="container">
          <h2>Add New User</h2>
          <form
              onSubmit={(e) => e.preventDefault()}
              style={{marginBottom: "20px"}}
              className="form-container"
          >
            <label htmlFor="email">Email</label>
            <input
                type="text"
                id="email"
                name="email"
                className="new-user"
                placeholder="Email"
                value={formData.email || ""}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="fullname">Full Name</label>
            <input
                type="text"
                id="fullname"
                name="fullname"
                className="new-user"
                placeholder="Full Name"
                value={formData.fullname || ""}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                name="password"
                className="new-user"
                placeholder="Password"
                value={formData.password || ""}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="new-user"
                placeholder="Confirm Password"
                value={formData.confirmPassword || ""}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="birthDate">Birth Date</label>
            <input
                type="date"
                id="birthDate"
                name="birthDate"
                className="new-user"
                value={formData.birthDate || ""}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="company">Company</label>
            <input
                type="text"
                id="company"
                name="company"
                className="new-user"
                placeholder="Company"
                value={formData.company || ""}
                onChange={(e) => handleChange(e)}
            />
            <button className="save" onClick={addUser}>
              Add User
            </button>
          </form>
        </div>

        <div>
          <h2>All Users</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Password</th>
              <th>Birth Date</th>
              <th>Company</th>
              <th>Picture URL</th>
              <th>Registered At</th>
              <th>Last Login</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                  {editingUserId === user.id ? (
                      <>
                        <td>{user.id}</td>
                        <td>
                          <input
                              className="edit-user"
                              type="email"
                              name="email"
                              value={editFormData?.email || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              className="edit-user"
                              type="text"
                              name="fullname"
                              value={editFormData?.fullname || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>********</td>
                        <td>
                          <input
                              className="edit-user"
                              type="date"
                              name="birthDate"
                              value={
                                editFormData?.birthDate
                                    ? format(new Date(editFormData.birthDate), "yyyy-MM-dd")
                                    : ""
                              }
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              className="edit-user"
                              type="text"
                              name="company"
                              value={editFormData?.company || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>{user.picture_url || "No Picture Available"}</td>
                        <td>{user.registered_at || "Not Registered"}</td>
                        <td>{user.last_login || "Never Logged In"}</td>
                        <td>
                          <select
                              className="edit-user"
                              name="role"
                              value={editFormData?.role || "NORMAL"}
                              onChange={(e) => handleChange(e, true)}
                          >
                            <option value="NORMAL">NORMAL</option>
                            <option value="MODERATOR">MODERATOR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td>
                          <button
                              className="save"
                              onClick={() => {
                                console.log("Save button clicked for user:", user.id); // Debugging log
                                saveUser(user.id);
                              }}
                          >
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>Cancel</button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{user.id}</td>
                        <td>{user.email || "No Email"}</td>
                        <td>{user.fullname || "No Name"}</td>
                        <td>********</td>
                        <td>{user.birthDate ? new Date(user.birthDate).toLocaleDateString() : "No Date Available"}</td>
                        <td>{user.company || "No Company"}</td>
                        <td>{user.picture_url || "No Picture Available"}</td>
                        <td>{user.registered_at || "Not Registered"}</td>
                        <td>{user.last_login || "Never Logged In"}</td>
                        <td>{user.role || "No Role"}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(user)}>Edit</button>
                          <button className="delete" onClick={() => deleteUser(user.id)}>Delete</button>
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
