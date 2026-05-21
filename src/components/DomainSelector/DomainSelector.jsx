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
    </div>
  );
}
