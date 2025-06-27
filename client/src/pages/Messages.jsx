import { useState } from "react";

// Dummy data for chat list and messages
const chats = [
    {
        id: 1,
        name: "Sunny Fields Farm",
        lastMessage: "Yes, we have 250kg ready...",
        time: "1m",
        messages: [
            {
                fromMe: true,
                text: "Hi! I'm looking to purchase 200kg of organic tomatoes. Do you have availability this week?",
            },
            {
                fromMe: false,
                text: "Good morning! Yes, we have about 250kg ready for harvest tomorrow. They're fully organic and freshly picked.",
            },
            {
                fromMe: true,
                text: "Perfect! What's your current price per kg?",
            },
            {
                fromMe: false,
                text: "₱65 per kg, negotiable for bulk orders. Delivery can be arranged within 2 days.",
            },
            { fromMe: false, text: "Decision?" },
            {
                fromMe: true,
                text: "That works for us. Let's confirm the order and proceed with logistics. Thanks!",
            },
            {
                fromMe: false,
                text: "Thank you! Confirming 200kg at ₱65/kg. I'll share the delivery details shortly.",
            },
        ],
    },
    {
        id: 2,
        name: "Green Valley Organics",
        lastMessage: "The carrots are ready for pickup...",
        time: "5m",
        messages: [
            {
                fromMe: true,
                text: "Hello! Do you have organic carrots available?",
            },
            {
                fromMe: false,
                text: "Yes! We have 150kg of fresh organic carrots ready.",
            },
            { fromMe: true, text: "Great! What's the price?" },
            {
                fromMe: false,
                text: "₱45 per kg. The carrots are ready for pickup.",
            },
        ],
    },
    {
        id: 3,
        name: "Fresh Farm Co.",
        lastMessage: "Let me check our inventory...",
        time: "1h",
        messages: [
            { fromMe: true, text: "Hi! Looking for potatoes in bulk." },
            {
                fromMe: false,
                text: "Let me check our inventory and get back to you.",
            },
        ],
    },
    {
        id: 4,
        name: "Mountain View Farm",
        lastMessage: "Delivery scheduled for Monday",
        time: "2h",
        messages: [
            { fromMe: true, text: "When can you deliver the vegetables?" },
            { fromMe: false, text: "Delivery scheduled for Monday morning." },
        ],
    },
    {
        id: 5,
        name: "Organic Paradise",
        lastMessage: "Thank you for your order!",
        time: "1d",
        messages: [
            { fromMe: true, text: "Order confirmed!" },
            { fromMe: false, text: "Thank you for your order!" },
        ],
    },
];

function Messages() {
    const [selectedChat, setSelectedChat] = useState(chats[0]);
    const [input, setInput] = useState("");

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Update the selected chat with new message
        const updatedChat = {
            ...selectedChat,
            messages: [...selectedChat.messages, { fromMe: true, text: input }],
        };
        setSelectedChat(updatedChat);
        setInput("");
    };

    return (
        <div className="flex h-full bg-lighterGreen">
            {/* Chat List Sidebar */}
            <aside className="w-80 bg-white border-r border-lightGreen flex flex-col">
                {/* Search Header */}
                <div className="p-4 border-b border-lightGreen flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Search Chats"
                        className="w-full px-3 py-2 rounded-lg bg-lighterGreen border border-lightGreen outline-none focus:border-normalGreen transition-colors"
                    />
                </div>

                {/* Chat List - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-lighterGreen hover:bg-lightGreen transition-colors ${
                                selectedChat.id === chat.id
                                    ? "bg-lightGreen"
                                    : ""
                            }`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-normalGreen to-darkGreen flex-shrink-0 flex items-center justify-center text-white font-bold">
                                {chat.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-darkGreen truncate">
                                    {chat.name}
                                </div>
                                <div className="text-sm text-gray-600 truncate">
                                    {chat.lastMessage}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 flex-shrink-0">
                                {chat.time}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Window */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-lightGreen bg-lightGreen flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-normalGreen to-darkGreen flex items-center justify-center text-white font-bold">
                        {selectedChat.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-lg font-bold text-darkGreen">
                            {selectedChat.name}
                        </div>
                        <div className="text-sm text-gray-700">Online</div>
                    </div>
                </div>

                {/* Messages Area - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="flex flex-col gap-3">
                        {selectedChat.messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${
                                    msg.fromMe ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`rounded-2xl px-4 py-2 max-w-md break-words ${
                                        msg.fromMe
                                            ? "bg-normalGreen text-white"
                                            : "bg-white border border-lightGreen text-darkGreen shadow-sm"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-lightGreen bg-white p-4 flex-shrink-0">
                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-3"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-3 rounded-full border border-lightGreen outline-none focus:border-normalGreen transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="bg-normalGreen hover:bg-darkGreen disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-semibold transition-colors"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </main>

            {/* Chatbot Button */}
            <button
                className="fixed right-8 bottom-28 z-50 bg-normalGreen hover:bg-darkGreen text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Open Chatbot"
            >
                <span role="img" aria-label="Chatbot" className="text-2xl">
                    🤖
                </span>
            </button>
        </div>
    );
}

export default Messages;
