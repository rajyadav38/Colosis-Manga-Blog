import React, { useState, useEffect } from "react";

export default function Chat({ theme }) {
  const users = ["Naruto", "Sasuke", "Sakura", "Luffy", "Zoro"];

  // Store messages for each user
  const [activeUser, setActiveUser] = useState("Naruto");
  const [messages, setMessages] = useState({
    Naruto: [],
    Sasuke: [],
    Sakura: [],
    Luffy: [],
    Zoro: [],
  });

  const [input, setInput] = useState("");

  // Auto scroll
  useEffect(() => {
    const box = document.getElementById("chat-box");
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages, activeUser]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const copy = { ...messages };
    copy[activeUser].push({ text: input, sender: "You" });

    setMessages(copy);
    setInput("");
  };

  return (
    <div className="container py-4" style={{ color: theme.text }}>
      <h2 className="fw-bold mb-3">💬 Chats</h2>

      <div className="row">
        {/* LEFT — User List */}
        <div className="col-4">
          <div
            className="p-3 rounded shadow anime-card glow"
            style={{ background: theme.card }}
          >
            <h5 className="fw-bold mb-3">Users</h5>

            {users.map((u) => (
              <div
                key={u}
                className="p-2 rounded mb-2"
                style={{
                  background: activeUser === u ? theme.accent : theme.bg,
                  color: activeUser === u ? "white" : theme.text,
                  cursor: "pointer",
                }}
                onClick={() => setActiveUser(u)}
              >
                {u}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Chat Window */}
        <div className="col-8">
          <div
            className="p-3 rounded shadow anime-card glow mb-3"
            style={{
              background: theme.card,
              height: "450px",
              overflowY: "auto",
            }}
            id="chat-box"
          >
            {messages[activeUser].length === 0 && (
              <p className="text-muted">Start chatting with {activeUser}...</p>
            )}

            {messages[activeUser].map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.sender === "You" ? "right" : "left",
                }}
              >
                <div
                  className="d-inline-block p-2 rounded mb-2"
                  style={{
                    background: msg.sender === "You" ? theme.accent : theme.bg,
                    color: msg.sender === "You" ? "white" : theme.text,
                    maxWidth: "70%",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="d-flex">
            <input
              className="form-control"
              placeholder={`Message ${activeUser}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="btn ms-2"
              style={{ background: theme.accent, color: "white" }}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
