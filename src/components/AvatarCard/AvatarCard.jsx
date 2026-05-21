/* src/components/AvatarCard/AvatarCard.jsx */
import React from 'react';
import { Mic, Volume2, HelpCircle, Loader2 } from 'lucide-react';
import './AvatarCard.css';

export default function AvatarCard({ interviewer, name, state }) {
  // state can be: 'idle', 'speaking', 'listening', 'thinking'
  
  const getStatusText = () => {
    switch (state) {
      case 'speaking': return 'Speaking...';
      case 'listening': return 'Listening...';
      case 'thinking': return 'Thinking...';
      default: return 'Online';
    }
  };

  const getStatusIcon = () => {
    switch (state) {
      case 'speaking': return <Volume2 className="status-icon-glow" size={14} />;
      case 'listening': return <Mic className="status-icon-glow-success" size={14} />;
      case 'thinking': return <Loader2 className="status-icon-glow-thinking spinning" size={14} />;
      default: return <HelpCircle size={14} />;
    }
  };

  // Paths to custom generated images in public folder
  const avatarImgSrc = interviewer === 'female' ? '/avatars/female_avatar.png' : '/avatars/male_avatar.png';

  return (
    <div className={`avatar-card-container glass-panel ${state}`}>
      {/* Glow Rings behind the Avatar */}
      <div className="bg-glow-layer"></div>
      
      {/* Corner Status Badge */}
      <div className={`status-badge ${state}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>

      {/* Main Avatar Wrapper */}
      <div className={`avatar-wrapper ${state}`}>
        {/* Status ring */}
        <div className="avatar-ring-glow"></div>
        
        {/* Actual Avatar Image */}
        <div className="avatar-image-container">
          <img 
            src={avatarImgSrc} 
            alt={name} 
            className="avatar-image"
            onError={(e) => {
              // If image isn't generated yet or fails, show a beautiful geometric placeholder
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Cybernetic Geometric Placeholder */}
          <div className={`avatar-placeholder-face ${interviewer}-gradient`}>
            <div className="cyber-eye left"></div>
            <div className="cyber-eye right"></div>
            <div className="cyber-mouth"></div>
            <div className="cyber-grid"></div>
          </div>
        </div>
      </div>

      {/* Equalizer Visualizer Overlay */}
      <div className="visualizer-container">
        {state === 'speaking' && (
          <div className="equalizer speaking-eq">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        )}
        {state === 'listening' && (
          <div className="equalizer listening-eq">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        )}
        {state === 'thinking' && (
          <div className="thinking-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        {state === 'idle' && (
          <div className="idle-indicator">
            <span>Interviewer is ready to speak</span>
          </div>
        )}
      </div>

      {/* Avatar Identity Footer */}
      <div className="avatar-info-footer">
        <h3 className="avatar-name">{name}</h3>
        <p className="avatar-role">
          {interviewer === 'female' ? 'Technical Lead @ IntervAI' : 'Senior Recruiter @ IntervAI'}
        </p>
      </div>
    </div>
  );
}
