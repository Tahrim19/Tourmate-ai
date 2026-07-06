/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  // Persist User ID and Last City across restarts
  const [userId, setUserId] = useState(() => localStorage.getItem("tourmate_userId") || "");
  const [currentCity, setCurrentCity] = useState(() => localStorage.getItem("tourmate_currentCity") || "");
  
  // Conversation session state
  const [sessionId, setSessionId] = useState("");
  const [currentScreen, setCurrentScreen] = useState("splash"); // splash, home, chat
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    if (userId) {
      localStorage.setItem("tourmate_userId", userId);
    }
  }, [userId]);

  useEffect(() => {
    if (currentCity) {
      localStorage.setItem("tourmate_currentCity", currentCity);
    } else {
      localStorage.removeItem("tourmate_currentCity");
    }
  }, [currentCity]);

  // Restart the chat session
  const startNewSession = (city = "") => {
    setSessionId("");
    setMessages([]);
    setError(null);
    if (city) {
      setCurrentCity(city);
      setCurrentScreen("home");
    } else {
      setCurrentCity("");
      setCurrentScreen("splash");
    }
  };

  return (
    <AppContext.Provider value={{
      userId,
      setUserId,
      currentCity,
      setCurrentCity,
      sessionId,
      setSessionId,
      currentScreen,
      setCurrentScreen,
      messages,
      setMessages,
      loading,
      setLoading,
      error,
      setError,
      startNewSession,
    }}>
      {children}
    </AppContext.Provider>
  );
}
