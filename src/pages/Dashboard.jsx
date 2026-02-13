import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // VISIBLE_RANGE: сколько карточек рендерить вокруг центральной
    const VISIBLE_RANGE = 3;

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSections(data.sections || []);
                    // Начинаем с 0
                    setCurrentIndex(0);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [user.token]);

    const handleNext = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => prev - 1);
    };

    const getCardStyle = (index) => {
        if (sections.length === 0) return {};

        const offset = index - currentIndex;
        const absOffset = Math.abs(offset);

        // 3D Transform Logic
        const translateX = offset * 450;
        const translateZ = -absOffset * 300;
        const rotateY = offset * -30;
        const scale = 1 - absOffset * 0.18;
        const opacity = 1 - absOffset * 0.4;
        const zIndex = 100 - absOffset * 10;

        return {
            transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
            opacity: opacity > 0 ? opacity : 0,
            zIndex: Math.round(zIndex),
            pointerEvents: offset === 0 ? 'auto' : 'none',
            visibility: absOffset > VISIBLE_RANGE ? 'hidden' : 'visible',
            transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)'
        };
    };

    // --- Scroll Logic ---
    const [lastScrollTime, setLastScrollTime] = useState(0);
    const scrollThreshold = 800;
    const deltaThreshold = 30;

    const handleWheel = (e) => {
        const now = Date.now();
        if (now - lastScrollTime < scrollThreshold) return;

        const deltaX = e.deltaX;

        if (Math.abs(deltaX) > deltaThreshold) {
            if (deltaX > 0) {
                handleNext();
            } else {
                handlePrev();
            }
            setLastScrollTime(now);
        }
    };

    // Создаем "окно" индексов для рендеринга
    const getVisibleIndices = () => {
        const indices = [];
        for (let i = currentIndex - VISIBLE_RANGE; i <= currentIndex + VISIBLE_RANGE; i++) {
            indices.push(i);
        }
        return indices;
    };

    return (
        <div className="dashboard-container" onWheel={handleWheel}>
            <nav className="dashboard-nav">
                <div className="nav-logo">OBSERVER<span>.</span></div>
                <button className="logout-link" onClick={onLogout}>logout_01</button>
            </nav>

            <header className="hero-section">
                <h1 className="hero-title">
                    The Future of <br />
                    <span>Automation</span>
                </h1>
                <p className="hero-description">
                    Modular analytical platform for market observation and routine process delegation.
                </p>
            </header>

            <section className="carousel-section">
                <div className="carousel-container">
                    {loading ? (
                        <div className="loading-state">Initialising Systems...</div>
                    ) : sections.length === 0 ? (
                        <div className="loading-state">No connection to server or empty data.</div>
                    ) : (
                        <div className="carousel-3d">
                            {getVisibleIndices().map((virtualIndex) => {
                                const sectionIndex = ((virtualIndex % sections.length) + sections.length) % sections.length;
                                const section = sections[sectionIndex];
                                return (
                                    <div
                                        key={virtualIndex}
                                        className={`feature-card-3d ${!section.is_enabled ? 'disabled' : ''} ${virtualIndex === currentIndex ? 'active' : ''}`}
                                        style={getCardStyle(virtualIndex)}
                                        onClick={() => section.is_enabled && setCurrentIndex(virtualIndex)}
                                    >
                                        <div className="card-top">
                                            <span className="material-icons-round">{section.icon}</span>
                                            <div className="status-dot"></div>
                                        </div>
                                        <h3 className="card-title">{section.title}</h3>
                                        <p className="card-desc">{section.description}</p>
                                        <div className="card-footer">
                                            <button className="action-btn">
                                                {section.is_enabled ? 'Launch Instance' : 'Under Development'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <div className="bg-decor decoration-1"></div>
            <div className="bg-decor decoration-2"></div>
        </div>
    );
};

export default Dashboard;
