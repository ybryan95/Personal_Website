import React, { useState } from "react";

function Signup({ setView }) {
  // Set initial state for username, password, and message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    // Make a POST request to the server
    const response = await fetch("http://54.160.115.159:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Send the username and password as JSON in the request body
      body: JSON.stringify({ username, password }),
    });

    // Parse the response as JSON
    const data = await response.json();

    if (data.success) {
      // If the signup was successful, set the success message
      setMessage("Signup successful! Please return to the login page.");
    } else {
      // Otherwise, set the error message
      setMessage(data.message);
    }
  };

  return (
    <div className="signup">
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
      <p>{message}</p>
      <button onClick={() => setView("home")}>Return to home</button>
    </div>
  );
}

export default Signup;
