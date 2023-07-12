import React from "react";
import "./App.css";
import profilePic from "./assets/profile_pic.jpg";
import CarouselComponent from "./CarouselComponent";
import ChatWidget from "./ChatWidget";
import Signup from "./Signup";
import BlogPost from "./blogpost";
import BlogContent from "./BlogContent";
import ChatHistory from "./ChatHistory";

// state variables
function App() {
  const [view, setView] = React.useState("home");
  const [loggedInUser, setLoggedInUser] = React.useState(localStorage.getItem("loggedInUser"));
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [blogPosts, setBlogPosts] = React.useState([]);
  

    // renders the app based on the current view
    const renderContent = () => {
        switch (view) {
          // home page view
            case "home":
                // Wrap the entire code block inside a React.Fragment
                    return (
                      <React.Fragment>
                        {/* Left section */}
                        <div className="left-section">
                          {/* Display the profile picture */}
                          <img src={profilePic} alt="Profile" />
                          
                          {/* Display the user's name */}
                          <p>Young Beum, Cho</p>
                          
                          {/* Display user's birthdate */}
                          <span>Birthdate: March 1, 1995</span>
                          
                          {/* Display user's contact */}
                          <span>Contact: c.youngbeum@wustl.edu</span>
                          
                          {/* Display user's LinkedIn */}
                          <span>
                            LinkedIn:{" "}
                            <a
                              href="https://www.linkedin.com/in/beeybcho"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {" "}
                              https://www.linkedin.com/in/beeybcho{" "}
                            </a>
                          </span>
                          
                          {/* Check if the user is logged in */}
                          {loggedInUser ? (
                            <React.Fragment>
                              {/* If the user is logged in, display a welcome message */}
                              <br></br><br></br><br></br>
                              <p>Welcome, {loggedInUser}!</p>
                              
                              {/* Add a logout button */}
                              <button className="logout-button" onClick={handleLogout} style={{ backgroundColor: "red" }}>
                                Log out
                              </button>
                              
                              {/* Show the create post button if the logged-in user has a manager role */}
                              {localStorage.getItem("userRole") === "manager" && (
                                <button className="create-post-button" onClick={() => setView("blogpost")}>
                                  Create Post
                                </button>
                              )}
                              
                              {/* Show the chat history button */}
                              <button className="chat-history-button" onClick={() => setView("chathistory")}>
                                Chat History
                              </button>
                            </React.Fragment>
                          ) : (
                            // If the user is not logged in, show the login and sign up form
                            <div className="login-section">
                              <input type="text" placeholder="User ID" className="login-input" />
                              <input type="password" placeholder="Password" className="login-input" />
                              <div className="button-container">
                                <button className="login-button" onClick={handleLogin}>
                                  Login
                                </button>
                                <button className="signup-button" onClick={() => setView("signup")}>
                                  Sign up
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Middle section */}
                        <div className="middle-section">
                          {/* Render the CarouselComponent */}
                          <CarouselComponent />
                          
                          {/* Display the title for the manager's posts */}
                          <h2 className="managers-posts-title">Manager's Posts</h2>
                          
                          {/* Iterate through blogPosts and render the title for each post */}
                          <div className="blog-posts">
                            {blogPosts.map((post) => (
                              <div key={post.id} className="blog-post-container">
                                <p
                                  className="blog-post-title"
                                  onClick={() => {
                                    setSelectedPost(post.id);
                                    setView("blogcontent");
                                  }}
                                >
                                  {post.title}
                                </p>
                                
                                {/* Show the edit post button if the logged-in user has a manager role */}
                                {loggedInUser && localStorage.getItem("userRole") === "manager" && (
                                  <button
                                    className="edit-post-button"
                                    onClick={() => {
                                      setSelectedPost(post.id);
                                      setView("editpost");
                                    }}
                                  >
                                    Edit
                                  </button>
                                )}
                                {loggedInUser && localStorage.getItem("userRole") === "manager" && (
                                  <button className="delete-post-button" onClick={() => handleDeletePost(post.id)}>Delete</button>
                                )}
                              </div>
                            ))}
                          </div>


                        </div>
                        <div className="right-section">
                          <ChatWidget loggedInUser={loggedInUser} />
                        </div>
                    </React.Fragment>
                );
            // signup
            case "signup":
                return <Signup setView={setView} />;
            // blog post creation/editing view
            case "blogpost":
              return (
                <React.Fragment>
                  <div className="left-section"></div>
                  <div className="middle-section">
                    <BlogPost reloadBlogPosts={reloadBlogPosts} />
                  </div>
                  <div className="right-section"></div>
                </React.Fragment>
              );
            // for editing the exisitng post
            case "editpost":
              return (
                <React.Fragment>
                  <div className="left-section"></div>
                  <div className="middle-section">
                    <BlogPost
                      editMode
                      postId={selectedPost}
                      reloadBlogPosts={reloadBlogPosts}
                    />
                  </div>
                  <div className="right-section"></div>
                </React.Fragment>
              );
            // blog page view
            case "blogcontent":
              return (
                <React.Fragment>
                  <div className="left-section"></div>
                  <div className="middle-section">
                    <BlogContent postId={selectedPost} />
                  </div>
                  <div className="right-section"></div>
                </React.Fragment>
              );
            // for seeing chat history
            case "chathistory":
              return (
                <React.Fragment>
                  <div className="left-section"></div>
                  <div className="middle-section">
                    <ChatHistory loggedInUser={loggedInUser} />
                  </div>
                  <div className="right-section"></div>
                </React.Fragment>
              );
  
            default:
                return <div>Page not found</div>;
        }
    };

    // Function to handle user login
const handleLogin = async () => {
  // Get the user ID and password from the input fields
  const userId = document.querySelector(".login-input[type='text']").value;
  const userPass = document.querySelector(".login-input[type='password']").value;

  // Send a POST request to the API to authenticate the user
  try {
    const response = await fetch("http://54.160.115.159:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userId, password: userPass }),
    });

    // Get the response JSON
    const result = await response.json();

    // If the login is successful, set the loggedInUser state, store user data in localStorage and reload the page
    if (result.success) {
      setLoggedInUser(result.username);
      localStorage.setItem("loggedInUser", result.username);
      localStorage.setItem("userRole", result.user_role);
      window.location.reload();
    } else {
      // If the login is unsuccessful, show an alert message
      alert("Incorrect Username or/and Password");
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};

// Function to handle user logout
const handleLogout = () => {
  // Remove user data from localStorage, reset loggedInUser state, and reload the page
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userRole");
  setLoggedInUser(null);
  window.location.reload();
};

// Function to fetch blog posts
const fetchBlogPosts = async () => {
  try {
    const response = await fetch("http://54.160.115.159:5000/api/fetch_posts");
    const data = await response.json();
    setBlogPosts(data.posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
};

// Function to reload blog posts
const reloadBlogPosts = () => {
  setBlogPosts([]);
  fetchBlogPosts();
};

// Function to handle deleting a post
const handleDeletePost = async (postId) => {
  try {
    // Send a DELETE request to the API with the post ID
    await fetch(`http://54.160.115.159:5000/api/delete_post/${postId}`, {
      method: "DELETE",
    });

    // Reload blog posts after deletion
    reloadBlogPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

    
  
    React.useEffect(() => {
      fetchBlogPosts();
    }, []);

    return <div className="App">{renderContent()}</div>;
}

export default App;
