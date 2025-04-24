import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function Comments() {
  type CommentType = {
    id: number;
    text: string;
    authorId?: number;
    postId: number;
  };

  const [comments, setComments] = useState<CommentType[]>([]);
  const [formData, setFormData] = useState({
    text: "",
    authorId: "",
    postId: "",
  });
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<CommentType | null>(null);

  // Fetch all comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/comment");
        console.log("Fetched comments:", res.data);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        alert("Failed to fetch comments.");
      }
    };
    fetchComments();
  }, []);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      isEditing: boolean = false
  ) => {
    if (isEditing && editFormData) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addComment = async () => {
    if (!formData.text.trim()) {
      alert("Comment text cannot be empty.");
      return;
    }

    try {
      const postId = formData.postId ? parseInt(formData.postId) : null;
      const res = await axios.post(`http://localhost:3000/api/comment/post/${postId}`, {
        text: formData.text,
        authorId: formData.authorId ? parseInt(formData.authorId) : null,
      });

      alert(res.data.message);

      // Refetch comments after adding
      const fetchRes = await axios.get("http://localhost:3000/api/comment");
      setComments(fetchRes.data);

      // Reset the form
      setFormData({
        text: "",
        authorId: "",
        postId: "",
      });
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Post not found.");
      } else {
        console.error("Error adding comment:", err);
        alert("Failed to add comment. Please try again.");
      }
    }
  };

  const saveComment = async (id: number) => {
    try {
      if (editFormData) {
        const res = await axios.put(`http://localhost:3000/api/comment/comment/${id}`, {
          text: editFormData.text,
        });

        alert(res.data.message);

        // Refetch comments after editing
        const fetchRes = await axios.get("http://localhost:3000/api/comment");
        setComments(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Comment not found.");
      } else {
        console.error("Error editing comment:", err);
        alert("Failed to edit comment. Please try again.");
      }
    }
  };

  const deleteComment = async (id: number) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/comment/comment/${id}`);
      alert(res.data.message);

      // Refetch comments after deleting
      const fetchRes = await axios.get("http://localhost:3000/api/comment");
      setComments(fetchRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Comment not found.");
      } else {
        console.error("Error deleting comment:", err);
        alert("Failed to delete comment. Please try again.");
      }
    }
  };

  const startEditing = (comment: CommentType) => {
    setEditingCommentId(comment.id);
    setEditFormData({ ...comment });
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>Comments Page</h1>

        {/* Add New Comment */}
        <div className="container">
          <h2>Add New Comment</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }} className="form-container">
            <label htmlFor="text">Comment Text</label>
            <textarea
                id="text"
                name="text"
                className="new-user"
                placeholder="Comment Text"
                value={formData.text}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="authorId">Author ID</label>
            <input
                type="number"
                id="authorId"
                name="authorId"
                className="new-user"
                placeholder="Author ID"
                value={formData.authorId}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="postId">Post ID</label>
            <input
                type="number"
                id="postId"
                name="postId"
                className="new-user"
                placeholder="Post ID"
                value={formData.postId}
                onChange={(e) => handleChange(e)}
            />
            <button className="save" onClick={addComment}>
              Add Comment
            </button>
          </form>
        </div>

        {/* Display All Comments */}
        <div>
          <h2>All Comments</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Text</th>
              <th>Author ID</th>
              <th>Post ID</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {comments.map((comment) => (
                <tr key={comment.id}>
                  {editingCommentId === comment.id ? (
                      <>
                        <td>{comment.id}</td>
                        <td>
                      <textarea
                          name="text"
                          className="edit-user"
                          value={editFormData?.text ?? ""}
                          onChange={(e) => handleChange(e, true)}
                      />
                        </td>
                        <td>{comment.authorId || "No Author ID"}</td>
                        <td>{comment.postId}</td>
                        <td>
                          <button className="save" onClick={() => saveComment(comment.id)}>
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{comment.id}</td>
                        <td>{comment.text}</td>
                        <td>{comment.authorId || "No Author ID"}</td>
                        <td>{comment.postId}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(comment)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deleteComment(comment.id)}>
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
