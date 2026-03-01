"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, User, Star, RotateCcw } from "lucide-react"

function generateVisitorId() {
    return 'visitor_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

interface Message {
    id: string
    content: string
    sender: string
    agentName?: string
    createdAt: string
}

export function LiveChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)
    const [visitorName, setVisitorName] = useState("")
    const [visitorEmail, setVisitorEmail] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const [sending, setSending] = useState(false)
    const [visitorId, setVisitorId] = useState("")
    const [conversationId, setConversationId] = useState<string | null>(null)
    const [unreadFromAgent, setUnreadFromAgent] = useState(0)
    const [agentIsTyping, setAgentIsTyping] = useState(false)
    const [assignedAgentName, setAssignedAgentName] = useState("Support")
    const [chatStatus, setChatStatus] = useState("active")
    const [showRating, setShowRating] = useState(false)
    const [selectedRating, setSelectedRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [ratingFeedback, setRatingFeedback] = useState("")
    const [ratingSubmitted, setRatingSubmitted] = useState(false)
    const [existingRating, setExistingRating] = useState<number | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Initialize from localStorage
    useEffect(() => {
        const storedId = localStorage.getItem('chat_visitor_id')
        const storedName = localStorage.getItem('chat_visitor_name')
        const storedConvoId = localStorage.getItem('chat_conversation_id')
        const storedAgent = localStorage.getItem('chat_assigned_agent')

        if (storedId) {
            setVisitorId(storedId)
            if (storedName) {
                setVisitorName(storedName)
                setHasStarted(true)
            }
            if (storedConvoId) setConversationId(storedConvoId)
            if (storedAgent) setAssignedAgentName(storedAgent)
        } else {
            const newId = generateVisitorId()
            setVisitorId(newId)
            localStorage.setItem('chat_visitor_id', newId)
        }
    }, [])

    // Poll for new messages + typing status + chat status
    useEffect(() => {
        if (!hasStarted || !visitorId) return

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat/visitor-messages?visitorId=${visitorId}`)
                const data = await res.json()
                if (data.messages) {
                    setMessages(data.messages)
                    if (data.conversationId && !conversationId) {
                        setConversationId(data.conversationId)
                        localStorage.setItem('chat_conversation_id', data.conversationId)
                    }
                    // Update chat status from server
                    if (data.status) {
                        const prevStatus = chatStatus
                        setChatStatus(data.status)
                        // If agent just ended the chat, show rating
                        if (data.status === 'closed' && prevStatus === 'active' && !data.rating) {
                            setShowRating(true)
                        }
                    }
                    if (data.rating) {
                        setExistingRating(data.rating)
                        setRatingSubmitted(true)
                    }
                    if (data.assignedAgent) {
                        setAssignedAgentName(data.assignedAgent)
                        localStorage.setItem('chat_assigned_agent', data.assignedAgent)
                    }
                    if (!isOpen) {
                        const agentMsgs = data.messages.filter((m: Message) => m.sender === 'agent')
                        const lastSeen = parseInt(localStorage.getItem('chat_last_seen_count') || '0')
                        if (agentMsgs.length > lastSeen) {
                            setUnreadFromAgent(agentMsgs.length - lastSeen)
                        }
                    }
                }
            } catch { /* silently fail */ }
        }

        const checkTyping = async () => {
            try {
                const res = await fetch(`/api/chat/typing?visitorId=${visitorId}&who=visitor`)
                const data = await res.json()
                setAgentIsTyping(data.isTyping)
                if (data.assignedAgent) {
                    setAssignedAgentName(data.assignedAgent)
                    localStorage.setItem('chat_assigned_agent', data.assignedAgent)
                }
            } catch { /* silently fail */ }
        }

        fetchMessages()
        checkTyping()
        pollIntervalRef.current = setInterval(() => {
            fetchMessages()
            checkTyping()
        }, 3000)

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
        }
    }, [hasStarted, visitorId, isOpen])

    // Scroll to bottom on new messages or typing status change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, agentIsTyping, showRating])

    // Mark as seen when opened
    useEffect(() => {
        if (isOpen && messages.length > 0) {
            const agentCount = messages.filter(m => m.sender === 'agent').length
            localStorage.setItem('chat_last_seen_count', agentCount.toString())
            setUnreadFromAgent(0)
        }
    }, [isOpen, messages])

    // Send typing indicator when visitor types
    const handleInputChange = (value: string) => {
        setInputValue(value)
        if (value.trim() && visitorId) {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = setTimeout(() => {
                fetch('/api/chat/typing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ visitorId, who: 'visitor' })
                }).catch(() => { })
            }, 300)
        }
    }

    const handleStartChat = () => {
        if (!visitorName.trim()) return
        localStorage.setItem('chat_visitor_name', visitorName.trim())
        setHasStarted(true)
    }

    const handleSend = async () => {
        if (!inputValue.trim() || sending) return
        setSending(true)

        const tempMsg: Message = {
            id: 'temp_' + Date.now(),
            content: inputValue.trim(),
            sender: 'visitor',
            createdAt: new Date().toISOString()
        }
        setMessages(prev => [...prev, tempMsg])
        setInputValue("")

        try {
            const res = await fetch('/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitorId,
                    visitorName,
                    visitorEmail: visitorEmail || undefined,
                    content: tempMsg.content,
                    sender: 'visitor',
                    conversationId,
                })
            })
            const data = await res.json()
            if (data.conversationId && !conversationId) {
                setConversationId(data.conversationId)
                localStorage.setItem('chat_conversation_id', data.conversationId)
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setSending(false)
        }
    }

    // Start a brand new chat — clear everything and generate new visitor ID
    const handleNewChat = () => {
        const newId = generateVisitorId()
        setVisitorId(newId)
        localStorage.setItem('chat_visitor_id', newId)
        localStorage.removeItem('chat_conversation_id')
        localStorage.removeItem('chat_assigned_agent')
        localStorage.removeItem('chat_last_seen_count')
        setConversationId(null)
        setMessages([])
        setChatStatus('active')
        setShowRating(false)
        setRatingSubmitted(false)
        setExistingRating(null)
        setSelectedRating(0)
        setRatingFeedback("")
        setAssignedAgentName("Support")
        setHasStarted(true) // keep them in the chat, don't ask for name again 
    }

    // Submit star rating
    const handleSubmitRating = async () => {
        if (selectedRating < 1) return
        try {
            await fetch('/api/chat/rating', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitorId,
                    rating: selectedRating,
                    feedback: ratingFeedback || undefined
                })
            })
            setRatingSubmitted(true)
            setExistingRating(selectedRating)
        } catch (e) {
            console.error('Failed to submit rating:', e)
        }
    }

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const isChatEnded = chatStatus === 'closed' || chatStatus === 'loss' || chatStatus === 'ai_closed'

    return (
        <>
            {/* Chat Bubble */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 group"
                    aria-label="Open live chat"
                >
                    <MessageCircle className="w-7 h-7 text-white" />
                    {unreadFromAgent > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                            {unreadFromAgent}
                        </span>
                    )}
                    <div className="absolute right-16 bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Chat with us
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-4 right-4 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    {/* Header — shows assigned agent name */}
                    <div className="bg-blue-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {assignedAgentName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">{assignedAgentName}</h3>
                                <p className="text-blue-100 text-xs flex items-center gap-1">
                                    {isChatEnded ? (
                                        <><span className="w-2 h-2 bg-gray-400 rounded-full inline-block"></span> Chat ended</>
                                    ) : (
                                        <><span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                                            {agentIsTyping ? 'Typing...' : 'Online — We reply instantly'}</>
                                    )}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {!hasStarted ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                <User className="w-8 h-8 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg">Welcome! 👋</h4>
                            <p className="text-gray-500 text-sm text-center">Enter your name to start chatting with our support team.</p>
                            <input
                                type="text"
                                placeholder="Your name *"
                                value={visitorName}
                                onChange={e => setVisitorName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleStartChat()}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="email"
                                placeholder="Email (optional)"
                                value={visitorEmail}
                                onChange={e => setVisitorEmail(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleStartChat()}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleStartChat}
                                disabled={!visitorName.trim()}
                                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Start Chat
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                {messages.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400 text-sm">Send a message to start the conversation!</p>
                                    </div>
                                )}
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${msg.sender === 'visitor'
                                            ? 'bg-blue-600 text-white rounded-br-md'
                                            : msg.sender === 'ai' ? 'bg-purple-50 text-gray-800 shadow-sm border border-purple-200 rounded-bl-md'
                                                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                                            }`}>
                                            {(msg.sender === 'agent' || msg.sender === 'ai') && msg.agentName && (
                                                <p className="text-[10px] font-semibold text-blue-600 mb-0.5">{msg.sender === 'ai' ? '🤖 ' : ''}{msg.agentName}</p>
                                            )}
                                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 ${msg.sender === 'visitor' ? 'text-blue-200' : 'text-gray-400'}`}>
                                                {formatTime(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {/* Typing Indicator */}
                                {agentIsTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-gray-500 shadow-sm border border-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm flex items-center gap-1.5">
                                            <span className="flex gap-0.5">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </span>
                                            <span className="text-[10px] text-gray-400 ml-1">{assignedAgentName} is typing</span>
                                        </div>
                                    </div>
                                )}

                                {/* Chat Ended Notice */}
                                {isChatEnded && (
                                    <div className="text-center py-2">
                                        <span className="bg-gray-200 text-gray-600 text-xs font-medium px-4 py-1.5 rounded-full">
                                            Chat has ended
                                        </span>
                                    </div>
                                )}

                                {/* 5-Star Rating UI — shown when chat is ended */}
                                {isChatEnded && !ratingSubmitted && (showRating || true) && (
                                    <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center space-y-3 shadow-sm">
                                        <p className="text-sm font-semibold text-gray-800">How was your experience?</p>
                                        <p className="text-xs text-gray-500">Rate your chat with {assignedAgentName}</p>
                                        <div className="flex justify-center gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    onClick={() => setSelectedRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="p-1 transition-transform hover:scale-125"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 transition-colors ${(hoverRating || selectedRating) >= star
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        {selectedRating > 0 && (
                                            <>
                                                <textarea
                                                    placeholder="Tell us more (optional)..."
                                                    value={ratingFeedback}
                                                    onChange={e => setRatingFeedback(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                    rows={2}
                                                />
                                                <button
                                                    onClick={handleSubmitRating}
                                                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                >
                                                    Submit Rating
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Rating Submitted Thanks */}
                                {ratingSubmitted && (
                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center space-y-2">
                                        <div className="flex justify-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`w-5 h-5 ${(existingRating || 0) >= star
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm font-semibold text-green-700">Thank you for your feedback! 🎉</p>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area / End Chat / New Chat */}
                            <div className="border-t bg-white p-3 flex-shrink-0">
                                {isChatEnded ? (
                                    <button
                                        onClick={handleNewChat}
                                        className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Start New Chat
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={inputValue}
                                            onChange={e => handleInputChange(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                            className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!inputValue.trim() || sending}
                                            className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                        >
                                            <Send className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}
