'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingChatWrapper() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm ComplianceBot. Ask me about GDPR, FTC rules, copyright, or any compliance questions." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input
    setMsgs(m => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMsg }] }),
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'bot', text: data.text || "I'm here to help with compliance questions!" }])
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: 'Try again in a moment!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
        aria-label="Open compliance chat"
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,99,235,0.35)', zIndex: 1000, fontSize: 20,
        }}
      >
        {open ? '✕' : '⚖️'}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed', bottom: 88, right: 24, width: 320, height: 420,
              background: 'rgba(255,255,255,0.98)', border: '1px solid #f8fafc',
              borderRadius: 16, display: 'flex', flexDirection: 'column', zIndex: 1000,
              overflow: 'hidden', boxShadow: '0 8px 40px rgba(37,99,235,0.15)',
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #ffffff', fontSize: 13, fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
              ComplianceBot
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#2563eb' : '#ffffff',
                  color: m.role === 'user' ? '#fff' : '#1e3a8a',
                  padding: '8px 12px', borderRadius: 10, fontSize: 12.5, maxWidth: '85%', lineHeight: 1.5,
                }}>{m.text}</div>
              ))}
              {loading && (
                <div style={{ alignSelf: 'flex-start', background: '#ffffff', padding: '8px 12px', borderRadius: 10, fontSize: 12, color: '#93c5fd' }}>…</div>
              )}
            </div>
            <div style={{ padding: '10px 12px', borderTop: '1px solid #ffffff', display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about GDPR, FTC, copyright…"
                style={{
                  flex: 1, background: '#ffffff', border: '1px solid #e2e8f0',
                  borderRadius: 8, padding: '7px 10px', fontSize: 12, color: '#1e3a8a', outline: 'none',
                }}
              />
              <button
                onClick={send}
                disabled={loading}
                style={{ background: '#2563eb', border: 'none', borderRadius: 8, padding: '7px 13px', fontSize: 13, color: '#fff', cursor: 'pointer', fontWeight: 700 }}
              >→</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
