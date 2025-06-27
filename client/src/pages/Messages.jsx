import { useState } from "react";

// Dummy data for chat list and messages
const chats = [
    {
        id: 1,
        name: "Sunny Fields Farm",
        lastMessage: "Yes, we have 250kg ready...",
        time: "1m",
        messages: [
            { fromMe: true, text: "Hi! I’m looking to purchase 200kg of organic tomatoes. Do you have availability this week?" },
            { fromMe: false, text: "Good morning! Yes, we have about 250kg ready for harvest tomorrow. They’re fully organic and freshly picked." },
            { fromMe: true, text: "Perfect! What’s your current price per kg?" },
            { fromMe: false, text: "₱65 per kg, negotiable for bulk orders. Delivery can be arranged within 2 days." },
            { fromMe: false, text: "Decision?" },
            { fromMe: true, text: "That works for us. Let’s confirm the order and proceed with logistics. Thanks!" },
            { fromMe: false, text: "Thank you! Confirming 200kg at ₱65/kg. I’ll share the delivery details shortly." }
        ]
    },
    // ...add more chats as needed
];

function Messages() {
    const [selectedChat, setSelectedChat] = useState(chats[0]);
    const [input, setInput] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setSelectedChat({
            ...selectedChat,
            messages: [...selectedChat.messages, { fromMe: true, text: input }]
        });
        setInput("");
    };

    return (
        <div className="flex flex-1 min-h-0 bg-[#f6f8f4]" style={{height: "100vh", position: "relative"}}>
            {/* Chat List */}
            <aside className="w-80 bg-white border-r border-black flex flex-col">
                <div className="p-4 border-b border-black">
                    <input
                        type="text"
                        placeholder="Search Chats"
                        className="w-full px-3 py-2 rounded bg-[#e9f2ea] outline-none"
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#e5e5e5] hover:bg-[#e9f2ea] ${selectedChat.id === chat.id ? "bg-[#e9f2ea]" : ""}`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <div className="w-10 h-10 rounded-full bg-green-200 flex-shrink-0" />
                            <div className="flex-1">
                                <div className="font-semibold">{chat.name}</div>
                                <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
                            </div>
                            <div className="text-xs text-gray-400">{chat.time}</div>
                        </div>
                    ))}
                </div>
            </aside>
            {/* Chat Window */}
            <main className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-black bg-[#d6f5d6]">
                    <div className="w-12 h-12 rounded-full bg-green-200" />
                    <div className="text-lg font-bold">{selectedChat.name}</div>
                </div>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                    {selectedChat.messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`rounded-xl px-4 py-2 max-w-lg ${msg.fromMe ? "bg-green-200 text-green-900" : "bg-white border border-green-200 text-gray-800"}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Message Input */}
                <form onSubmit={handleSend} className="flex items-center gap-3 px-6 py-4 border-t border-black bg-white">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 outline-none"
                    />
                    <button type="submit" className="bg-normalGreen text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition">
                        Send
                    </button>
                </form>
            </main>
            {/* Chatbot Button */}
            <button
                className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition"
                title="Open Chatbot"
                style={{fontSize: 32}}
            >
                <span role="img" aria-label="Chatbot">🤖</span>
            </button>
        </div>
    );
}

export default Messages;