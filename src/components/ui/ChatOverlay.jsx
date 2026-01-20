import React, { useState } from 'react';
import { Bot, X, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatOverlay = ({ isOpen, onClose }) => {
    const [isTyping, setIsTyping] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "I've analyzed the latest statements. You can ask me about:",
            list: ["Specific large transactions", "Recurring debts & loans", "Operational cost breakdown"]
        }
    ]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userText = input;
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userText }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch('http://localhost:8001/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });

            if (!res.ok) throw new Error("Failed to get response");

            const data = await res.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: data.response
            }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: "Sorry, I'm having trouble connecting to the brain right now. Please check if the server is running."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-50 border-l border-gray-100 flex flex-col"
                >
                    <header className="p-4 border-b flex justify-between items-center bg-white sticky top-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center border border-brand/50">
                                <Bot className="text-black" size={24} />
                            </div>
                            <div>
                                <h2 className="font-bold text-sm">SME Copilot</h2>
                                <div className="text-[10px] text-green-500 flex items-center gap-1 font-medium">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Azure OpenAI Online
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                            <X className="text-gray-500" size={20} />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 no-scrollbar">
                        <div className="text-center text-[10px] text-gray-400 font-medium">Today, 10:23 AM</div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border ${msg.type === 'user' ? 'bg-black text-white' : 'bg-brand border-brand/50'}`}>
                                    {msg.type === 'user' ? 'U' : 'AI'}
                                </div>
                                <div className={`p-4 rounded-2xl shadow-sm text-sm border max-w-[85%] leading-relaxed ${msg.type === 'user' ? 'bg-black text-white rounded-tr-none border-black' : 'bg-white text-gray-700 rounded-tl-none border-gray-100'}`}>
                                    <div className="markdown-content">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                strong: ({ node, ...props }) => <span className="font-bold text-gray-900" {...props} />,
                                                table: ({ node, ...props }) => <div className="overflow-x-auto my-2"><table className="min-w-full text-xs border border-gray-200" {...props} /></div>,
                                                th: ({ node, ...props }) => <th className="bg-gray-100 p-1 border font-semibold" {...props} />,
                                                td: ({ node, ...props }) => <td className="p-1 border" {...props} />,
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>
                                    {msg.list && (
                                        <ul className="mt-2 space-y-1 list-disc list-inside opacity-80 text-xs">
                                            {msg.list.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border bg-brand border-brand/50">
                                    AI
                                </div>
                                <div className="p-4 rounded-2xl shadow-sm text-sm border max-w-[85%] bg-white text-gray-700 rounded-tl-none border-gray-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white border-t">
                        <div className="flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-brand transition-colors">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask a question..."
                                className="bg-transparent flex-1 text-sm outline-none text-dark placeholder-gray-400 h-10"
                            />
                            <button
                                onClick={handleSend}
                                className="w-10 h-10 bg-black rounded-full text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatOverlay;
