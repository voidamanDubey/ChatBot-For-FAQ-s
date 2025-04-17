import ChatBotIcon from "./chatBotIcon";

const ChatMessage = ({chat,index}) => {
  return (
    !chat.hideInChat && (
    <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message ${chat.isError ? "error" : ""}`}>
        {chat.role === "model" && <ChatBotIcon />}
        <p className="message-text">{chat.text}</p>
    </div>
    )
  );
};

export default ChatMessage;
