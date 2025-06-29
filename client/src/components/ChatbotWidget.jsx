import { useState } from "react";
import { X, Send } from "lucide-react";
import Button from "./Button";
import Input from "./Input";

function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your SeedSync assistant. How can I help you today?",
            isBot: true,
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            isBot: false,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");

        // Simulate bot response after a delay
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                text: "Thank you for your message! Our team will get back to you soon. In the meantime, you can explore our listings or check your inventory.",
                isBot: true,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <>
            {/* Chat Widget Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={toggleChat}
                    className="w-16 h-16 bg-normalGreen hover:bg-lightGreen rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                    <img
                        src="/images/chatbot-logo.png"
                        alt="Chatbot"
                        className="w-8 h-8"
                    />
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-normalGreen text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/chatbot-logo.png"
                                alt="Chatbot"
                                className="w-6 h-6"
                            />
                            <h3 className="font-semibold">
                                SeedSync Assistant
                            </h3>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="p-1 hover:bg-normalGreen rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.isBot
                                        ? "justify-start"
                                        : "justify-end"
                                }`}
                            >
                                <div
                                    className={`max-w-xs p-3 rounded-lg text-sm ${
                                        message.isBot
                                            ? "bg-gray-100 text-gray-800"
                                            : "bg-darkGreen text-white"
                                    }`}
                                >
                                    <p>{message.text}</p>
                                    <p
                                        className={`text-xs mt-1 opacity-70 ${
                                            message.isBot
                                                ? "text-gray-500"
                                                : "text-gray-200"
                                        }`}
                                    >
                                        {message.timestamp.toLocaleTimeString(
                                            [],
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex gap-2"
                        >
                            <Input
                                type="text"
                                placeholder="Type your message..."
                                value={inputMessage}
                                onChange={(e) =>
                                    setInputMessage(e.target.value)
                                }
                                className="flex-1 text-sm"
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                size="sm"
                                className="px-3"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatbotWidget;
