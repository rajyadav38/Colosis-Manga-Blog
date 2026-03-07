import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function Chat({ theme }) {
  const socketRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = Number(user?.id);

  // -------------------------------
  // Load users
  // -------------------------------

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => {
        const filteredUsers = data.filter((u) => u.id !== userId);

        setUsers(filteredUsers);

        if (filteredUsers.length > 0) {
          setActiveUser(filteredUsers[0]);
        }

        const msgState = {};
        filteredUsers.forEach((u) => {
          msgState[u.id] = [];
        });

        setMessages(msgState);
      });
  }, [userId]);

  // -------------------------------
  // Socket connection
  // -------------------------------

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io("http://localhost:5000");

    socketRef.current.emit("join", userId);

    socketRef.current.on("receiveMessage", (message) => {
      const senderId = Number(message.senderId);
      const receiverId = Number(message.receiverId);

      const otherUserId = senderId === userId ? receiverId : senderId;

      setMessages((prev) => ({
        ...prev,
        [otherUserId]: [
          ...(prev[otherUserId] || []),
          {
            senderId: senderId,
            text: message.text,
          },
        ],
      }));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  // -------------------------------
  // Auto scroll
  // -------------------------------

  useEffect(() => {
    const box = document.getElementById("chat-box");
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages, activeUser]);

  // -------------------------------
  // Send message
  // -------------------------------

  const sendMessage = () => {
    if (!input.trim() || !activeUser) return;

    const message = {
      senderId: userId,
      receiverId: activeUser.id,
      text: input,
    };

    socketRef.current.emit("sendMessage", message);

    setMessages((prev) => ({
      ...prev,
      [activeUser.id]: [
        ...(prev[activeUser.id] || []),
        { senderId: userId, text: input },
      ],
    }));

    setInput("");
  };

  // -------------------------------
  // Load previous messages
  // -------------------------------

  const loadMessages = async (conversationId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/messages/${conversationId}`,
      );

      const data = await res.json();

      const formatted = data.map((m) => ({
        senderId: Number(m.senderId),
        text: m.text,
      }));

      setMessages((prev) => ({
        ...prev,
        [activeUser.id]: formatted,
      }));
    } catch (err) {
      console.error("Error loading messages", err);
    }
  };

  return (
    <div className="container py-4" style={{ color: theme.text }}>
      <h2 className="fw-bold mb-3">💬 Chats</h2>

      <div className="row">
        {/* LEFT USERS */}

        <div className="col-4">
          <div
            className="p-3 rounded shadow anime-card glow"
            style={{ background: theme.card }}
          >
            <h5 className="fw-bold mb-3">Users</h5>

            {users.map((u) => (
              <div
                key={u.id}
                className="p-2 rounded mb-2"
                style={{
                  background: activeUser?.id === u.id ? theme.accent : theme.bg,
                  color: activeUser?.id === u.id ? "white" : theme.text,
                  cursor: "pointer",
                }}
                onClick={async () => {
                  setActiveUser(u);

                  const res = await fetch(
                    "http://localhost:5000/api/chat/conversation",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        senderId: userId,
                        receiverId: u.id,
                      }),
                    },
                  );

                  const conversation = await res.json();

                  loadMessages(conversation._id);
                }}
              >
                {u.username}
              </div>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}

        <div className="col-8">
          <div
            id="chat-box"
            className="p-3 rounded shadow anime-card glow mb-3"
            style={{
              background: theme.card,
              height: "450px",
              overflowY: "auto",
            }}
          >
            {activeUser && messages[activeUser.id]?.length === 0 && (
              <p className="text-muted">
                Start chatting with {activeUser.username}...
              </p>
            )}

            {activeUser &&
              messages[activeUser.id]?.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: msg.senderId === userId ? "right" : "left",
                  }}
                >
                  <div
                    className="d-inline-block p-2 rounded mb-2"
                    style={{
                      background:
                        msg.senderId === userId ? theme.accent : theme.bg,
                      color: msg.senderId === userId ? "white" : theme.text,
                      maxWidth: "70%",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
          </div>

          {/* INPUT */}

          <div className="d-flex">
            <input
              className="form-control"
              placeholder={
                activeUser
                  ? `Message ${activeUser.username}...`
                  : "Select a user"
              }
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
