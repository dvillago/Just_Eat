import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chatWithClaude } from '../services/api';

const SUGGESTED = [
  'What foods are high in protein?',
  'How many calories should I eat per day?',
  'What are the best foods for celiac disease?',
  'Can you suggest a post-workout meal?',
];

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your NutriMeal AI assistant 🥗\n\nI can help you with nutrition questions, meal recommendations, dietary restrictions, and more. I have access to PubMed for science-backed answers.\n\nWhat would you like to know?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput('');
    const updated = [...messages, { role: 'user', content: userMsg }];
    setMessages(updated);
    setLoading(true);
    try {
      const apiMessages = updated.map(m => ({ role: m.role, content: m.content }));
      const reply = await chatWithClaude(apiMessages, user);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please check your API key in the environment variables.',
      }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={20} color="var(--accent)" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.3rem', marginBottom: 0 }}>NutriMeal AI</h1>
          <div style={{ fontSize: 12, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            Online · Powered by Claude
          </div>
        </div>
      </div>

      <div className="card" style={{ minHeight: 480, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 360, maxHeight: 480 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user' ? 'var(--accent-dim)' : 'var(--bg-hover)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {msg.role === 'user' ? <User size={16} color="var(--accent)" /> : <Bot size={16} color="var(--text-muted)" />}
              </div>
              <div className={`chat-bubble ${msg.role}`} style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="var(--text-muted)" />
              </div>
              <div className="chat-bubble assistant" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1s infinite' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1s 0.2s infinite' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1s 0.4s infinite' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '12px 0' }}>
            {SUGGESTED.map(s => (
              <button key={s} className="btn btn-secondary btn-sm" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <input
            className="input"
            placeholder="Ask about nutrition, ingredients, meal planning..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          />
          <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            <Send size={16} />
          </button>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, textAlign: 'center' }}>
        AI-generated responses are for informational purposes only. Consult a healthcare provider for medical advice.
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
