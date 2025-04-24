import { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Reuse Users.css for consistent styling

export default function Posts() {
  type PostType = {
    id: number;
    text: string;
    imageUrl?: string;
    authorId?: number;
  };

  const [posts, setPosts] = useState<PostType[]>([]);
  const [formData, setFormData] = useState({
    text: "",
    imageUrl: "",
    authorId: "",
  });
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<PostType | null>(null);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/post/all");
        console.log("Fetched posts:", res.data);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        alert("Failed to fetch posts.");
      }
    };
    fetchPosts();
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

  const addPost = async () => {
    if (!formData.text.trim()) {
      alert("Post text cannot be empty.");
      return;
    }

    try {
      console.log("Post payload:", {
        text: formData.text,
        imageUrl: formData.imageUrl || null,
        authorId: formData.authorId ? parseInt(formData.authorId) : null,
      });

      const res = await axios.post("http://localhost:3000/api/post/", {
        text: formData.text,
        imageUrl: formData.imageUrl || null,
        authorId: formData.authorId ? parseInt(formData.authorId) : null,
      });


      // Handle successful response
      alert("Post added successfully!");

      // Refetch posts after adding
      const fetchRes = await axios.get("http://localhost:3000/api/post/all");
      setPosts(fetchRes.data);

      // Reset the form
      setFormData({
        text: "",
        imageUrl: "",
        authorId: "",
      });
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Author ID does not exist. Please provide a valid author.");
      } else if (err.response?.status === 400) {
        alert(`Invalid data: ${err.response.data.message.join(", ")}`);
      } else {
        console.error("Error adding post:", err.response?.data || err.message);
        alert("Failed to add post. Please try again.");
      }
    }
  };

  const savePost = async (id: number) => {
    try {
      if (editFormData) {
        const res = await axios.put(`http://localhost:3000/api/post/one/${id}`, {
          text: editFormData.text,
          imageUrl: editFormData.imageUrl || null,
        });

        // Handle successful response
        alert("Post updated successfully!");

        // Refetch posts after editing
        const fetchRes = await axios.get("http://localhost:3000/api/post/all");
        setPosts(fetchRes.data);

        cancelEditing();
      }
    } catch (err) {
      if (err.response?.status === 400) {
        alert(`Invalid data: ${err.response.data.message.join(", ")}`);
      } else if (err.response?.status === 404) {
        alert("Post not found.");
      } else {
        console.error("Error editing post:", err);
        alert("Failed to edit post. Please try again.");
      }
    }
  };

  const deletePost = async (id: number) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/post/one/${id}`);

      // Handle successful response
      alert("Post deleted successfully!");

      // Refetch posts after deleting
      const fetchRes = await axios.get("http://localhost:3000/api/post/all");
      setPosts(fetchRes.data);
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Post not found.");
      } else {
        console.error("Error deleting post:", err);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const startEditing = (post: PostType) => {
    setEditingPostId(post.id);
    setEditFormData({ ...post });
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditFormData(null);
  };

  return (
      <div className="container">
        <h1>Posts Page</h1>

        {/* Add New Post */}
        <div className="container">
          <h2>Add New Post</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: "20px" }} className="form-container">
            <label htmlFor="text">Post Text</label>
            <textarea
                id="text"
                name="text"
                className="new-user"
                placeholder="Post Text"
                value={formData.text}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="imageUrl">Image URL</label>
            <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                className="new-user"
                placeholder="Image URL"
                value={formData.imageUrl}
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
            <button className="save" onClick={addPost}>
              Add Post
            </button>
          </form>
        </div>

        {/* Display All Posts */}
        <div>
          <h2>All Posts</h2>
          <table>
            <thead>
            <tr>
              <th>ID</th>
              <th>Text</th>
              <th>Image URL</th>
              <th>Author ID</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {posts.map((post) => (
                <tr key={post.id}>
                  {editingPostId === post.id ? (
                      <>
                        <td>{post.id}</td>
                        <td>
                    <textarea
                        name="text"
                        className="edit-user"
                        value={editFormData?.text || ""}
                        onChange={(e) => handleChange(e, true)}
                    />
                        </td>
                        <td>
                          <input
                              type="text"
                              name="imageUrl"
                              className="edit-user"
                              value={editFormData?.imageUrl || ""}
                              onChange={(e) => handleChange(e, true)}
                          />
                        </td>
                        <td>{post.authorId || "No Author ID"}</td> {/* Display Author ID */}
                        <td>
                          <button className="save" onClick={() => savePost(post.id)}>
                            Save
                          </button>
                          <button className="cancel" onClick={cancelEditing}>
                            Cancel
                          </button>
                        </td>
                      </>
                  ) : (
                      <>
                        <td>{post.id}</td>
                        <td>{post.text}</td>
                        <td>{post.imageUrl || "No Image URL"}</td>
                        <td>{post.authorId || "No Author ID"}</td>
                        <td>
                          <button className="edit" onClick={() => startEditing(post)}>
                            Edit
                          </button>
                          <button className="delete" onClick={() => deletePost(post.id)}>
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
