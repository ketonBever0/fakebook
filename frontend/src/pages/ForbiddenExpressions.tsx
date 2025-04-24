import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function ForbiddenExpressions() {
  type ForbiddenExpressionType = {
    id: number;
    pattern: string;
  };

  const [forbiddenExpressions, setForbiddenExpressions] = useState<ForbiddenExpressionType[]>([]);
  const [formData, setFormData] = useState({ pattern: "" });
  const [editingExpressionId, setEditingExpressionId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<ForbiddenExpressionType | null>({
    id: 0,
    pattern: "",
  });


  // Fetch forbidden expressions on component mount
  useEffect(() => {
    const fetchForbiddenExpressions = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/obscene");
        console.log("Fetched forbidden expressions:", res.data);
        setForbiddenExpressions(res.data);
      } catch (err) {
        console.error("Error fetching forbidden expressions:", err);
        alert("Failed to fetch forbidden expressions.");
      }
    };
    fetchForbiddenExpressions();
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

  const addForbiddenExpression = async () => {
    if (!formData.pattern.trim()) {
      alert("Pattern cannot be empty.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/obscene", { pattern: formData.pattern });

      alert(res.data.message);

      // Refetch forbidden expressions after adding
      const fetchRes = await axios.get("http://localhost:3000/api/obscene");
      setForbiddenExpressions(fetchRes.data);

      // Reset the form
      setFormData({ pattern: "" });
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This forbidden expression already exists!");
      } else {
        console.error("Error adding forbidden expression:", err);
        alert("Failed to add forbidden expression. Please try again.");
      }
    }
  };

  const saveForbiddenExpression = async (id: number) => {
    if (!editFormData?.pattern.trim()) {
      alert("Pattern cannot be empty.");
      return;
    }

    try {
      const res = await axios.put(`http://localhost:3000/api/obscene/${id}`, { pattern: editFormData.pattern });

      alert(res.data.message);

      // Refetch forbidden expressions after editing
      const fetchRes = await axios.get("http://localhost:3000/api/obscene");
      setForbiddenExpressions(fetchRes.data);

      cancelEditing();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("This forbidden expression already exists!");
      } else if (err.response?.status === 404) {
        alert("Forbidden expression not found.");
      } else {
        console.error("Error editing forbidden expression:", err);
        alert("Failed to edit forbidden expression. Please try again.");
      }
    }
  };

  const deleteForbiddenExpression = async (id: number) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/obscene/${id}`);
      alert(res.data.message);

      // Refetch forbidden expressions after deleting
      const fetchRes = await axios.get("http://localhost:3000/api/obscene");
      setForbiddenExpressions(fetchRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Forbidden expression not found.");
      } else {
        console.error("Error deleting forbidden expression:", err);
        alert("Failed to delete forbidden expression. Please try again.");
      }
    }
  };

  const startEditing = (expression: ForbiddenExpressionType) => {
    setEditingExpressionId(expression.id);
    setEditFormData({ ...expression });
  };

  const cancelEditing = () => {
    setEditingExpressionId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>Forbidden Expressions Page</h1>

        {/* Add New Forbidden Expression */}
        <div className="container">
          <h2>Add New Forbidden Expression</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }} className="form-container">
            <label htmlFor="pattern">Pattern</label>
            <input
                type="text"
                id="pattern"
                name="pattern"
                className="new-user"
                placeholder="Forbidden Pattern"
                value={formData.pattern}
                onChange={(e) => handleChange(e)}
            />
            <button className="save" onClick={addForbiddenExpression}>
              Add Forbidden Expression
            </button>
          </form>
        </div>

        {/* Display All Forbidden Expressions */}
        <div>
          <h2>All Forbidden Expressions</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Pattern</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {forbiddenExpressions.map((expression) => (
                <tr key={expression.id}>
                  {editingExpressionId === expression.id ? (
                      <>
                        <td>{expression.id}</td>
                        <td>
                          <input
                              type="text"
                              name="pattern"
                              className="edit-user"
                              value={editFormData?.pattern ?? ""}
                              onChange={(e) => handleChange(e, true)}
                          />

                        </td>
                        <td>
                          <button className="save" onClick={() => saveForbiddenExpression(expression.id)}>
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{expression.id}</td>
                        <td>{expression.pattern}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(expression)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deleteForbiddenExpression(expression.id)}>
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
