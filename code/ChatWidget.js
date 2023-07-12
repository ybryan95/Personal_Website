import React, { useState, useEffect } from "react";
import "./App.css";
import chatIcon from "./assets/chaticon.jpg";
import axios from 'axios';
import spinnerImage from "./assets/spinner.gif";



// Define ChatWidget component that accepts loggedInUser prop
const ChatWidget = ({ loggedInUser }) => {

  // Set initial state variables with useState hooks
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true); 
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to bottom of chat log on every new message using useEffect hook
  useEffect(() => {
    const chatLog = document.querySelector(".chat-log");
    if (chatLog) {
      chatLog.scrollTop = chatLog.scrollHeight;
    }
  }, [messages]);

  // Toggle the chat widget display when chat icon is clicked
  const toggleChat = () => {
    if (!isOpen) {
      setMessages([
        ...messages,
        {
          text: "Hello there! My name is Young Beum Cho, and you can call me YB here.",
          sender: "AI",
        },
      ]);
    }
    setIsOpen(!isOpen);
    setShowBubble(false);
  };

  // Handle user input change in the chat field
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Send message to the chatbot API
  const sendMessage = async () => {

    if (inputText.trim()) {
      setIsLoading(true);
      setMessages([...messages, { text: inputText.trim(), sender: "User" }]);
      setInputText("");
      try {
        const response = await axios.post(
          "http://54.160.115.159:5000/api/send_message",
          {
            user_input: inputText.trim(),
            username: loggedInUser || "",
          }
        );
        const AI_reply = response.data.AI_reply;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: AI_reply, sender: "AI" },
        ]);
      } catch (error) {
        console.error("Error while sending message to the server", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Render the chat widget
  return (
    <div className={`fixed chat-widget ${isOpen ? 'chat-open' : ''}`}>
      {isOpen ? (
        <div className="chatbox">
          <div className="chat-log">
            {/* Map over the messages array and render each message */}
            {messages.map((message, index) => (
                <div
                key={index}
                className={`message ${message.sender === "AI" ? "ai-message" : "user-message"}`}
                >
                {message.text}
                </div>
            ))}
          </div>
              
          <div className="textarea-container">

            {/* Show loading spinner while sending message to API */}
            <div className="loading-container" style={{ display: isLoading ? "flex" : "none" }}> 
              <img src={spinnerImage} alt="Loading..." /> 
            </div>

            {/* Render the chat field and Send button */}
            <textarea 
                className="chat-field" 
                placeholder="Send a message..." 
                rows="1"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                    }
                }}
                ></textarea> <button onClick={sendMessage}> Send</button>
          </div>
        </div>
      ) : null}
      <div className="chat-widget-icon" onClick={toggleChat}>
        <img src={chatIcon} alt="Chat Icon" />
      </div>
      {showBubble ? ( 
        <div className="talk-bubble tri-right border right-in">
          <div className="talktext">
            <p>Try chatting with my Chatbot trained with my resume + more(Click Photo)</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChatWidget;
