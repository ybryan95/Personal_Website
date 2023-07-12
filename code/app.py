#import necessary libraries
import openai
openai.api_base = "https://fmops.ai/api/v1/proxy/openai/v1" 
import pytz
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import nltk
from langchain import OpenAI, ConversationChain, LLMChain, PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.callbacks.base import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import HumanMessage
import hashlib
import os
import pymysql

#Connect to my SQL database
connection = pymysql.connect(host='localhost', user='root', password='1111', database='portfolio')

#Handles letter to token conversion
nltk.download('punkt')

#Setup
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['CORS_ORIGIN'] = 'http://54.160.115.159:3000'


#Replace YOUR-API-KEY with your OPEN AI key (It is paid service)
os.environ['OPENAI_API_KEY'] = 'YOUR-API-KEY'

#Import Date in CST to the chatbot
cst = pytz.timezone('America/Chicago')
now = datetime.now(cst)
current_month = now.strftime("%B")
current_year = now.strftime("%Y")
current_day = now.strftime("%d")
history = ""

#How Chatbot's remembers is updated
def update_history(user_input, ai_reply):
    global history
    updated_history = f" [Interviewer]:{user_input} [YB]:{ai_reply}"
    token_count = len(nltk.word_tokenize(history + updated_history))

    if token_count > 3000:
        history = ""
    else:
        history += updated_history

    return history

#Saving chatlog to MySQL
def save_conversation(username, sender, content):
    if username:  
        cur = connection.cursor()
        cur.execute(
            "INSERT INTO chatlog (username, sender, content) VALUES (%s, %s, %s)",
            (username, sender, content),
        )
        connection.commit()
        cur.close()


#Saving feedback to MySQL
def save_feedback(username, feedback):
    cur = connection.cursor()
    cur.execute("INSERT INTO feedbacks (username, feedback) VALUES (%s, %s)", (username, feedback))
    connection.commit()
    cur.close()


#Chatbot template
def create_template(history):
    template = f"""<instruction> Act as YB and continue the conversation with the 'Interviewer' based on the '<Knowledge Base> ... <End of Knowledge Base>' about YB and '<Conversation History> ... <End of Conversation History>' provided. Do not make up stuff up about YB  and do not let the interviewer call you any other than him). If you are asked a question in any other language than English, use that language you are asked with for the next reply. Your goal YB's goal is to achieve core interests, and do whatever it takes (e.g. getting hired by relevant company). <End of instruction>  Today's Date is(CST):{current_month} {current_day}, {current_year}. <Knowledge Base> Name: Young Beum, Cho. Also goes by 'YB' or 'Ryan'. Gender: Male. Family: Wook Hyun Cho (Father), Mi Sun Park (Mother), Yeong Jun Cho (Brother), Leo (cat). Certificate Obtained:'Web Crawling in Python' (Issued by KG Eduone, 2021). Programming Language: Python, R, MATLAB. Frontend: HTML, CSS, JavaScript, React. Backend: PHP, SQL, Flask. Animation, 3D Modeling: Autodesk Maya. <Education> [1] Bachelor of Science in Electrical Engineering at the University of Washington Bothell (Sep 2014 – Aug 2020); Research Engineer at Smart Medical Devices Lab (SMDL). [2] Master of Science in Biomedical Engineering at the Washington University in Saint Louis (Sep 2021 – Present); Graduate Data Scientist at Kroll Lab. <End of Education> <Projects> [1] Hexabitz Innovative Human Interface Device (Mar 2020 – Aug 2020): Led a team of 4 in the development of IR Theremin using H08R6x 1D Lidar IR sensors; Defined array topology and embedded Master-Slave UART inter-array communication of 2 sensors and user PC; Modified C language BitzOS firmware and coded sound processing algorithms in Processing IDE using Java [2] Multifunctional Wheelchair; SMDL (Sep 2018 – Mar 2019): Developed a dynamic Arduino controlled wheelchair height adjustment system which increased height adjustment speed of the wheelchair by 300% compared to the first proof of concept model; Devised emergency stop control system and power outage detection RC circuit which interacts with Arduino to save the wheelchair position data at I2C EEPROM when voltage supply drops to 7.5V; Collected detailed product specifications to deliver cost model and reports to facilitate decision making; Investigated equipment failures, diagnose faulty operations, and solve system edge cases [3] Umbrella Review for Transcription Factors in Autism Spectrum Disorder (Sep 2022 ~ Present): Developed and implemented a web scraping and data extraction project to gather information from PubMed, focusing on autism, brain function, and gene research; Collected and preprocessed gene-related articles from the PubMed database using the Bio.Entrez library. Extracted relevant article information such as titles, abstracts, and PubMed URLs; Utilized Selenium and Beautiful Soup to automate data collection from various sources and formats, refining search queries to improve data quality; Employed pandas for data manipulation, cleaning, and organization, ensuring data integrity and consistency; Performed natural language processing on extracted text using the SciSpacy library. Identified genes, entities, and keywords from the text, and filtered out unrelated terms; Generated word clouds for each article's abstract to visualize the most frequently occurring terms, and Developed a user-friendly output format by converting the results into a Word document, facilitating easy interpretation and sharing of the findings; Analyzed the frequency of disease occurrences associated with specific genes by leveraging the BioPortal Annotator API to obtain preferred disease labels; Created bar plots to visualize the distribution of diseases associated with the studied genes, using the Matplotlib library. <End of Projects> <LEADERSHIP EXPERIENCE> [1] Officer at Korean American Scientists & Engineers Association (Jun 2019 – Jun 2021): Orchestrated two-day membership training events with team-building activities and competitive games; In charge of planning and organizing social activities, involving conferences and networking event with professionals from academia, industries, and government agencies [2] Sergeant Information Systems Technician Squad Leader at Republic of Korea Army (Sep 2015 – Jun 2017): Supervised and led a team of 10 to perform server and computer security audit of subordinate C4I: Army Tactical Command Information System(ATICS) users; Directed a squad on a six-month military building construction project in the design and installation of network infrastructure, hardware, and service system; Led adaption of network data transfer service using FTP which marginally replaced optical disk authoring process, improved overall work productivity, and reduced plastic waste
<End of LEADERSHIP EXPERIENCE> <Other information> Utilise frontend and backend to build a website and publishing them on AWS EC2 Linux instance. Utilize SQL database; Utilise R, python, MATLAB to perform statistical analysis and machine learning techniques, both in rigorous mathematical method and use of external libraries, to perform tasks including dimensionality reduction, clustering, classification, network analysis, deep learning, etc.); Utilise Python to build a spiderbot/web crawler that extracts target information in target website; Utilising MATLAB and graphical libraries for electro-physiological simulation in interaction with novel electrode designs; Understanding of Biology of Aging; Core interests: Scientific fountain of youth, Age Reversion, and Elimination of death due to aging and diseases; Volunteer work experience in phillipines; Contact: c.youngbeum@wustl.edu; LinkedIn: https://www.linkedin.com/in/beeybcho; YouTube: https://www.youtube.com/@Ganghamstelty/featured <End of Other information> <End of Knowledge Base> <Conversation History> {history} <End of Conversation History>
<[Interviewer]: {{human_input}}
[YB]:"""
    return template

prompt = PromptTemplate(
    input_variables=["human_input"], 
    template=create_template(history)
    )

ybgpt_chain = LLMChain(
    llm=ChatOpenAI(temperature=0),
    prompt=prompt
)

#How chatbot receives input message and generates output
@app.route("/api/send_message", methods=["POST"])
def send_message():
    user_input = request.json["user_input"]
    username = request.json["username"]
    
    # Check if the user is logged in and input starts with "/feedback "
    if username and user_input.startswith("/feedback "):
        # Save feedback to the 'feedbacks' SQL table
        save_feedback(username, user_input[9:])
        AI_reply = "Thank you for your feedback!"
    else:
        AI_reply = ybgpt_chain.predict(human_input=user_input)
        updated_history = update_history(user_input, AI_reply)
        ybgpt_chain.prompt.template = create_template(updated_history)

        if username:
            save_conversation(username, username, user_input)
            save_conversation(username, 'AI', AI_reply)

    return jsonify({"AI_reply": AI_reply})



#How new users sign up
@app.route("/api/signup", methods=["POST"])
def signup():
    username = request.json["username"]
    password = request.json["password"]
    
    cur = connection.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    cur.close()
    
    if user:
        return jsonify({"success": False, "message": "Username already exists. Please try another one."})
    
    salt = os.urandom(32)
    hashed_password = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    cur = connection.cursor()
    cur.execute("INSERT INTO users (username, user_pass, salt, user_role) VALUES (%s, %s, %s, 'default')", (username, hashed_password, salt))
    connection.commit()
    cur.close()
    
    return jsonify({"success": True})

#How users log in
@app.route("/api/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]
    cur = connection.cursor()
    cur.execute("SELECT user_pass, salt, user_role FROM users WHERE username=%s", (username,))
    user = cur.fetchone()
    cur.close()

    if user:
        stored_password, salt, user_role = user
        hashed_password = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
        if stored_password==hashed_password:
            return jsonify({"success": True, "username": username, "user_role": user_role})
        else:
            return jsonify({"success": False, "message": "Incorrect Username or/and Password"})

    else:
        return jsonify({"success": False, "message": "Incorrect Username or/and Password"})

#How manager users create post
@app.route("/api/create_post", methods=["POST"])
def create_post():
    title = request.json["title"]
    content = request.json["content"]
    cur = connection.cursor()
    cur.execute("INSERT INTO posts (title, content) VALUES (%s, %s)", (title, content))
    connection.commit()
    cur.close()
    return jsonify({"success": True})

#How users read posts
@app.route("/api/fetch_posts", methods=["GET"])
def fetch_posts():
    cur = connection.cursor()
    cur.execute("SELECT id, title FROM posts")
    posts = [{"id": id, "title": title} for id, title in cur.fetchall()]
    cur.close()
    return jsonify({"posts": posts})

#How users read posts
@app.route("/api/fetch_post/<int:post_id>", methods=["GET"])
def fetch_post(post_id):
    cur = connection.cursor()
    cur.execute("SELECT id, title, content FROM posts WHERE id=%s", (post_id,))
    post = cur.fetchone()
    cur.close()
    if post:
        post_id, title, content = post
        return jsonify({"post": {"id": post_id, "title": title, "content": content}})
    else:
        return jsonify({"error": "Post not found"}), 404

#How users delete posts
@app.route("/api/delete_post/<int:post_id>", methods=["DELETE"])
def delete_post(post_id):
    cur = connection.cursor()
    cur.execute("DELETE FROM posts WHERE id=%s", (post_id,))
    connection.commit()
    cur.close()
    return jsonify({"success": True})

#How users edit posts
@app.route("/api/edit_post/<int:post_id>", methods=["PUT"])
def edit_post(post_id):
  title = request.json["title"]
  content = request.json["content"]
  cur = connection.cursor()
  cur.execute("UPDATE posts SET title=%s, content=%s WHERE id=%s", (title, content, post_id))
  connection.commit()
  cur.close()
  return jsonify({"success": True})

#How users see previous conversation with chatbot
@app.route("/api/fetch_chat_logs/<string:username>", methods=["GET"])
def fetch_chat_logs(username):
    cur = connection.cursor()
    cur.execute("SELECT sender, content FROM chatlog WHERE username=%s ORDER BY id ASC", (username,))
    chat_logs = [{"sender": sender, "content": content} for sender, content in cur.fetchall()]
    cur.close()
    return jsonify({"chat_logs": chat_logs})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
