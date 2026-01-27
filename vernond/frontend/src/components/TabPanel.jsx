import './TabPanel.css';

function TabPanel({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'watch', label: 'Watch' },
        { id: 'learn', label: 'Learn' },
        { id: 'practice', label: 'Practice' }
    ];

    return (
        <div className={`tab-panel ${activeTab === 'practice' ? 'tab-panel--expanded' : ''}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-panel__tab ${activeTab === tab.id ? 'tab-panel__tab--active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default TabPanel;
