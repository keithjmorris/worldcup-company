'use client';

import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

const ALLOWED_DOMAINS = ['xenomorph.com', 'newmodel.vc', 'wellsmaltings.org.uk'];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [authorised, setAuthorised] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('wc_company_email');
    const savedName = localStorage.getItem('wc_company_name');
    if (savedEmail && savedName) {
      const domain = savedEmail.split('@')[1];
      if (ALLOWED_DOMAINS.includes(domain)) {
        setEmail(savedEmail);
        setName(savedName);
        setAuthorised(true);
      }
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'messages-company'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleEmailSubmit(e) {
    e.preventDefault();
    setEmailError(null);
    const normalised = email.toLowerCase().trim();
    const domain = normalised.split('@')[1];

    if (!ALLOWED_DOMAINS.includes(domain)) {
      setEmailError('This email address is not authorised to post in this chat.');
      return;
    }

    const derivedName = normalised
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    localStorage.setItem('wc_company_email', normalised);
    localStorage.setItem('wc_company_name', derivedName);
    setName(derivedName);
    setAuthorised(true);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, 'messages-company'), {
      text: newMessage.trim(),
      name,
      createdAt: serverTimestamp(),
    });
    setNewMessage('');
  }

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <span className="trophy">💬</span>
          <div>
            <h1 className="site-title">Company Chat</h1>
            <p className="site-subtitle">
              {authorised ? `Chatting as ${name}` : 'World Cup 2026'}
            </p>
          </div>
        </div>
      </header>

      <div className="chat-layout">
        <div className="messages-list">
          {messages.length === 0 && (
            <p className="state-msg">No messages yet — say hello! 👋</p>
          )}
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`message ${msg.name === name ? 'own' : ''}`}
            >
              <div className="msg-name">{msg.name}</div>
              <div className="msg-text">{msg.text}</div>
              <div className="msg-time">
                {msg.createdAt?.toDate?.()?.toLocaleTimeString('en-GB', {
                  hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {!authorised ? (
          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>
              Enter your work email to join the chat:
            </p>
            <form onSubmit={handleEmailSubmit} className="chat-input-row">
              <input
                className="chat-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@company.com"
                required
              />
              <button className="send-btn" type="submit">Join</button>
            </form>
            {emailError && (
              <p style={{ color: 'var(--live-red)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                {emailError}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={sendMessage} className="chat-input-row">
            <input
              className="chat-input"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message…"
            />
            <button className="send-btn" type="submit">Send</button>
          </form>
        )}
      </div>
    </main>
  );
}