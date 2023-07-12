// Importing required dependencies
import React, { useState, useEffect, useCallback } from "react";
import "./blogstyle.css";

// Component to create/edit a blog post
function BlogPost({ editMode, postId, reloadBlogPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Function to fetch blog post data
  const fetchPostData = useCallback(async () => {
    try {
      const response = await fetch(
        `http://54.160.115.159:5000/api/fetch_post/${postId}`
      );
      const data = await response.json();
      setTitle(data.post.title);
      setContent(data.post.content);
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  }, [postId]);

  // Fetching post data on component mount or when postId/editMode changes
  useEffect(() => {
    if (editMode && postId) {
      fetchPostData();
    }
  }, [editMode, postId, fetchPostData]);

  // Function to handle form submission
  const handleSubmit = async () => {
    const url = editMode
      ? `http://54.160.115.159:5000/api/edit_post/${postId}`
      : "http://54.160.115.159:5000/api/create_post";
    const method = editMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Post updated successfully");
        reloadBlogPosts();
        window.location.href = "http://54.160.115.159:3000/";
      } else {
        alert("Error updating post");
      }
    } catch (error) {
      console.error("Error during post update:", error);
    }
  };

  // Returning JSX for the BlogPost component
  return (
    <div className="blog-form-container">
      <div className="blog-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit}>Submit</button>
        <br></br>
        <br></br>
        <button
          onClick={() => (window.location.href = "http://54.160.115.159:3000/")}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default BlogPost;
