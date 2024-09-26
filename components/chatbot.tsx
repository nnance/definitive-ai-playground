"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { SendIcon, UserIcon, BotIcon } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = { text: inputValue, sender: "user" };
      setMessages([...messages, newMessage]);
      // Here you would typically send the message to your chatbot backend
      // and get a response. For this example, we'll just echo the message.
      setTimeout(() => {
        const botResponse: Message = {
          text: `You said: ${inputValue}`,
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 500);
      setInputValue("");
    }
  };

  return (
    <Card className="w-full mx-auto h-full flex flex-col">
      <ScrollArea className="flex-grow p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start max-w-[80%] ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === "user"
                    ? "bg-blue-500 ml-2"
                    : "bg-gray-400 mr-2"
                }`}
              >
                {message.sender === "user" ? (
                  <UserIcon className="h-5 w-5 text-white" />
                ) : (
                  <BotIcon className="h-5 w-5 text-white" />
                )}
              </div>
              <div
                className={`p-2 rounded-lg ${
                  message.sender === "user" ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t flex">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-grow"
        />
        <Button onClick={handleSend} className="ml-2">
          <SendIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </Card>
  );
}
