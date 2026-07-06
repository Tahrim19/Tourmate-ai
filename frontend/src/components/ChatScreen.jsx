import { useContext, useEffect, useRef } from 'react';
import { ChevronLeft, RefreshCw, HelpCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import useChat from '../hooks/useChat';
import UserBubble from './UserBubble';
import AIBubble from './AIBubble';
import SuggestionChips from './SuggestionChips';
import TypingIndicator from './TypingIndicator';
import ErrorState from './ErrorState';
import ChatInput from './ChatInput';
import Dock from './react-bits/Dock';
import BlurFade from './react-bits/BlurFade';

export default function ChatScreen() {
  const { 
    currentCity, 
    messages, 
    setMessages,
    loading, 
    error, 
    setError,
    setCurrentScreen, 
    startNewSession 
  } = useContext(AppContext);
  
  const { sendMessage } = useChat();
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive or loading states change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, error]);

  const handleBackToHome = () => {
    setError(null);
    setCurrentScreen("home");
  };

  const handleChipClick = (queryText) => {
    if (loading) return;
    sendMessage(queryText);
  };

  const handleRetryLastAction = () => {
    // Locate last user message
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length > 0) {
      const lastMessageText = userMessages[userMessages.length - 1].content;
      
      // Clean last user query representation from message history to avoid duplication on screen
      setMessages(prev => {
        const lastIdx = prev.map(m => m.role).lastIndexOf('user');
        if (lastIdx !== -1) {
          return prev.filter((_, i) => i !== lastIdx);
        }
        return prev;
      });

      // Re-trigger send
      sendMessage(lastMessageText);
    } else {
      setError(null);
    }
  };

  return (
    <BlurFade className="flex-1 flex flex-col h-screen bg-bg-primary select-none overflow-hidden relative">
      {/* 1. Header Navigation */}
      <header className="px-4 py-3 bg-[#111] border-b border-[#202020] flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackToHome}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition duration-200"
            title="Go to Home"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex flex-col">
            <span className="text-[10px] text-accent-teal uppercase tracking-widest font-bold">
              TourMate AI Assistant
            </span>
            <span className="text-sm font-extrabold text-white">
              📍 {currentCity}
            </span>
          </div>
        </div>

        <button
          onClick={() => startNewSession()}
          className="flex items-center gap-1 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-text-secondary hover:text-white transition duration-200 border border-white/5"
          title="Start fresh conversation"
        >
          <RefreshCw size={11} />
          Reset Chat
        </button>
      </header>

      {/* 2. Messages Log viewport */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 pb-32 no-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-accent-teal/10 border border-accent-teal/20 text-accent-teal flex items-center justify-center mb-4">
              <HelpCircle size={24} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">
              Ask about {currentCity}!
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Query specific local foods, attractions, day planning timelines, or select one of the suggestions below.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx}>
              {msg.role === 'user' ? (
                <UserBubble message={msg} />
              ) : (
                <AIBubble message={msg} />
              )}
            </div>
          ))
        )}

        {/* Bouncing Dots Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}

        {/* Display Error Card */}
        {error && (
          <ErrorState 
            error={error} 
            onRetry={handleRetryLastAction} 
          />
        )}

        {/* Dummy scroll point */}
        <div ref={messagesEndRef} />
      </main>

      {/* 3. Suggestion Chips strip above input */}
      <div className="absolute bottom-[80px] left-0 right-0 px-4 sm:px-6 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent pt-6 pb-2 z-10 shrink-0">
        <SuggestionChips onChipClick={handleChipClick} />
      </div>

      {/* 4. Bottom Dock Input */}
      <Dock className="!bottom-4">
        <button
          onClick={handleBackToHome}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-accent-teal hover:text-accent-teal-light transition duration-200 shrink-0"
          title="Back to City View"
        >
          <ChevronLeft size={15} />
        </button>
        <div className="w-px h-6 bg-[#252525]" />
        <ChatInput 
          onSend={sendMessage} 
          disabled={loading} 
          placeholder={`Ask about ${currentCity} (attractions, food, trips)...`}
        />
      </Dock>
    </BlurFade>
  );
}
