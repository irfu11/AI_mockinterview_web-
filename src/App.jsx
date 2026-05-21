/* src/App.jsx */
import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, ShieldAlert, Cpu } from 'lucide-react';
import DomainSelector from './components/DomainSelector/DomainSelector';
import InterviewPanel from './components/InterviewPanel/InterviewPanel';
import ScoreDashboard from './components/ScoreDashboard/ScoreDashboard';
import { generateQuestions } from './services/gemini';
import './App.css';

export default function App() {
  const [step, setStep] = useState('selector'); // selector, loading, interview, score
  const [interviewConfig, setInterviewConfig] = useState(null);
  
  // Loading state visual helper
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMessages] = useState([
    "Configuring secure interview terminal...",
    "Instantiating AI avatar core...",
    "Retrieving custom technical evaluation matrix...",
    "Connecting to Gemini cognitive pipelines...",
    "Calibrating speech engine. Ready to launch..."
  ]);
  
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // Cycling through loading logs during the transition for added polish
  useEffect(() => {
    let interval;
    if (step === 'loading') {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [step]);

  // Launch live interview
  const handleStartInterview = async (config) => {
    setInterviewConfig(config);
    setStep('loading');
    setErrorMsg(null);

    try {
      // Call Gemini API (or fallback local bank inside service)
      const generatedQuestions = await generateQuestions(config.domain, config.difficulty, config.apiKey);
      
      if (!generatedQuestions || generatedQuestions.length === 0) {
        throw new Error("Could not load interview questions.");
      }
      
      setQuestions(generatedQuestions);
      
      // Delay transition to make the loading steps visible to candidate
      setTimeout(() => {
        setStep('interview');
      }, 3500);
      
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to start the interview session. Reverting to menu.");
      setStep('selector');
    }
  };

  // Complete interview
  const handleFinishInterview = (interviewResults) => {
    setResults(interviewResults);
    setStep('score');
  };

  // Cancel and go back
  const handleCancelInterview = () => {
    if (window.confirm("Are you sure you want to cancel the interview? Your progress will be lost.")) {
      setStep('selector');
    }
  };

  return (
    <div className="app-root-container">
      {/* Global navbar */}
      <header className="main-navbar glass-panel">
        <div className="nav-brand" onClick={() => setStep('selector')}>
          <Cpu className="brand-logo-icon" />
          <span className="brand-text">Interv<span>AI</span></span>
        </div>
        
        <div className="nav-meta">
          <Terminal size={14} className="nav-meta-icon" />
          <span className="nav-status-label">Terminal Active</span>
        </div>
      </header>

      <main className="content-viewport">
        {errorMsg && (
          <div className="global-error-toast glass-panel">
            <ShieldAlert className="error-toast-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 'selector' && (
          <DomainSelector onStartInterview={handleStartInterview} />
        )}

        {step === 'loading' && (
          <div className="cyber-loading-screen animate-fade-in">
            <div className="loading-card glass-panel">
              <div className="scanner-line"></div>
              
              <div className="spinning-loader-wrapper">
                <div className="spinner-outer"></div>
                <div className="spinner-inner"></div>
                <Sparkles size={24} className="spinner-center-icon" />
              </div>
              
              <h2 className="loading-title">Setting Up Interview Room</h2>
              
              <div className="console-log-box">
                {loadingMessages.slice(0, loadingStep + 1).map((msg, i) => (
                  <div key={i} className={`console-line ${i === loadingStep ? 'active' : ''}`}>
                    <span className="prompt-sym">&gt;</span> {msg}
                  </div>
                ))}
              </div>
              
              <p className="loading-footer">Selected Profile: {interviewConfig?.domain} • {interviewConfig?.difficulty.toUpperCase()}</p>
            </div>
          </div>
        )}

        {step === 'interview' && (
          <InterviewPanel 
            interviewConfig={interviewConfig}
            questions={questions}
            onFinishInterview={handleFinishInterview}
            onCancel={handleCancelInterview}
          />
        )}

        {step === 'score' && (
          <ScoreDashboard 
            results={results}
            interviewConfig={interviewConfig}
            onRestart={() => setStep('selector')}
          />
        )}
      </main>

      {/* Global footer */}
      <footer className="global-footer">
        <p>&copy; {new Date().getFullYear()} IntervAI Systems. Engineered for technical validation.</p>
      </footer>
    </div>
  );
}
