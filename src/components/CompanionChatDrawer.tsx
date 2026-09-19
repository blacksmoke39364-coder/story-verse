import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircleQuestion,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  BookOpen,
  HelpCircle,
  Smile,
} from 'lucide-react';
import { ChildProfile, Story } from '../types';
import { playWebSpeech } from '../utils/audio';

interface ChatMessage {
  sender: 'user' | 'companion';
  text: string;
  timestamp: string;
}

interface CompanionChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildProfile;
  currentStory?: Story;
  initialContext?: string;
  language?: string;
}

const QUICK_SUGGESTIONS = [
  'What does this story teach us?',
  'Explain the hard words on this page',
  'Tell me a cozy bedtime riddle!',
  'What if we picked a different choice?',
];

export const CompanionChatDrawer: React.FC<CompanionChatDrawerProps> = ({
  isOpen,
  onClose,
  child,
  currentStory,
  initialContext,
  language = 'en',
}) => {
  const isHindi = language === 'hi';
  const isTelugu = language === 'te';

  const defaultGreeting = isHindi
    ? `हूट-हूट! नमस्ते ${child.firstName}! मैं बार्नाबी, चाँद का उल्लू हूँ। 🦉 मुझे परियों और सितारों की कहानियाँ बहुत पसंद हैं! आज रात हम क्या पढ़ें?`
    : isTelugu
    ? `హూట్-హూట్! నమస్కారం ${child.firstName}! నేను బార్నబీ, జాబిల్లి గుడ్లగూబను. 🦉 కథలు వినడం నాకు చాలా ఇష్టం! ఈ రాత్రి ఏం వినాలనుకుంటున్నావు?`
    : `Hoo-hoo! Hello ${child.firstName}! I'm Barnaby the Moon Owl. 🦉 I love bedtime stories! How can I help you explore tonight?`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'companion',
      text: defaultGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for the API
      const conversationHistory = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const contextPrompt = initialContext || (currentStory ? `Story: "${currentStory.title}". Child: ${child.firstName}, age ${child.age}.` : `Child: ${child.firstName}, age ${child.age}.`);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          messages: [...conversationHistory, { role: 'user', text: textToSend }],
          currentStoryContext: contextPrompt,
          roleType: 'story_owl',
          characterName: 'Barnaby the Moon Owl',
          childAge: child.age,
          language: language || currentStory?.language || child.preferredLanguage || 'en',
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        (isHindi
          ? `हूट-हूट! कितना प्यारा सवाल है ${child.firstName}! कहानियों में हमेशा जादू होता है।`
          : isTelugu
          ? `హూట్-హూట్! ఎంత చక్కని ప్రశ్న ${child.firstName}! కథల్లో ఎంతో మాయ దాగుంది.`
          : `Hoo-hoo! That is such a thoughtful question, ${child.firstName}! Bedtime stories are full of wonder.`);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'companion',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'companion',
          text: isHindi
            ? `हूट-हूट! तारे चमक रहे हैं। चलो साथ में अगली प्यारी कहानी पढ़ते हैं! ✨`
            : isTelugu
            ? `హూట్-హూట్! చుక్కలు మెరుస్తున్నాయి. మన తర్వాతి అందమైన కథను కలిసి చదువుకుందాం! ✨`
            : `Hoo-hoo! The stars are twinkling softly. Let's cozy up and read our next bedtime page together! ✨`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    playWebSpeech(text, language || currentStory?.language || 'en', 0.95);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div
        id="companion-chat-drawer"
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l-2 border-amber-200 dark:border-slate-700 shadow-2xl flex flex-col justify-between"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-amber-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/70 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
              🦉
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-['Shantell_Sans',sans-serif]">
                  Barnaby the Story Owl
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Safe Bedtime Companion • No Ads • Kid Safe
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
          {messages.map((msg, idx) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                    🦉
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm font-medium ${
                    isUser
                      ? 'bg-amber-500 text-white rounded-tr-xs'
                      : 'bg-amber-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-amber-200 dark:border-slate-700 rounded-tl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="hover:opacity-100 p-0.5 cursor-pointer"
                        title="Listen to Barnaby's voice"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center text-xs shrink-0 mt-1 font-bold">
                    {child.avatar}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
              <span>Barnaby is thinking softly...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {QUICK_SUGGESTIONS.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-slate-700 whitespace-nowrap cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-amber-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Barnaby about your story..."
              className="flex-1 p-3 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Restricted bedtime companion • Always respectful, safe, and calming.
          </p>
        </div>
      </div>
    </div>
  );
};
