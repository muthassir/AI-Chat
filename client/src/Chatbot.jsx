// import React, { useState } from 'react';
// import axios from 'axios';

// function Chatbot() {
//     const [input, setInput] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const handleSendMessage = async (e) => {
//         e.preventDefault();
//         if (!input.trim()) return;

//         const newUserMessage = { sender: 'user', text: input };
//         setMessages((prevMessages) => [...prevMessages, newUserMessage]);
//         setInput('');
//         setLoading(true);

//         try {
//             // Make sure this URL matches your backend server URL
//             const response = await axios.post('http://localhost:5000/api/chat', { message: input });
//             const aiReply = response.data.reply;
//             const newAiMessage = { sender: 'ai', text: aiReply };
//             setMessages((prevMessages) => [...prevMessages, newAiMessage]);
//         } catch (error) {
//             console.error('Error sending message:', error);
//             setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: 'Oops! Something went wrong. Please try again.' }]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="chatbot-container">
//             <div className="chat-header">Tesseract AI</div>
//             <div className="chat-messages">
//                 {messages.map((msg, index) => (
//                     <div key={index} className={`message ${msg.sender}`}>
//                         <div className="sender-name">{msg.sender === 'user' ? 'You' : 'AI'}</div>
//                         <div className="message-text">{msg.text}</div>
//                     </div>
//                 ))}
//                 {loading && (
//                     <div className="message ai loading">
//                         <div className="sender-name">AI</div>
//                         <div className="message-text">Thinking...</div>
//                     </div>
//                 )}
//             </div>
//             <form className="chat-input-form" onSubmit={handleSendMessage}>
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Type your message here..."
//                     disabled={loading}
//                 />
//                 <button type="submit" disabled={loading}>Ask</button>
//             </form>
//         </div>
//     );
// }

// export default Chatbot;
















import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Chatbot() {
    const [input, setInput] = useState('');
    // Initialize messages state by loading from local storage
    const [messages, setMessages] = useState(() => {
        try {
            const storedMessages = localStorage.getItem('chatHistory');
            return storedMessages ? JSON.parse(storedMessages) : [];
        } catch (error) {
            console.error("Failed to load chat history from local storage:", error);
            return []; // Return empty array on error
        }
    });
    const [loading, setLoading] = useState(false);

    // Ref to scroll to the bottom of the messages div
    const messagesEndRef = useRef(null);

    // Effect to scroll to the bottom whenever messages update
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        // Save messages to local storage whenever they change
        try {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        } catch (error) {
            console.error("Failed to save chat history to local storage:", error);
        }
    }, [messages]); // Dependency array: run when 'messages' state changes

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newUserMessage = { sender: 'user', text: input, timestamp: new Date().toISOString() };
        setMessages((prevMessages) => [...prevMessages, newUserMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', { message: input });
            const aiReply = response.data.reply;
            const newAiMessage = { sender: 'ai', text: aiReply, timestamp: new Date().toISOString() };
            setMessages((prevMessages) => [...prevMessages, newAiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prevMessages) => [...prevMessages, { sender: 'ai', text: 'Oops! Something went wrong. Could not get AI response.', timestamp: new Date().toISOString() }]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHistory = () => {
        if (window.confirm("Are you sure you want to delete the entire chat history?")) {
            setMessages([]); // Clear messages in state
            localStorage.removeItem('chatHistory'); // Remove from local storage
            console.log("Chat history deleted.");
        }
    };

    return (
        <div className="chatbot-container  skeleton">
            <div className="chat-header">Tesseract AI</div>
            <div className="chat-messages  skeleton">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className="sender-name">{msg.sender === 'user' ? 'You' : 'AI'}</div>
                        <div className="message-text">{msg.text}</div>
                        {/* Optional: Display timestamp for debugging/context */}
                        {/* <div className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</div> */}
                    </div>
                ))}
                {loading && (
                    <div className="message ai loading">
                        <div className="sender-name">AI</div>
                        <div className="message-text">Thinking...</div>
                    </div>
                )}
                <div ref={messagesEndRef} /> {/* This div helps with auto-scrolling */}
            </div>
            <form className="chat-input-form  skeleton" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>Ask</button>
            </form>
            <div className="chat-footer">
                <button
                    className="delete-history-button"
                    onClick={handleDeleteHistory}
                    disabled={messages.length === 0 && !loading} // Disable if no messages and not loading
                >
                    Delete History
                </button>
            </div>
        </div>
    );
}

export default Chatbot;