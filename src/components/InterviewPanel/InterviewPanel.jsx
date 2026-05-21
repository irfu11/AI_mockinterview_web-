/* src/components/InterviewPanel/InterviewPanel.jsx */
import React, { useState, useEffect, useRef } from 'react';
import { Play, Mic, MicOff, Send, SkipForward, AlertCircle, RefreshCw, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import AvatarCard from '../AvatarCard/AvatarCard';
import { SpeechRecognizer, speak, stopSpeaking, isSTTSupported } from '../../services/speech';
import { evaluateAnswer } from '../../services/gemini';
import './InterviewPanel.css';

export default function InterviewPanel({ interviewConfig, questions, onFinishInterview, onCancel }) {
  const { domain, interviewer, interviewerName, apiKey } = interviewConfig;

  // Active question index
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // User answer input
  const [userAnswer, setUserAnswer] = useState('');
  
  // Status states
  const [avatarState, setAvatarState] = useState('idle'); // idle, speaking, listening, thinking
  const [isListening, setIsListening] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [micError, setMicError] = useState(null);
  
  // Chat history and scoring log
  const [results, setResults] = useState([]); // Array of { question, answer, score, feedback, sampleAnswer }
  const [showHistory, setShowHistory] = useState(false);

  // References for Speech
  const recognizerRef = useRef(null);
  const currentQuestionText = questions[currentIdx]?.text || '';

  // 1. Speak the question automatically when currentIdx changes
  useEffect(() => {
    if (currentQuestionText) {
      handleSpeakQuestion();
    }
    
    // Reset input for new question
    setUserAnswer('');
    setMicError(null);

    return () => {
      stopSpeaking();
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
    };
  }, [currentIdx, currentQuestionText]);

  // 2. TTS: Speak current question
  const handleSpeakQuestion = () => {
    setAvatarState('speaking');
    speak(
      currentQuestionText,
      interviewer,
      () => setAvatarState('speaking'),
      () => {
        setAvatarState('idle');
        // Automatically start listening after question completes for premium flow
        startVoiceListening();
      }
    );
  };

  // 3. STT: Start Listening
  const startVoiceListening = () => {
    if (!isSTTSupported()) {
      setMicError("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    stopSpeaking(); // Stop avatar speech if user interrupts
    setMicError(null);
    setIsListening(true);
    setAvatarState('listening');

    // Create recognizer if not exists
    if (!recognizerRef.current) {
      recognizerRef.current = new SpeechRecognizer(
        (text, interim) => {
          setUserAnswer(text);
        },
        (finalText) => {
          setIsListening(false);
          setAvatarState('idle');
          if (finalText) {
            setUserAnswer(finalText);
          }
        },
        (error) => {
          console.error("Speech Recognition Error:", error);
          setIsListening(false);
          setAvatarState('idle');
          if (error === 'not-allowed') {
            setMicError("Microphone access blocked. Enable permissions or type your answer.");
          } else {
            setMicError(`Mic Error: ${error}. Try typing your answer.`);
          }
        }
      );
    }

    recognizerRef.current.start();
  };

  // 4. STT: Stop Listening
  const stopVoiceListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
    setIsListening(false);
    setAvatarState('idle');
  };

  // Toggle Mic
  const toggleListening = () => {
    if (isListening) {
      stopVoiceListening();
    } else {
      startVoiceListening();
    }
  };

  // 5. Submit candidate's answer for evaluation
  const handleSubmitAnswer = async () => {
    if (isGrading) return;
    
    // Stop recording and speaking
    stopVoiceListening();
    stopSpeaking();

    // Guard against empty answers
    const trimmedAnswer = userAnswer.trim();
    if (!trimmedAnswer) {
      setMicError("Please type or speak an answer before submitting.");
      return;
    }

    setIsGrading(true);
    setAvatarState('thinking');

    try {
      // Send answer to Gemini / Local Evaluator
      const evaluation = await evaluateAnswer(currentQuestionText, trimmedAnswer, domain, apiKey);
      
      const updatedResults = [
        ...results,
        {
          question: currentQuestionText,
          answer: trimmedAnswer,
          score: evaluation.score,
          feedback: evaluation.feedback,
          sampleAnswer: evaluation.sampleAnswer,
          relevance: evaluation.relevance
        }
      ];

      setResults(updatedResults);
      setIsGrading(false);
      setAvatarState('idle');

      // Go to next question or complete interview
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        // Finished all 5 questions
        onFinishInterview(updatedResults);
      }
    } catch (err) {
      console.error("Failed to grade answer:", err);
      setIsGrading(false);
      setAvatarState('idle');
      setMicError("Failed to evaluate answer. Please try submitting again.");
    }
  };

  const handleSkipQuestion = () => {
    setUserAnswer("Question skipped by user.");
    handleSubmitAnswer();
  };

  return (
    <div className="interview-panel-container animate-fade-in">
      {/* Upper header */}
      <div className="interview-header glass-panel">
        <div className="header-meta">
          <span className="badge domain-badge">{domain}</span>
          <span className="badge difficulty-badge">{interviewConfig.difficulty.toUpperCase()}</span>
        </div>
        <div className="progress-section">
          <div className="progress-text">Question <span>{currentIdx + 1}</span> of {questions.length}</div>
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <button className="exit-btn" onClick={onCancel} title="Exit Interview">
          <XCircle size={18} />
          <span>Exit</span>
        </button>
      </div>

      {/* Main Grid: Avatar on Left, Chat/Input on Right */}
      <div className="interview-grid-layout">
        <div className="avatar-section">
          <AvatarCard 
            interviewer={interviewer} 
            name={interviewerName} 
            state={avatarState} 
          />
        </div>

        <div className="qna-section glass-panel">
          {/* Question Display Card */}
          <div className="question-display-card">
            <h4 className="card-label">Question</h4>
            <p className="question-text">{currentQuestionText}</p>
            <button className="replay-btn" onClick={handleSpeakQuestion} disabled={avatarState === 'speaking'}>
              <Play size={14} />
              <span>Repeat Question</span>
            </button>
          </div>

          {/* User Input Card */}
          <div className="answer-input-card">
            <h4 className="card-label">Your Response</h4>
            
            <textarea
              className="answer-textarea"
              placeholder={isListening ? "Listening... Speak clearly into your mic." : "Type your answer here, or click the mic to speak..."}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isGrading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmitAnswer();
                }
              }}
            />

            {micError && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{micError}</span>
              </div>
            )}

            {/* Response actions bar */}
            <div className="actions-bar">
              <button 
                className={`mic-btn ${isListening ? 'active' : ''}`} 
                onClick={toggleListening}
                disabled={isGrading}
                title={isListening ? "Stop voice typing" : "Start voice typing"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                <span>{isListening ? 'Stop Mic' : 'Voice Answer'}</span>
              </button>

              <div className="right-actions">
                <button 
                  className="skip-btn" 
                  onClick={handleSkipQuestion} 
                  disabled={isGrading}
                >
                  <SkipForward size={16} />
                  <span>Skip</span>
                </button>

                <button 
                  className="submit-btn" 
                  onClick={handleSubmitAnswer} 
                  disabled={isGrading || !userAnswer.trim()}
                >
                  {isGrading ? (
                    <>
                      <RefreshCw size={16} className="spinning" />
                      <span>Grading...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Submit Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="shortcut-tip">Tip: Press <code>Ctrl + Enter</code> to submit answer.</div>
          </div>
        </div>
      </div>

      {/* History Drawer */}
      {results.length > 0 && (
        <div className={`history-drawer glass-panel ${showHistory ? 'expanded' : 'collapsed'}`}>
          <div className="drawer-header" onClick={() => setShowHistory(!showHistory)}>
            <div className="drawer-title">
              <span>Interview Log</span>
              <span className="history-count">({results.length} graded)</span>
            </div>
            {showHistory ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </div>

          {showHistory && (
            <div className="drawer-content">
              {results.map((res, i) => (
                <div key={i} className="history-item">
                  <div className="history-q-row">
                    <span className="q-number">Q{i + 1}</span>
                    <p className="history-q-text">{res.question}</p>
                    <span className={`history-score ${res.score >= 8 ? 'good' : res.score >= 5 ? 'avg' : 'bad'}`}>
                      {res.score}/10
                    </span>
                  </div>
                  <div className="history-ans-box">
                    <p className="meta-lbl">Your Answer:</p>
                    <p className="ans-txt">{res.answer}</p>
                  </div>
                  <div className="history-feedback-box">
                    <p className="meta-lbl">Interviewer Feedback:</p>
                    <p className="feed-txt">{res.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
