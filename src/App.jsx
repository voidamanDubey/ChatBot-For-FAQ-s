import { useEffect, useState, useRef } from "react";
import ChatBotIcon from "./components/chatBotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";

const App = () => {
  const [chatHistory,setChatHistory] = useState([{
    hideInChat: true,
    role: "model",
    text: companyInfo
  }]);
  const [showChatBot,setShowChatBot] = useState(false);

  const chatBotRef = useRef();
  const generateBotResponse = async (history) => {

    // Helper Function to update chat history
    const updateHistory = (text,isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."),{role: "model", text,isError}]);
    }
    // Format Chat Hiatory for API Request
    history = history.map(({role,text}) => ({role,parts: [{text}]}));
    const requestOptions = {
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
  }
  
  try {
    // Make theApi Call to get the Bot's Response
    const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
        const data = await response.json();
    if (!response.ok) throw new Error(data.error.message || "Something Went Wrong");
    
    // Clean and Update chats history with bots response 
    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
    updateHistory(apiResponseText);

  } catch (error) {
    updateHistory(error.message , true );
  }
};

// Auto scrolling the chat window to the bottom
  useEffect(() => {
    chatBotRef.current.scrollTo({top: chatBotRef.current.scrollHeight, behavior: "smooth"});
  },[chatHistory]);

  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatBot((prev) => !prev)} id="chatbot-toggler">
      <span class="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span> 
      </button>
      <div className="chatbot-popup">
      {/* ChatBot Header*/}
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">ChatBot</h2>
            </div>
            <button onClick={() => setShowChatBot((prev) => !prev)} className="material-symbols-rounded">keyboard_arrow_down</button>
          </div>

            {/* ChatBot body*/}
            <div ref={chatBotRef} className="chat-body">
              <div className="message bot-message">
              <ChatBotIcon />
              <p className="message-text">Hey There 👋 <br /> How Can I Help You Today ?</p>
              </div>

              {/*Render the Chat History Dynamically*/}
              {chatHistory.map((chat,index) => (
                <ChatMessage key={index} chat={chat} />
              ))}

              
            </div>
            {/* ChatBot Footer*/}
            <div className="chat-footer">
              <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
            </div>
          </div>
        </div>
  );
};

export default App;
