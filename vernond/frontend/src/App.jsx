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
      {/* Magical Particles Background */}
      <div className="particles">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              fontSize: `${10 + Math.random() * 14}px`,
              opacity: 0.2 + Math.random() * 0.4
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
