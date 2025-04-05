import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const ChatRoom = ({ gender, country, interests, avatar }) => {
  const [connectedUser, setConnectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [alert, setAlert] = useState("");
  const [strangerTyping, setStrangerTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const joinQueue = () => {
    if (!socket.connected) socket.connect();
    socket.emit("join_queue", { gender, country, tags: interests, avatar });
  };

  useEffect(() => {
    joinQueue();

    socket.on("match_found", ({ peerId }) => setConnectedUser(peerId));

    socket.on("receive_message", ({ from, text, avatar: senderAvatar }) => {
      setMessages((prev) => [...prev, { from, text, avatar: senderAvatar }]);
    });

    socket.on("stranger_typing", () => setStrangerTyping(true));
    socket.on("stranger_stop_typing", () => setStrangerTyping(false));

    return () => {
      socket.off("match_found");
      socket.off("receive_message");
      socket.off("stranger_typing");
      socket.off("stranger_stop_typing");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("send_message", { to: connectedUser, text: input, avatar });
      setMessages((prev) => [...prev, { from: "me", text: input, avatar }]);
      setInput("");
      socket.emit("stop_typing", { to: connectedUser });
    }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { to: connectedUser });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("stop_typing", { to: connectedUser });
    }, 1000);
  };

  const handleNext = () => {
    setConnectedUser(null);
    setMessages([]);
    setStrangerTyping(false);
    socket.disconnect();
    setTimeout(() => joinQueue(), 200);
  };

  const handleEndChat = () => {
    setAlert("❌ Chat ended.");
    handleNext();
  };

  const handleReport = () => {
    if (connectedUser) {
      socket.emit("report_user", { reportedId: connectedUser });
      setAlert("🚩 User reported.");
      setTimeout(() => setAlert(""), 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">HookChat</h1>
        {connectedUser && (
          <div className="space-x-2">
            <button
              onClick={handleReport}
              className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
            >
              Report
            </button>
            <button
              onClick={handleEndChat}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              End Chat
            </button>
          </div>
        )}
      </div>

      {alert && (
        <div className="text-center text-sm text-emerald-400 mb-2">{alert}</div>
      )}

      <div className="flex-1 overflow-y-auto">
        {connectedUser ? (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 flex items-center max-w-[80%] ${
                  msg.from === "me" ? "self-end flex-row-reverse" : "self-start"
                }`}
              >
                <div className="text-2xl mr-2">{msg.avatar}</div>
                <div
                  className={`px-4 py-2 rounded-xl text-sm ${
                    msg.from === "me" ? "bg-emerald" : "bg-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {strangerTyping && (
              <div className="text-sm text-gray-400 italic mb-2">
                Stranger is typing...
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 mt-20">
            Looking for a match...
            <br />
            Hang tight!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {connectedUser && (
        <div className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-emerald px-4 py-2 rounded-lg hover:bg-emerald/80"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
