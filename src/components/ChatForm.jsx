import {useRef}  from 'react';

const ChatForm = ({setChatHistory,generateBotResponse,chatHistory}) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value = "";

        // Update Chat history with user's Messgae
        setChatHistory((history) => [...history,{ role : "user", text : userMessage }]);

        setTimeout(() => {
          // Add a "Thinking.." PlaceHolder before the bot's response
          setChatHistory((history) => [...history,{ role : "model", text : "Thinking..." }]);

          //Call the function to generate the bot's response
          generateBotResponse([...chatHistory, {role : "model", text : `Using the details provided above , please address this Query: ${userMessage}`}]);
      },600);
    };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type here.."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatForm;
