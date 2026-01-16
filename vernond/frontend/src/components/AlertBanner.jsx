import qrcode from '../assets/qrcode.jpg';
import './AlertBanner.css';

function AlertBanner({ onJoinCommunity }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showContacts, setShowContacts] = useState(false);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleJoinCommunity = () => {
    setShowContacts(!showContacts);
    onJoinCommunity?.();
  };

  if (!isVisible) return null;

  return (
    <div className="alert-banner">
      <div className="alert-banner__container">
        <div className="alert-banner__icon">✨</div>
        <div className="alert-banner__content">
          <strong>🚀 We're still building something magical!</strong>
          <span className="alert-banner__text">
            Join our community to get first-hand information about the product release.
          </span>
        </div>
        <button
          className="alert-banner__cta"
          onClick={handleJoinCommunity}
        >
          {showContacts ? 'Hide Contacts' : 'Join Community'}
        </button>
        <button
          className="alert-banner__close"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      </div>

      {/* Contact Info Dropdown */}
      {showContacts && (
        <div className="alert-banner__contacts">
          <div className="alert-banner__contacts-container">
            <div className="contact-item">
              <img
                src={qrcode}
                alt="WeChat QR Code"
                className="contact-item__qr"
              />
              <span className="contact-item__label">WeChat</span>
            </div>

            <a
              href="https://discord.gg/RrVE3mAd"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item contact-item--link"
            >
              <div className="contact-item__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <span className="contact-item__label">Discord</span>
              <span className="contact-item__text">Join our server</span>
            </a>

            <a
              href="https://www.instagram.com/vernond_ai?igsh=OXMxNDdjcXd0Z2Fo"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item contact-item--link"
            >
              <div className="contact-item__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.272 2.69.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.612 6.766 6.97 6.97 1.28.057 1.688.072 4.947.072s3.667-.015 4.947-.072c4.351-.2 6.764-2.612 6.97-6.97.058-1.28.072-1.688.072-4.947s-.015-3.667-.072-4.947c-.2-4.353-2.612-6.766-6.97-6.97C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                </svg>
              </div>
              <span className="contact-item__label">Instagram</span>
              <span className="contact-item__text">@vernond_ai</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertBanner;
