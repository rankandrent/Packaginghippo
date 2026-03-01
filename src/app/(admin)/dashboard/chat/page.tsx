"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Send, X, CheckCheck, Clock, MessageCircle, ArrowLeft } from "lucide-react"

interface Message {
    id: string
    content: string
    sender: string
    agentName?: string
    isRead: boolean
    createdAt: string
}

interface Conversation {
    id: string
    visitorId: string
    visitorName: string
    visitorEmail?: string
    status: string
    unreadCount: number
    lastMessageAt: string
    createdAt: string
    messages: Message[]
}

export default function ChatDashboard() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConvo, setSelectedConvo] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [convoDetails, setConvoDetails] = useState<any>(null)
    const [inputValue, setInputValue] = useState("")
    const [sending, setSending] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [agentName, setAgentName] = useState("Support")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Fetch current agent name from session
    useEffect(() => {
        fetch('/api/auth/session')
            .then(r => r.json())
            .then(d => {
                if (d.authenticated && d.user?.name) setAgentName(d.user.name)
            })
            .catch(() => { })
    }, [])

    // Poll conversations list
    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch(`/api/chat/conversations?status=${filterStatus}`)
            const data = await res.json()
            if (data.conversations) setConversations(data.conversations)
        } catch (e) { /* silently fail */ }
    }, [filterStatus])

    useEffect(() => {
        fetchConversations()
        const interval = setInterval(fetchConversations, 3000)
        return () => clearInterval(interval)
    }, [fetchConversations])

    // Poll messages for selected conversation
    const fetchMessages = useCallback(async () => {
        if (!selectedConvo) return
        try {
            const res = await fetch(`/api/chat/conversations/${selectedConvo}`)
            const data = await res.json()
            if (data.messages) setMessages(data.messages)
            if (data.conversation) setConvoDetails(data.conversation)
        } catch (e) { /* silently fail */ }
    }, [selectedConvo])

    useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [fetchMessages])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when conversation selected
    useEffect(() => {
        if (selectedConvo) inputRef.current?.focus()
    }, [selectedConvo])

    const handleSend = async () => {
        if (!inputValue.trim() || !selectedConvo || sending) return
        setSending(true)

        const tempMsg: Message = {
            id: 'temp_' + Date.now(),
            content: inputValue.trim(),
            sender: 'agent',
            agentName,
            isRead: false,
            createdAt: new Date().toISOString()
        }
        setMessages(prev => [...prev, tempMsg])
        setInputValue("")

        try {
            await fetch('/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: selectedConvo,
                    content: tempMsg.content,
                    sender: 'agent',
                    agentName,
                })
            })
            fetchMessages()
            fetchConversations()
        } catch (e) {
            console.error('Failed to send:', e)
        } finally {
            setSending(false)
        }
    }

    const handleCloseConvo = async (id: string) => {
        await fetch('/api/chat/conversations', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: 'closed' })
        })
        fetchConversations()
    }

    const handleReopenConvo = async (id: string) => {
        await fetch('/api/chat/conversations', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: 'active' })
        })
        fetchConversations()
    }

    const formatTime = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const formatDate = (d: string) => {
        const date = new Date(d)
        const today = new Date()
        if (date.toDateString() === today.toDateString()) return 'Today'
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const filteredConvos = conversations.filter(c => {
        if (searchQuery) {
            return c.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.visitorEmail && c.visitorEmail.toLowerCase().includes(searchQuery.toLowerCase()))
        }
        return true
    })

    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

    return (
        <div className="h-[calc(100vh-4rem)] -m-8 flex">
            {/* Left — Conversation List */}
            <div className={`w-[360px] border-r bg-white flex flex-col flex-shrink-0 ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-xl font-bold text-gray-900">
                            Live Chat
                            {totalUnread > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {totalUnread}
                                </span>
                            )}
                        </h1>
                        <div className="flex gap-1">
                            {['all', 'active', 'closed'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize transition-colors ${filterStatus === s
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConvos.length === 0 && (
                        <div className="text-center py-16">
                            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No conversations yet</p>
                        </div>
                    )}
                    {filteredConvos.map(convo => (
                        <button
                            key={convo.id}
                            onClick={() => setSelectedConvo(convo.id)}
                            className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start gap-3 ${selectedConvo === convo.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
                                }`}
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-blue-600 font-bold text-sm">
                                    {convo.visitorName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm text-gray-900 truncate">
                                        {convo.visitorName}
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                                        {formatDate(convo.lastMessageAt)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                    <p className="text-xs text-gray-500 truncate">
                                        {convo.messages[0]?.content || 'No messages yet'}
                                    </p>
                                    {convo.unreadCount > 0 && (
                                        <span className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 ml-2">
                                            {convo.unreadCount}
                                        </span>
                                    )}
                                </div>
                                {convo.status === 'closed' && (
                                    <span className="text-[10px] text-red-500 font-medium">Closed</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right — Messages Panel */}
            <div className={`flex-1 flex flex-col bg-gray-50 ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
                {!selectedConvo ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Select a conversation</p>
                        <p className="text-sm">Choose from your existing conversations or wait for new ones</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedConvo(null)}
                                    className="md:hidden text-gray-500 hover:text-gray-700"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold text-sm">
                                        {convoDetails?.visitorName?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-900">{convoDetails?.visitorName || 'Loading...'}</h3>
                                    <p className="text-[11px] text-gray-400">
                                        {convoDetails?.visitorEmail || 'No email provided'}
                                        {convoDetails?.status === 'active' && (
                                            <span className="ml-2 text-green-500">● Active</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {convoDetails?.status === 'active' ? (
                                    <button
                                        onClick={() => handleCloseConvo(selectedConvo)}
                                        className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        Close Chat
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleReopenConvo(selectedConvo)}
                                        className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        Reopen
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e5e7eb\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                            {messages.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 text-sm">No messages in this conversation yet</p>
                                </div>
                            )}
                            {messages.map((msg, i) => {
                                // Show date separator
                                const showDateSep = i === 0 || formatDate(msg.createdAt) !== formatDate(messages[i - 1].createdAt)
                                return (
                                    <div key={msg.id}>
                                        {showDateSep && (
                                            <div className="text-center my-3">
                                                <span className="bg-white/80 text-gray-500 text-[10px] font-medium px-3 py-1 rounded-full shadow-sm">
                                                    {formatDate(msg.createdAt)}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm shadow-sm ${msg.sender === 'agent'
                                                        ? 'bg-blue-600 text-white rounded-br-md'
                                                        : 'bg-white text-gray-800 rounded-bl-md'
                                                    }`}
                                            >
                                                {msg.sender === 'agent' && msg.agentName && (
                                                    <p className="text-[10px] font-semibold text-blue-200 mb-0.5">{msg.agentName}</p>
                                                )}
                                                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                                <div className={`flex items-center justify-end gap-1 mt-1`}>
                                                    <span className={`text-[10px] ${msg.sender === 'agent' ? 'text-blue-200' : 'text-gray-400'
                                                        }`}>
                                                        {formatTime(msg.createdAt)}
                                                    </span>
                                                    {msg.sender === 'agent' && (
                                                        <CheckCheck className={`w-3.5 h-3.5 ${msg.isRead ? 'text-blue-300' : 'text-blue-200/60'}`} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="bg-white border-t p-3 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder={convoDetails?.status === 'closed' ? 'Reopen to reply...' : 'Type a reply...'}
                                    value={inputValue}
                                    onChange={e => setInputValue(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                    disabled={convoDetails?.status === 'closed'}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors disabled:opacity-50"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || sending || convoDetails?.status === 'closed'}
                                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                >
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
