// Import necessary modules and hooks
import React, { useState, useEffect } from "react";

// Define the BlogContent component that takes a postId as a prop
function BlogContent({ postId }) {
  // Declare a state variable to store the fetched blog post
  const [post, setPost] = useState(null);

  // Use the useEffect hook to fetch the blog post when the component mounts
  useEffect(() => {
    // Define an asynchronous function to fetch the post data
    const fetchPost = async () => {
      try {
        // Make a fetch request to the API with the given postId
        const response = await fetch(`http://54.160.115.159:5000/api/fetch_post/${postId}`);
        
        // Parse the response data as JSON
        const data = await response.json();
        
        // Update the post state with the fetched data
        setPost(data.post);
      } catch (error) {
        // Log the error if the fetch request fails
        console.error("Error fetching blog post:", error);
      }
    };

    // Call the fetchPost function
    fetchPost();
  }, [postId]); // The useEffect hook depends on the postId prop

  // Show a loading message while the post data is being fetched
  if (!post) {
    return <div>Loading...</div>;
  }

  // Render the blog post content when the data has been fetched
  return (
    <div className="blog-content">
      {/* Display the post title */}
      <h1>{post.title}</h1>
      
      {/* Display the post content */}
      <p>{post.content}</p>
      
      {/* Add a button to navigate back to the homepage */}
      <button
        className="homepage-button"
        onClick={() => (window.location.href = "http://54.160.115.159:3000/")}
      >
        Go to Homepage
      </button>
    </div>
  );
}

// Export the BlogContent component
export default BlogContent;
