"use client";
import { useState, FormEvent, useRef, useEffect } from "react";

type Message = {
  sender: string;
  content: string;
};

export default function Chat() {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const newMessage: Message = { sender: "user", content: userInput };
    setMessages([...messages, newMessage]);

    // Fetch response from API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });

    const { reply } = await response.json();
    setMessages((msgs) => [...msgs, { sender: "Chatbot", content: reply }]);
    setUserInput("");
  }

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center">
      <div className="bg-gray-600 shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <form onSubmit={sendMessage} className="space-y-4">
          <div
            ref={messagesEndRef}
            className="overflow-y-auto h-96 w-full mb-2 p-2 border text-xs border-white rounded space-y-2 flex flex-col"
          >
            {messages.map((msg, index) => (
              <div
                ref={index === messages.length - 1 ? messagesEndRef : null}
                key={index}
                className={`p-2 rounded w-[95%] ${
                  msg.sender === "user"
                    ? "bg-gray-200 text-black"
                    : "bg-blue-200 text-black self-end"
                }`}
              >
                <strong className="text-xs">{msg.sender}:</strong>{" "}
                <span className="text-[0.5rem]">{msg.content}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded text-xs"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded text-xs"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
