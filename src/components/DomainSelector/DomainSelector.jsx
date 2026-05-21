/* src/components/DomainSelector/DomainSelector.jsx */
import React, { useState, useEffect } from 'react';
import { Sparkles, Key, Code2, Database, BarChart3, ShieldAlert, Cpu, Award } from 'lucide-react';
import './DomainSelector.css';

// 4-Pointed Sparkle Star SVG Component from Reference Image
const SparkleStar = ({ className }) => (
  <svg className={`sparkle-star ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 0C50 27.6142 38.8071 50 11.1929 50C38.8071 50 50 72.3858 50 100C50 72.3858 61.1929 50 88.8071 50C61.1929 50 50 27.6142 50 0Z" fill="white" />
  </svg>
);

export default function DomainSelector({ onStartInterview }) {
  const [selectedDomain, setSelectedDomain] = useState('web-development');
  const [selectedInterviewer, setSelectedInterviewer] = useState('female'); // female (Sophia), male (Alex)
  const [difficulty, setDifficulty] = useState('mid-level');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInfo, setShowKeyInfo] = useState(false);

  // Load API Key from LocalStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleStart = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
    
    const domainName = DOMAINS.find(d => d.id === selectedDomain)?.name || 'Web Development';
    
    onStartInterview({
      domain: domainName,
      domainId: selectedDomain,
      interviewer: selectedInterviewer,
      interviewerName: selectedInterviewer === 'female' ? 'Sophia' : 'Alex',
      difficulty,
      apiKey: apiKey.trim() || null
    });
  };

  const DOMAINS = [
    {
      id: 'web-development',
      name: 'Web Development',
      icon: Code2,
      desc: 'Frontend, backend, APIs, system design, performance, security, and React architectures.',
      color: '#ffffff'
    },
    {
      id: 'data-science',
      name: 'Data Science',
      icon: Cpu,
      desc: 'Machine learning, statistics, neural networks, ML pipelines, and data preprocessing.',
      color: '#ffffff'
    },
    {
      id: 'data-analytics',
      name: 'Data Analytics',
      icon: BarChart3,
      desc: 'SQL query design, metrics, dashboards, statistics, and cohort analytics.',
      color: '#ffffff'
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity',
      icon: ShieldAlert,
      desc: 'Network security, penetration testing, cryptography, OWASP top 10, and Zero Trust.',
      color: '#ffffff'
    }
  ];

  const DIFFICULTIES = [
    { id: 'junior', name: 'Junior', desc: 'Core fundamentals & definitions' },
    { id: 'mid-level', name: 'Mid-Level', desc: 'Practical problems & architecture' },
    { id: 'senior', name: 'Senior', desc: 'System design & deep concepts' }
  ];

  return (
    <div className="selector-container animate-slide-up">
      {/* Background Sparkles from Reference UI */}
      <SparkleStar className="sparkle-1" />
      <SparkleStar className="sparkle-2" />
      <SparkleStar className="sparkle-3" />

      <div className="header-section text-center">
        <div className="logo-glow">
          <Sparkles className="logo-icon text-glow-primary" />
        </div>
        <h1 className="main-title">Select Your Domain</h1>
        <p className="subtitle">Launch a real-time, interactive technical interview with our AI evaluations</p>
      </div>

      <div className="grid-layout">
        {/* Left Column: Configuration options */}
        <div className="left-column glass-panel">
          <h2 className="section-title"><Award className="section-icon" /> 1. Interview Details</h2>
          
          {/* Interviewer Selection */}
          <div className="form-group">
            <label className="input-label">Select Your AI Interviewer</label>
            <div className="interviewer-grid">
              <div 
                className={`interviewer-card ${selectedInterviewer === 'female' ? 'active female' : ''}`}
                onClick={() => setSelectedInterviewer('female')}
              >
                <div className="avatar-placeholder female-bg">
                  <div className="glow-ring"></div>
                </div>
                <div className="interviewer-info">
                  <span className="name">Sophia</span>
                  <span className="role">Technical Lead (Sharp & Precise)</span>
                </div>
              </div>

              <div 
                className={`interviewer-card ${selectedInterviewer === 'male' ? 'active male' : ''}`}
                onClick={() => setSelectedInterviewer('male')}
              >
                <div className="avatar-placeholder male-bg">
                  <div className="glow-ring"></div>
                </div>
                <div className="interviewer-info">
                  <span className="name">Alex</span>
                  <span className="role">Senior Recruiter (Warm & Engaging)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="form-group">
            <label className="input-label">Target Level</label>
            <div className="difficulty-row">
              {DIFFICULTIES.map(diff => (
                <div
                  key={diff.id}
                  className={`difficulty-card ${difficulty === diff.id ? 'active' : ''}`}
                  onClick={() => setDifficulty(diff.id)}
                >
                  <div className="diff-name">{diff.name}</div>
                  <div className="diff-desc">{diff.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* API Key Panel */}
          <div className="form-group apiKey-section">
            <div className="label-with-action">
              <label className="input-label"><Key size={14} className="label-icon" /> Gemini API Key</label>
              <button 
                type="button" 
                className="info-btn"
                onClick={() => setShowKeyInfo(!showKeyInfo)}
              >
                What is this?
              </button>
            </div>
            
            <input
              type="password"
              className="api-input"
              placeholder="AI_Key... (Leave blank for Demo Mode)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            
            {showKeyInfo ? (
              <div className="info-box">
                <p>To run real-time questions and dynamic scoring, provide a <strong>Google Gemini API Key</strong>.</p>
                <p>We'll store it locally in your browser. If left blank, the site runs in <strong>Demo Mode</strong> with local templates.</p>
                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="key-link">
                  Get a Free Key from Google AI Studio &rarr;
                </a>
              </div>
            ) : (
              <p className="helper-text">
                {apiKey ? "API Key loaded from memory." : "No API Key? We will use high-quality local mock evaluation."}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Tech Domain selection */}
        <div className="right-column glass-panel">
          <h2 className="section-title"><Cpu className="section-icon" /> 2. Select Tech Domain</h2>
          
          <div className="domains-list">
            {DOMAINS.map(domain => {
              const Icon = domain.icon;
              const isSelected = selectedDomain === domain.id;
              return (
                <div
                  key={domain.id}
                  className={`domain-card ${isSelected ? 'active' : ''}`}
                  style={{ '--accent-color': domain.color }}
                  onClick={() => setSelectedDomain(domain.id)}
                >
                  <div className="domain-header">
                    <div className="icon-wrapper">
                      <Icon className="domain-icon" />
                    </div>
                    <span className="domain-title">{domain.name}</span>
                  </div>
                  <p className="domain-desc">{domain.desc}</p>
                </div>
              );
            })}
          </div>

          <button className="start-btn" onClick={handleStart}>
            Launch Live Interview
            <Sparkles size={18} className="start-icon" />
          </button>
        </div>
      </div>

      {/* Brand Logos Row from Reference UI */}
      <div className="logos-bar animate-fade-in">
        <p className="logos-title">INTERVIEWS DESIGNED TO MEET INDUSTRY STANDARDS AT</p>
        <div className="logos-grid">
          <div className="logo-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.92 1 1 5.92 1 12.24s4.92 11.24 11.24 11.24c6.6 0 11-4.64 11-11.24 0-.756-.08-1.333-.18-1.955H12.24z"/></svg>
            <span>Google</span>
          </div>
          <div className="logo-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.94-1.39z"/></svg>
            <span>Apple</span>
          </div>
          <div className="logo-item font-adobe">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M13.93 2.4L22.62 21.6H18.75L15.36 14.1H8.64L5.25 21.6H1.38L10.07 2.4H13.93Z"/></svg>
            <span>Adobe</span>
          </div>
          <div className="logo-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/></svg>
            <span>LinkedIn</span>
          </div>
          <div className="logo-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M0 0h11.4v11.4H0zm12.6 0H24v11.4H12.6zM0 12.6h11.4V24H0zm12.6 0H24V24H12.6z"/></svg>
            <span>Microsoft</span>
          </div>
          <div className="logo-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0h12v12H12zM0 12h12v12H0zM0 0h12v12H0z"/></svg>
            <span>Framer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
