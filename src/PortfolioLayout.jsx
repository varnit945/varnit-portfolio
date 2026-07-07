import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { usePresenter } from './PresenterContext';
import Avatar from './Avatar';
import ErrorBoundary from './ErrorBoundary';
import PortfolioSections from './PortfolioSections';
import { 
  Volume2, VolumeX, Play, Square, Mic, Send, RefreshCw, 
  Cpu, Sparkles, Navigation, ChevronRight, HelpCircle 
} from 'lucide-react';

export default function PortfolioLayout() {
  const {
    currentSection,
    isPlaying,
    isMuted,
    playbackSpeed,
    setPlaybackSpeed,
    subtitles,
    currentWordIndex,
    isListening,
    chatLog,
    toggleMute,
    startNarrationForSection,
    stopSpeaking,
    startListening,
    handleUserQuery,
    isInitialized,
    setIsInitialized
  } = usePresenter();

  const [inputVal, setInputVal] = useState('');
  const [activeTab, setActiveTab] = useState('portfolio');

  const onSubmitChat = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleUserQuery(inputVal);
    setInputVal('');
  };

  const handleReplay = () => {
    startNarrationForSection(currentSection, 0);
  };

  if (!isInitialized) {
    return (
      <div className="init-screen">
        <div className="init-panel glass-panel">
          <div className="init-header">
            <Cpu size={32} className="init-icon" />
            <h1>AI PRESENTATION CONSOLE</h1>
            <p>PRESENTER MODULE v1.0.4</p>
          </div>
          <div className="init-body">
            <p style={{ color: '#cbd5e1', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              System requests authorization to activate the interactive 3D presenter and neural speech engine.
            </p>
            <button 
              onClick={() => {
                setIsInitialized(true);
                // Immediately start narration on user click to unlock browser audio synthesis
                startNarrationForSection('hero', 0);
              }}
              className="btn-primary init-btn"
            >
              INITIALIZE INTERFACE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="bg-grid"></div>
      <div className="bg-pattern"></div>

      {/* Header */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-badge">V</div>
          <div>
            <span className="logo-text">VARNIT</span>
            <span className="logo-sub">PRESENTER.SYS v1.0</span>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#hero" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#datascience" className="nav-link">Analytics</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        <div>
          <button 
            onClick={() => setActiveTab(activeTab === 'portfolio' ? 'chat' : 'portfolio')}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', gap: '0.375rem' }}
          >
            <Cpu size={14} className={activeTab === 'chat' ? 'animate-spin' : ''} />
            {activeTab === 'chat' ? 'Close BOSS Console' : 'Ask BOSS AI'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="main-workspace">
        
        {/* Holographic 3D Viewport */}
        <div className="viewport-panel">
          
          <div className="hud-overlay">
            <div>CAM_STAT: ACTIVE</div>
            <div>FPS: 60 / FIXED</div>
            <div>AVATAR: VARNIT_V1</div>
            <div className="hud-status">
              <span className={`hud-dot ${isPlaying ? 'active' : 'idle'}`}></span>
              STATUS: {isPlaying ? 'SPEAKING' : 'IDLE'}
            </div>
          </div>

          <div className="canvas-container">
            <ErrorBoundary fallback={(error) => (
              <div className="pulse-orb-container">
                <div className="pulse-orb-wrapper">
                  <div className="pulse-orb-ring-outer"></div>
                  <div className="pulse-orb-ring"></div>
                  <div className="pulse-orb"></div>
                </div>
                <div className="pulse-orb-text">BOSS Core Online</div>
                <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#f87171', marginTop: '1rem', maxWidth: '80%', textAlign: 'center', wordBreak: 'break-all' }}>
                  ERROR: {error?.message || String(error)}
                </div>
              </div>
            )}>
              <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <ambientLight intensity={1.1} />
                <directionalLight position={[2, 3, 5]} intensity={1.5} />
                <directionalLight position={[-2, 1, 2]} intensity={0.6} />
                <spotLight position={[0, 5, -2]} intensity={0.5} />
                <Environment preset="city" />
                <React.Suspense fallback={null}>
                  <Avatar />
                </React.Suspense>
                <OrbitControls 
                  enableZoom={false}
                  minPolarAngle={Math.PI/2.5}
                  maxPolarAngle={Math.PI/1.9}
                  minAzimuthAngle={-Math.PI/4}
                  maxAzimuthAngle={Math.PI/4}
                />
                <ContactShadows opacity={0.6} scale={10} blur={1} far={10} resolution={256} color="#000000" position={[0, -3.1, 0]} />
              </Canvas>
            </ErrorBoundary>
          </div>

          {/* Subtitles & Controls */}
          <div className="control-bar">
            
            <div className="subtitles-box">
              {subtitles ? (
                subtitles.split(/\s+/).map((word, idx) => (
                  <span 
                    key={idx} 
                    className={idx === currentWordIndex ? 'word-highlight' : 'word-normal'}
                  >
                    {word}{' '}
                  </span>
                ))
              ) : (
                <span style={{ color: '#64748b', fontStyle: 'italic' }}>
                  Avatar active. Scroll or click menu to begin presentation narration.
                </span>
              )}
            </div>

            <div className="controls-row">
              <div className="btn-group">
                <button 
                  onClick={toggleMute}
                  className={`btn-icon ${isMuted ? 'active' : ''}`}
                  title={isMuted ? "Unmute Narration" : "Mute Narration"}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button 
                  onClick={handleReplay}
                  className="btn-icon"
                  title="Replay Section"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              <div className="speed-selector">
                {[0.8, 1.0, 1.2, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`speed-btn ${playbackSpeed === spd ? 'active' : ''}`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Scrollable Content or Chat Panel */}
        <div className="content-panel">
          
          {activeTab === 'portfolio' ? (
            <PortfolioSections />
          ) : (
            /* Jarvis AI Q&A Terminal */
            <div className="boss-console">
              <div>
                <div className="console-header">
                  <div className="console-header-icon">
                    <Sparkles size={20} />
                  </div>
                  <div className="console-title-text">
                    <h2>BOSS Interface</h2>
                    <p>Direct communication interface with Varnit's avatar.</p>
                  </div>
                </div>

                <div className="chat-messages">
                  <div className="chat-bubble ai">
                    <span className="bubble-sender ai">BOSS</span>
                    <div className="bubble-content">
                      Hi, I'm Varnit's digital avatar. Ask me anything about my projects, skills, resume, or background!
                    </div>
                  </div>

                  {chatLog.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                      <span className={`bubble-sender ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                        {msg.sender === 'user' ? 'USER' : 'BOSS'}
                      </span>
                      <div className="bubble-content">{msg.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={onSubmitChat} className="chat-input-form">
                <input 
                  type="text" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask about my background..."
                  className="chat-input"
                />
                
                <button 
                  type="button"
                  onClick={startListening}
                  className="btn-icon"
                  style={{ 
                    padding: '0.5rem', 
                    background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                    borderColor: isListening ? '#ef4444' : 'transparent',
                    color: isListening ? '#f87171' : '#94a3b8' 
                  }}
                  title="Speak using Mic"
                >
                  <Mic size={16} />
                </button>

                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ padding: '0.5rem 1rem', boxShadow: 'none' }}
                >
                  <Send size={16} />
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
