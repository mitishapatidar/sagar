"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"

type Message = {
  role: "user" | "bot"
  text: string
}

export default function ChatBot() {
  const { t, language } = useLanguage()
  const isHi = language === 'hi'

  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [input, setInput] = useState("")
  
  const [messages, setMessages] = useState<Message[]>([])

  // Initialize greeting based on language
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { 
          role: "bot", 
          text: isHi 
            ? "🙏 **नमस्ते! मैं खेतमित्र AI हूँ।**\n\nआप मुझसे खेती के बारे में कुछ भी पूछ सकते हैं — फसलें, सिंचाई, उर्वरक, कीट नियंत्रण, सरकारी योजनाएं, और बहुत कुछ!\n\nबस पूछें! 😊"
            : "🙏 **Namaste! I am KhetMitra AI.**\n\nYou can ask me anything about farming — crops, irrigation, fertilizer, pest control, government schemes, and more!\n\nJust ask! 😊" 
        }
      ])
    }
  }, [isHi, messages.length])

  const [loading, setLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (
        chatRef.current && !chatRef.current.contains(target) &&
        btnRef.current && !btnRef.current.contains(target)
      ) {
        setAnimating(false)
        setTimeout(() => {
          setOpen(false)
          setVisible(false)
        }, 300)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const handleToggle = useCallback(() => {
    if (!open) {
      setVisible(true)
      setOpen(true)
      requestAnimationFrame(() => setAnimating(true))
      setTimeout(() => inputRef.current?.focus(), 350)
    } else {
      setAnimating(false)
      setTimeout(() => {
        setOpen(false)
        setVisible(false)
      }, 300)
    }
  }, [open])

  async function handleSend() {
    const question = input.trim()
    if (!question || loading) return

    setMessages(prev => [...prev, { role: "user", text: question }])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, language })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "bot", text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: isHi ? "⚠ त्रुटि - कृपया पुनः प्रयास करें।" : "⚠ Error – Please try again." }])
    }

    setLoading(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function renderText(text: string) {
    const parts = text.split("\n")
    return parts.map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      const formatted2 = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted2 }} />
          {i < parts.length - 1 && <br />}
        </span>
      )
    })
  }

  return (
    <>
      <style jsx global>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatSlideDown {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(20px) scale(0.95); }
        }
        .chat-enter { animation: chatSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .chat-exit { animation: chatSlideDown 0.25s ease-in forwards; }
        @keyframes btnRotateIn {
          from { transform: rotate(0deg) scale(0.8); opacity: 0; }
          to   { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        .btn-icon-enter { animation: btnRotateIn 0.3s ease-out; }
      `}</style>

      <button
        ref={btnRef}
        id="chatbot-toggle"
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        style={{ boxShadow: "0 4px 20px rgba(22, 163, 74, 0.4)" }}
      >
        <span key={open ? "close" : "open"} className="btn-icon-enter block">
          {open ? <X size={24} /> : <MessageCircle size={24} />}
        </span>
      </button>

      {!visible && (
        <div className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-400 rounded-full animate-ping opacity-30 pointer-events-none" />
      )}

      {visible && (
        <div
          ref={chatRef}
          className={`fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 ${animating ? 'chat-enter' : 'chat-exit'}`}
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}
        >
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">{isHi ? "खेतमित्र AI सहायक" : "KhetMitra AI Assistant"}</h3>
              <p className="text-xs text-green-100">🟢 {isHi ? "ऑनलाइन - खेती के सवाल पूछें" : "Online – Ask farming questions"}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ maxHeight: "350px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-green-700" />
                  </div>
                )}
                <div className={`max-w-[280px] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-green-600 text-white rounded-br-md" : "bg-white text-gray-700 rounded-bl-md shadow-sm border border-gray-100"}`}>
                  {renderText(msg.text)}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={14} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot size={14} className="text-green-700" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isHi ? "खेती के बारे में पूछें..." : "Ask about farming..."}
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 bg-gray-50"
                disabled={loading}
              />
              <button
                id="chatbot-send"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-2.5 rounded-full transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
