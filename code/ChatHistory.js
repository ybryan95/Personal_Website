import React, { useState, useEffect } from "react";

function ChatHistory({ loggedInUser }) {
  const [chatLogs, setChatLogs] = useState([]);

  // This useEffect hook fetches the chat logs for the current user when the component mounts or when the `loggedInUser` state changes
  useEffect(() => {
    const fetchChatLogs = async () => {
      try {
        // The API endpoint for fetching chat logs is called with the current user's username as a parameter
        const response = await fetch(
          `http://54.160.115.159:5000/api/fetch_chat_logs/${loggedInUser}`
        );
        // The response is converted to JSON
        const data = await response.json();
        // The chat logs are set in the `chatLogs` state
        setChatLogs(data.chat_logs);
      } catch (error) {
        console.error("Error fetching chat logs:", error);
      }
    };

    fetchChatLogs();
  }, [loggedInUser]);

  // The chat logs are rendered in a div with a class of `chat-history`. Each chat log item is rendered as a paragraph element with the sender's name and the message content
  // Finally, there is a button that takes the user back to the homepage of the application
  return (
    <div className="chat-history">
      <h1>{loggedInUser}</h1>
      {chatLogs.map((log, index) => (
        <p key={index}>
          <strong>{log.sender}:</strong> {log.content}
        </p>
      ))}
      <button className="homepage-button" onClick={() => (window.location.href = "http://54.160.115.159:3000/")}>
        Go to Homepage
      </button>
    </div>
  );
}

export default ChatHistory;
