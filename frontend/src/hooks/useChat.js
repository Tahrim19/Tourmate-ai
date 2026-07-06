import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { chatRequest, quickRequest } from '../api';
import { parseResponse } from '../parser';

export default function useChat() {
  const {
    userId,
    setUserId,
    currentCity,
    setSessionId,
    setMessages,
    setLoading,
    setError,
    setCurrentScreen,
  } = useContext(AppContext);

  /**
   * Appends a new message to the local chat list.
   */
  const addMessage = (role, content) => {
    const parsedBlocks = role === 'ai' ? parseResponse(content) : [];
    const newMessage = {
      role,
      content,
      parsedCards: parsedBlocks,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  /**
   * Sends a general chat message from the input bar.
   */
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    setError(null);
    setLoading(true);

    // 1. Instantly show user message in conversation
    addMessage('user', messageText);

    try {
      const data = await chatRequest(messageText, currentCity, userId);

      // Save user ID generated or confirmed by backend
      if (data.user_id) {
        setUserId(data.user_id);
      }
      
      // Save session ID for conversation memory
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      // 2. Append parsed AI message to conversation
      addMessage('ai', data.response);
    } catch (err) {
      console.error("[useChat] Error sending message:", err);
      setError(err.message || "Failed to deliver message. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Requests category-specific recommendations (Attractions, Food, etc.).
   */
  const sendQuickRecommend = async (category) => {
    if (!currentCity) return;

    setError(null);
    setLoading(true);
    setCurrentScreen("chat");

    const categoryLabel = {
      attractions: "Discover top attractions, parks, and malls 🏛️",
      food: "Find local food, restaurants, and cafes 🍜",
      parks: "Explore parks, nature, and outdoor spots 🌳",
      itinerary: "Plan a full 1-day itinerary 🗓️",
    };

    const displayMsg = categoryLabel[category] || `Search for ${category} recommendations`;
    
    // Add user query placeholder
    addMessage('user', displayMsg);

    try {
      const data = await quickRequest(currentCity, category, userId);

      // Save identity references
      if (data.user_id) {
        setUserId(data.user_id);
      }
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      // Add response
      addMessage('ai', data.response);
    } catch (err) {
      console.error("[useChat] Error fetching quick recommend:", err);
      setError(err.message || "Could not retrieve recommendations. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    sendQuickRecommend,
  };
}
