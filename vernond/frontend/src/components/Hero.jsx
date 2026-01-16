import { useState } from 'react';
import './Hero.css';
import TabPanel from './TabPanel';

function Hero({ onShowToast }) {
    const [activeTab, setActiveTab] = useState('watch');

    const tabContent = {
        watch: {
            title: 'Watch & Learn',
            description: 'Access comprehensive lessons from expert magicians with detailed breakdowns of sleight of hand techniques.',
            icon: '🎬'
        },
        learn: {
            title: 'Personalized Practice',
            description: 'Get customized practice routines tailored to your skill level and the tricks you want to master.',
            icon: '🎯'
        },
        practice: {
            title: 'AI Analysis & Feedback',
            description: 'Receive real-time AI-powered feedback on your technique, timing, and performance to accelerate your learning.',
            icon: '🤖'
        }
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
                        <div className="demo-card">
                            <div className="demo-card__icon">{tabContent[activeTab].icon}</div>
                            <h3 className="demo-card__title">{tabContent[activeTab].title}</h3>
                            <p className="demo-card__description">{tabContent[activeTab].description}</p>
                            <button
                                className="btn btn-primary demo-card__cta"
                                onClick={() => onShowToast?.('Feature coming soon! 🎩✨')}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
