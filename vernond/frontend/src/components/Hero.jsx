import { useState, useRef } from 'react';
import './Hero.css';
import TabPanel from './TabPanel';

function Hero({ onShowToast }) {
    const [activeTab, setActiveTab] = useState('watch');
    const [watchPlaying, setWatchPlaying] = useState(false);
    const [learnPlaying, setLearnPlaying] = useState(false);
    const watchVideoRef = useRef(null);
    const learnVideoRef = useRef(null);

    const tabContent = {
        watch: {
            title: 'Watch & Learn',
            description: 'Access comprehensive lessons from expert magicians with detailed breakdowns of sleight of hand techniques.',
            icon: '🎬',
            video: '/videos/performance_compressed.mp4'
        },
        learn: {
            title: 'Personalized Practice',
            description: 'Get customized practice routines tailored to your skill level and the tricks you want to master.',
            icon: '🎯',
            video: '/videos/learn_compressed.mp4'
        },
        practice: {
            title: 'AI Analysis & Feedback',
            description: 'Receive real-time AI-powered feedback on your technique, timing, and performance to accelerate your learning.',
            icon: '🤖',
            video: null
        }
    };

    const handleVideoClick = (videoRef, setPlaying, isPlaying) => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setPlaying(true);
            } else {
                videoRef.current.pause();
                setPlaying(false);
            }
        }
    };

    const renderContent = () => {
        const content = tabContent[activeTab];

        if (activeTab === 'watch') {
            return (
                <div
                    className={`demo-video-container ${watchPlaying ? 'playing' : ''}`}
                    onClick={() => handleVideoClick(watchVideoRef, setWatchPlaying, watchPlaying)}
                >
                    <video
                        ref={watchVideoRef}
                        className="demo-video"
                        src={content.video}
                        loop
                        playsInline
                        onEnded={() => setWatchPlaying(false)}
                    />
                    <div className="demo-video__overlay">
                        <span className="demo-video__play-icon">▶</span>
                    </div>
                </div>
            );
        }

        if (activeTab === 'learn') {
            return (
                <div
                    className={`demo-video-container ${learnPlaying ? 'playing' : ''}`}
                    onClick={() => handleVideoClick(learnVideoRef, setLearnPlaying, learnPlaying)}
                >
                    <video
                        ref={learnVideoRef}
                        className="demo-video"
                        src={content.video}
                        loop
                        playsInline
                        onEnded={() => setLearnPlaying(false)}
                    />
                    <div className="demo-video__overlay">
                        <span className="demo-video__play-icon">▶</span>
                    </div>
                </div>
            );
        }

        // Practice tab - show the original card content
        return (
            <div className="demo-card">
                <div className="demo-card__icon">{content.icon}</div>
                <h3 className="demo-card__title">{content.title}</h3>
                <p className="demo-card__description">{content.description}</p>
                <button
                    className="btn btn-primary demo-card__cta"
                    onClick={() => onShowToast?.('Feature coming soon! 🎩✨')}
                >
                    Get Started
                </button>
            </div>
        );
    };

    return (
        <section className="hero">
            <div className="hero__container">
                <div className="hero__content">
                    <div className="hero__badge">
                        <span className="hero__badge-hearts">🪄</span>
                        <span className="hero__badge-text">Vernond AI is coming...</span>
                    </div>

                    <h1 className="hero__title">
                        Unveil the <span className="text-glow">Magic</span>
                    </h1>
                    <h2 className="hero__subtitle">Your first AI Coach for close-up magic</h2>

                    <p className="hero__description">
                        Master the art of sleight of hand with personalized lessons, real-time AI feedback, and professional practice routines.
                    </p>

                    <div className="hero__suits">
                        <span className="suit suit--heart">♥</span>
                        <span className="suit suit--spade">♠</span>
                        <span className="suit suit--diamond">♦</span>
                        <span className="suit suit--club">♣</span>
                    </div>
                </div>

                <div className="hero__demo">
                    <TabPanel
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    <div className="hero__demo-content">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
