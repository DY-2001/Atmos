import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import "./AIAgent.css";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const AIAgent = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "agent",
      text: "Hi! 👋 I'm your Atmos AI assistant. Ask me anything about your workspace!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const defaultGreeting = {
    role: "agent",
    text: "Hi! 👋 I'm your Atmos AI assistant. Ask me anything about your workspace!",
  };

  const token =
    useSelector((state) => state.user?.token) || localStorage.getItem("token");

  // When the agent is opened, we will make a silent empty request or just wait until they type.
  // For now we rely on the history coming back from the active POST.

  useEffect(() => {
    if (open) {
      fetchInitialHistory();
    }
  }, [open]);

  const fetchInitialHistory = async () => {
    try {
      const res = await fetch(`${BACKEND}/agent/get-questions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();

      if (data.success && data.history && Array.isArray(data.history)) {
        // Load conversation history from backend
        const historyList = [defaultGreeting];
        data.history.forEach((convo) => {
          historyList.push({ role: "user", text: convo.question });
          historyList.push({ role: "agent", text: convo.answer });
        });
        setMessages(historyList);

        // Scroll to bottom after loading
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 0);
      }
    } catch (err) {
      console.error("Error fetching initial history:", err);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // Optimistically add just the user message
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND}/agent/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      const replyText = data.reply || "I didn't quite get that.";

      // Rebuild message state entirely from backend history when available
      if (data.history && data.history.length > 0) {
        const historyList = [defaultGreeting];
        data.history.forEach((convo) => {
          historyList.push({ role: "user", text: convo.question });
          historyList.push({ role: "agent", text: convo.answer });
        });
        setMessages(historyList);
      } else {
        setMessages((prev) => [...prev, { role: "agent", text: replyText }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "⚠️ I had trouble talking to the server right now. Please try again later.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text) => {
    // Bold **text** and newlines
    if (typeof text !== "string") text = JSON.stringify(text);
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} style={{ margin: "2px 0" }}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part,
          )}
        </p>
      );
    });
  };

  return (
    <>
      <button
        className={`ai-agent-fab ${open ? "ai-agent-fab--active" : ""}`}
        onClick={() => setOpen((o) => !o)}
        title="AI Assistant"
      >
        {open ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            <path
              d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16z"
              opacity="0"
            />
            <circle cx="12" cy="8" r="1.5" />
            <path d="M10.5 10.5h3v7h-3z" />
          </svg>
        )}
        <span className="ai-agent-fab__label">AI</span>
      </button>

      <div className={`ai-agent-panel ${open ? "ai-agent-panel--open" : ""}`}>
        <div className="ai-agent-header">
          <div className="ai-agent-header__avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7H4a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM5 19a1 1 0 110-2 1 1 0 010 2zm14 0a1 1 0 110-2 1 1 0 010 2zM5 14h14v2H5v-2z" />
            </svg>
          </div>
          <div>
            <div className="ai-agent-header__title">Atmos AI</div>
            <div className="ai-agent-header__status">
              <span className="ai-agent-status-dot" /> Online
            </div>
          </div>
          <button
            className="ai-agent-header__close"
            onClick={() => setOpen(false)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="ai-agent-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ai-agent-msg ai-agent-msg--${msg.role}`}>
              {msg.role === "agent" && (
                <div className="ai-agent-msg__avatar">AI</div>
              )}
              <div className="ai-agent-msg__bubble">{formatText(msg.text)}</div>
            </div>
          ))}
          {loading && (
            <div className="ai-agent-msg ai-agent-msg--agent">
              <div className="ai-agent-msg__avatar">AI</div>
              <div className="ai-agent-msg__bubble ai-agent-typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="ai-agent-input-row">
          <input
            className="ai-agent-input"
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            className="ai-agent-send"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default AIAgent;
