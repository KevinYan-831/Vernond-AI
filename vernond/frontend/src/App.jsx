import { useState, useCallback } from 'react';
import AlertBanner from './components/AlertBanner';
import Header from './components/Header';
import Hero from './components/Hero';
import ToastContainer from './components/Toast';
import './App.css';

function App() {
  const [showAlert, setShowAlert] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleJoinWaitlist = () => {
    showToast('Thanks for your interest! 🎩 We\'ll notify you when we launch.');
  };

  const handleJoinCommunity = () => {
    showToast('Check out our community channels below! ✨');
  };

  return (
    <div className="app-container">
      {/* Card Suit Particles Background */}
      <div className="particles">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
              fontSize: `${12 + Math.random() * 10}px`
            }}
          />
        ))}
      </div>

      {/* Alert Banner - Fixed at Top */}
      {showAlert && (
        <AlertBanner onJoinCommunity={handleJoinCommunity} />
      )}

      {/* Main Content */}
      <div className="main-content">
        <Header />
        <Hero onShowToast={showToast} />
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
