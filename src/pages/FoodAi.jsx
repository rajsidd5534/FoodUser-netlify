import React from "react";
import "./FoodAi.css";

const FoodAi = () => {
  return (
    <div className="foodai-page container py-3">
      <h3 className="mb-3 text-center">Food AI Chatbot</h3>

      <div className="foodai-wrapper">
        
        {/* Chatbot Left */}
        <div className="foodai-card">
          <iframe
            src="https://chat-bot-2q74.onrender.com/"
            className="foodai-iframe"
            title="Food AI Chatbot"
            referrerPolicy="no-referrer"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
          ></iframe>
          <div className="mt-2 small text-muted text-center">
            Embedded Food AI Chatbot
          </div>
        </div>

        {/* Right info section */}
        <div className="foodai-info">
          <p>
            Use the Food AI to get instant recipe suggestions, healthy meal plans,
            kitchen tips, and diet-based food ideas. You can simply chat with the
            assistant like talking to a human.
          </p>

          <button
            className="btn btn-sm btn-outline-primary mt-2"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh Chat
          </button>
        </div>

      </div>
    </div>
  );
};

export default FoodAi;
