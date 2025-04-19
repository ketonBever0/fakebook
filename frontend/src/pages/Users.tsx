import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css";

export default function Users() {
  type UserType = {
    id: number;
    email: string;
    fullname: string;
    birth_date: string;
    company: string;
    picture_url?: string;
    registered_at?: string;
    last_login?: string;
  };

  const [users, setUsers] = useState<UserType[]>([]);
  const [formData, setFormData] = useState<Omit<UserType, "id" | "picture_url" | "registered_at" | "last_login"> & { password: string }>({
    email: "",
    fullname: "",
    birth_date: "",
    company: "",
    password: "",
  });

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/all");
        console.log("Fetched users:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Failed to fetch users.");
      }
    };
    fetchUsers();
  }, []);


  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      isEditing: boolean = false
  ) => {
    try {
      if (isEditing && editFormData) {
        setEditFormData({
          ...editFormData,
          [e.target.name]: e.target.value,
        });
      } else {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      }
    } catch (err) {
      console.error("Error handling input changes:", err);
    }
  };

  const addUser = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        email: formData.email,
        fullname: formData.fullname,
        password: formData.password,
        birthDate: formData.birth_date,
        company: formData.company,
      });

      alert(res.data.message);

      const newUser: UserType = {
        id: users.length + 1, // Ideiglenes ID
        email: formData.email,
        fullname: formData.fullname,
        birth_date: formData.birth_date,
        company: formData.company,
        picture_url: "",
        registered_at: "",
        last_login: "",
      };

      setUsers((prevState) => [...prevState, newUser]);
      setFormData({
        email: "",
        fullname: "",
        birth_date: "",
        company: "",
        password: "",
      });
    } catch (err) {
      console.error("Error adding user:", err);
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message.join(", "));
      } else {
        alert("Failed to register new user.");
      }
    }
  };

  const startEditing = (user: UserType) => {
    setEditingUserId(user.id);
    setEditFormData({ ...user });
  };

  const saveUser = () => {
    if (editFormData) {
      axios.put(`/api/users/${editFormData.id}`, editFormData)
          .then(() => {
            setUsers(users.map((user) =>
                user.id === editFormData.id ? editFormData : user
            ));
            cancelEditing();
          })
          .catch((err) => console.error(err));
    }
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditFormData(null);
  };

  const deleteUser = (id: number) => {
    axios.delete(`/api/users/${id}`)
        .then(() => setUsers(users.filter((user) => user.id !== id)))
        .catch((err) => console.error(err));
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
            <label htmlFor="birth_date">Birth Date</label>
            <input
                type="date"
                id="birth_date"
                name="birth_date"
                className="new-user"
                value={formData.birth_date || ""}
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
              <th>Birth Date</th>
              <th>Company</th>
              <th>Picture URL</th>
              <th>Registered At</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <tr key={user.id}>
                  {editingUserId === user.id ? (
                      <>
                        <td>
                          <input
                              className="edit-user"
                              type="number"
                              name="id"
                              value={editFormData?.id || ""}
                              onChange={e => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              className="edit-user"
                              type="text"
                              name="email"
                              value={editFormData?.email || ""}
                              onChange={e => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              className="edit-user"
                              type="text"
                              name="fullname"
                              value={editFormData?.fullname || ""}
                              onChange={e => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              className="edit-user"
                              type="date"
                              name="birth_date"
                              value={editFormData?.birth_date || ""}
                              onChange={e => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              className="edit-user"
                              type="text"
                              name="company"
                              value={editFormData?.company || ""}
                              onChange={e => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              className="edit-user"
                              type="text"
                              name="picture_url"
                              value={editFormData?.picture_url || ""}
                              onChange={e => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              className="edit-user"
                              type="date"
                              name="registered_at"
                              value={editFormData?.registered_at || ""}
                              onChange={e => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <input
                              className="edit-user"
                              type="date"
                              name="last_login"
                              value={editFormData?.last_login || ""}
                              onChange={e => handleChange(e, true)}
                          />
                        </td>
                        <td>
                          <button className="save" onClick={saveUser}>
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.fullname}</td>
                        <td>{new Date(user.birth_date).toLocaleDateString()}</td>
                        <td>{user.company}</td>
                        <td>{user.picture_url}</td>
                        <td>{user.registered_at}</td>
                        <td>{user.last_login}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(user)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deleteUser(user.id)}>
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
