import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Import the updated CSS

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
  const [formData, setFormData] = useState<UserType>({
    id: 0,
    email: "",
    fullname: "",
    birth_date: "",
    company: "",
    picture_url: "",
    registered_at: "",
    last_login: "",
  });

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<UserType | null>(null);


  //Ez dummy adatokkal írja ki a tablazatot, mert backend nélkül ne látszik semmi!
  //Viszont a gombok nem működnek!!!
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const dummyData = [
          {
            id: 1,
            email: "john.doe@example.com",
            fullname: "John Doe",
            birth_date: "1990-01-01",
            company: "Doe Enterprises",
            picture_url: "",
            registered_at: "2023-04-01",
            last_login: "2023-04-10",
          },
          {
            id: 2,
            email: "jane.smith@example.com",
            fullname: "Jane Smith",
            birth_date: "1985-07-15",
            company: "Smith Solutions",
            picture_url: "",
            registered_at: "2023-03-15",
            last_login: "2023-04-05",
          },
        ];
        setUsers(dummyData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // //Ez a backendre kötött verzió
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axios.get("/api/users"); // Replace with the backend endpoint
  //       setUsers(res.data);
  //     } catch (err) {
  //       console.error("Error fetching users:", err);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

// Handle input changes for adding or editing
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

// Add a new user
  const addUser = async () => {
    try {
      const res = await axios.post("/api/users", formData); // Replace with the backend endpoint
      setUsers([...users, res.data]);
      setFormData({
        id: 0,
        email: "",
        fullname: "",
        birth_date: "",
        company: "",
        picture_url: "",
        registered_at: "",
        last_login: "",
      });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Start editing a user
  const startEditing = (user: UserType) => {
    setEditingUserId(user.id);
    setEditFormData({ ...user });
  };

  // Save edited user
  const saveUser = () => {
    if (editFormData) {
      axios.put(`/api/users/${editFormData.id}`, editFormData) // Replace with the backend endpoint
          .then(() => {
            setUsers(users.map((user) =>
                user.id === editFormData.id ? editFormData : user
            ));
            cancelEditing();
          })
          .catch((err) => console.error(err));
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUserId(null);
    setEditFormData(null);
  };

  // Delete a user
  const deleteUser = (id: number) => {
    axios.delete(`/api/users/${id}`) // Replace with the backend endpoint
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
            <label htmlFor="id">ID</label>
            <input
                type="number"
                id="id"
                name="id"
                className="new-user"
                placeholder="ID"
                value={formData.id || ""}
                onChange={(e) => handleChange(e)}
            />
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
            <label htmlFor="picture_url">Picture URL</label>
            <input
                type="text"
                id="picture_url"
                name="picture_url"
                className="new-user"
                placeholder="Picture URL"
                value={formData.picture_url || ""}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="registered_at">Registered At</label>
            <input
                type="date"
                id="registered_at"
                name="registered_at"
                className="new-user"
                value={formData.registered_at || ""}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="last_login">Last Login</label>
            <input
                type="date"
                id="last_login"
                name="last_login"
                className="new-user"
                value={formData.last_login || ""}
                onChange={(e) => handleChange(e)}
            />
            <button className="save" onClick={addUser}>
              Add User
            </button>
          </form>
        </div>


        {/* Table for listing users */}
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
