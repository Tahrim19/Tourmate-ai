import { useContext } from 'react';
import { AppContext, AppContextProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';

/**
 * Renders the correct screen based on the navigation state in AppContext.
 */
function NavigationRouter() {
  const { currentScreen } = useContext(AppContext);

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    case 'home':
      return <HomeScreen />;
    case 'chat':
      return <ChatScreen />;
    default:
      return <SplashScreen />;
  }
}

/**
 * Application Entry Point.
 * Wraps layout components in the ErrorBoundary and AppContext.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <AppContextProvider>
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-sans select-none">
          <NavigationRouter />
        </div>
      </AppContextProvider>
    </ErrorBoundary>
  );
}
