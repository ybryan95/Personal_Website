# Personal Website README

[![Website](https://img.shields.io/badge/Website-54.160.115.159:3000-blue)](http://54.160.115.159:3000/)
[![AWS](https://img.shields.io/badge/Deployment-AWS-orange)](https://aws.amazon.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Flask-green)](https://flask.palletsprojects.com/)

## Table of Contents
- [Introduction](#introduction)
- [Technologies](#technologies)
- [Functionalities](#functionalities)
- [Core Files](#core-files)
- [Setup](#setup)

## Introduction <a name = "introduction"></a>
Welcome to the codebase of my personal website! Deployed on AWS, this website is a reflection of my professional persona. It features a carousel component and a resume-data trained chatbot. The chatbot is designed to interact with visitors and answer queries related to my professional background.

## Technologies <a name = "technologies"></a>
- Frontend: React, CSS
- Backend: Python Flask
- Database: MySQL
- Deployment: AWS
- Libraries: React Responsive Carousel, NLTK, OpenAI, PyTZ, Axios, etc.

## Functionalities <a name = "functionalities"></a>
- **Interactive Chatbot**: An in-web, OpenAI-powered chatbot that can answer user queries about me. Accessible through a widget at the bottom right of the page.
- **User Authentication**: Secure registration, login, and logout functionalities for users.
- **Conversation Memory**: The chatbot is designed to remember recent conversations and display the current date (CST).
- **User Feedback Submission**: Users can submit feedback by typing "/feedback {user_Feedback}" in the chatbox.
- **Database Management**: The MySQL database hosts user profiles, chatlogs, and user feedback with structured tables and columns.
- **Content Management (Manager-Level Access Required)**: The website features a blog management system for publishing, viewing, editing, and deleting articles.




## Core Files <a name = "core-files"></a>
The application's essential functionalities are powered by the following files:
- App.css, App.js
- BlogContent.js, blogpost.js, blogstyle.css
- CarouselComponent.js, carousel-custom.css
- ChatHistory.js, ChatWidget.js
- Signup.css, Signup.js
- app.py
- index.css, index.js
- reportWebVitals.js, setupTests.js

## Setup <a name = "setup"></a>
To run this project locally, you would need to clone the repository and install it using npm. Please note that running this project locally would require a MySQL server running on your machine and a Python environment set up with the necessary libraries.

You can download components below using the command example. 
```bash
sudo yum install react-responsive-carousel nltk openai flask pytz axios
```

To run this project locally, clone the repository, and install it using npm:
```bash
git clone https://github.com/yourusername/yourprojectname.git
cd yourprojectname
npm install
npm start
```
Please note that running this project locally would require a MySQL server running on your machine and a Python environment set up with the necessary libraries.

---
Feel free to open an issue or make a pull request for any suggestions or queries. Enjoy exploring my website!
