import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./Chat.css";
export default function Chat({ theme }) {
  const socketRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = String(user?.id);

  // -------------------------------
  // Load users
  // -------------------------------

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users`);
        const data = await res.json();

        const filteredUsers = data.filter((u) => String(u.id) !== userId);

        setUsers(filteredUsers);

        const msgState = {};

        filteredUsers.forEach((u) => {
          msgState[String(u.id)] = [];
        });

        setMessages(msgState);

        // Select first user automatically
        if (filteredUsers.length > 0) {
          const firstUser = filteredUsers[0];

          setActiveUser(firstUser);

          const convoRes = await fetch(`${API_URL}/api/chat/conversation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              senderId: userId,
              receiverId: String(firstUser.id),
            }),
          });

          const conversation = await convoRes.json();

          await loadMessages(conversation._id, String(firstUser.id));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (userId) {
      fetchUsers();
    }
  }, [userId, API_URL]);

  // -------------------------------
  // Socket connection
  // -------------------------------

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(`${API_URL}`);

    socketRef.current.emit("join", userId);

    socketRef.current.on("receiveMessage", (message) => {
      const senderId = String(message.senderId);
      const receiverId = String(message.receiverId);

      const otherUserId = senderId === userId ? receiverId : senderId;

      setMessages((prev) => ({
        ...prev,
        [otherUserId]: [
          ...(prev[otherUserId] || []),
          {
            senderId,
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
      receiverId: String(activeUser.id),
      text: input,
    };

    socketRef.current.emit("sendMessage", message);

    setMessages((prev) => ({
      ...prev,
      [String(activeUser.id)]: [
        ...(prev[String(activeUser.id)] || []),
        {
          senderId: userId,
          text: input,
        },
      ],
    }));

    setInput("");
  };

  // -------------------------------
  // Load previous messages
  // -------------------------------

  const loadMessages = async (conversationId, selectedUserId) => {
    try {
      const res = await fetch(`${API_URL}/api/chat/messages/${conversationId}`);

      const data = await res.json();

      const formatted = data.map((m) => ({
        senderId: String(m.senderId),
        text: m.text,
      }));

      setMessages((prev) => ({
        ...prev,
        [selectedUserId]: formatted,
      }));
    } catch (err) {
      console.error("Error loading messages", err);
    }
  };
  return (
    <div className="container py-4 chat-page">
      <div className="chat-container">
        {/* USERS SIDEBAR */}
        <div className={`chat-users ${showChat ? "mobile-hide" : ""}`}>
          <h2 className="chat-title">💬 Chats</h2>

          {users.map((u) => (
            <div
              key={u.id}
              className={`chat-user-card ${
                activeUser?.id === u.id ? "active" : ""
              }`}
              onClick={async () => {
                setActiveUser(u);
                setShowChat(true);

                const res = await fetch(`${API_URL}/api/chat/conversation`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    senderId: userId,
                    receiverId: String(u.id),
                  }),
                });

                const conversation = await res.json();

                loadMessages(conversation._id, String(u.id));
              }}
            >
              <img
                src={
                  u.avatar || `https://ui-avatars.com/api/?name=${u.username}`
                }
                alt={u.username}
                className="chat-avatar"
              />

              <div className="chat-user-info">
                <h6>{u.username}</h6>
                <small>Tap to chat</small>
              </div>
            </div>
          ))}
        </div>

        {/* CHAT WINDOW */}
        <div className={`chat-window ${showChat ? "mobile-show" : ""}`}>
          {activeUser && (
            <>
              {/* HEADER */}
              <div className="chat-header">
                <div className="chat-mobile-back">
                  <i
                    className="bi bi-arrow-left"
                    onClick={() => setShowChat(false)}
                  ></i>
                </div>
                <img
                  src={
                    activeUser.avatar ||
                    `https://ui-avatars.com/api/?name=${activeUser.username}`
                  }
                  alt=""
                  className="chat-avatar"
                />

                <div>
                  <h6>{activeUser.username}</h6>
                  <small>Active now</small>
                </div>
              </div>

              {/* MESSAGES */}
              <div id="chat-box" className="chat-messages">
                {messages[String(activeUser.id)]?.length === 0 && (
                  <p className="text-muted">
                    Start chatting with {activeUser.username}...
                  </p>
                )}

                {messages[String(activeUser.id)]?.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.senderId === userId
                        ? "message-row me"
                        : "message-row other"
                    }
                  >
                    <div
                      className={
                        msg.senderId === userId
                          ? "message-bubble me"
                          : "message-bubble other"
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT */}
              <div className="chat-input-box">
                <input
                  className="chat-input"
                  placeholder={`Message ${activeUser.username}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />

                <button
                  className="send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
