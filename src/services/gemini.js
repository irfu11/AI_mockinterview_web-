/* src/services/gemini.js */
import { GoogleGenAI } from '@google/genai';

// Local Predefined Question Bank for Offline/Demo Mode
export const LOCAL_QUESTION_BANK = {
  "web-development": {
    "junior": [
      { id: 1, text: "Explain the difference between 'let', 'const', and 'var' in JavaScript." },
      { id: 2, text: "What is the CSS Box Model and what are its components?" },
      { id: 3, text: "How does client-side rendering (CSR) differ from server-side rendering (SSR)?" },
      { id: 4, text: "What are HTML semantic elements and why are they recommended?" },
      { id: 5, text: "Explain what a REST API is and name three common HTTP methods." }
    ],
    "mid-level": [
      { id: 1, text: "Explain the concept of closures in JavaScript and provide a practical use case." },
      { id: 2, text: "How does React's Virtual DOM optimize rendering updates?" },
      { id: 3, text: "What is Cross-Origin Resource Sharing (CORS), and how do you resolve CORS errors?" },
      { id: 4, text: "Describe the differences between relational (SQL) and non-relational (NoSQL) databases." },
      { id: 5, text: "What strategies would you use to optimize the loading speed of a media-heavy website?" }
    ],
    "senior": [
      { id: 1, text: "Explain micro-frontend architecture and how state management is handled across separate apps." },
      { id: 2, text: "How would you design a highly scalable real-time chat application using WebSockets?" },
      { id: 3, text: "Explain React's concurrent rendering model and how the fiber architecture works under the hood." },
      { id: 4, text: "Detail the specific measures you would take to secure a web app from XSS, CSRF, and SQL Injection." },
      { id: 5, text: "Describe your strategy for state management, data caching, and synchronization in a large-scale React app." }
    ]
  },
  "data-science": {
    "junior": [
      { id: 1, text: "What is the difference between supervised and unsupervised machine learning?" },
      { id: 2, text: "Explain what overfitting is and how it can be prevented." },
      { id: 3, text: "What is the role of activation functions in a neural network?" },
      { id: 4, text: "Describe the difference between L1 (Lasso) and L2 (Ridge) regularization." },
      { id: 5, text: "What is a confusion matrix, and how do you calculate Precision and Recall?" }
    ],
    "mid-level": [
      { id: 1, text: "Explain the Bias-Variance tradeoff and how it impacts model evaluation." },
      { id: 2, text: "How does the Random Forest algorithm work, and why is it called an ensemble method?" },
      { id: 3, text: "What are the common methods for handling missing or highly skewed data in a dataset?" },
      { id: 4, text: "Explain how gradient descent works. What is the role of the learning rate?" },
      { id: 5, text: "How does Principal Component Analysis (PCA) reduce dimensionality, and when should you use it?" }
    ],
    "senior": [
      { id: 1, text: "How do transformer architectures (like GPT or BERT) differ from recurrent neural networks (RNNs)?" },
      { id: 2, text: "Describe how you would design and deploy a machine learning model pipeline to serve low-latency real-time predictions." },
      { id: 3, text: "Explain the mathematical formulation of Support Vector Machines (SVM) and the kernel trick." },
      { id: 4, text: "How would you design an A/B test for a recommendation algorithm to ensure statistically significant results?" },
      { id: 5, text: "Explain the concepts of gradient vanishing and exploding in deep networks, and how modern architectures solve them." }
    ]
  },
  "data-analytics": {
    "junior": [
      { id: 1, text: "What is the difference between INNER JOIN, LEFT JOIN, and RIGHT JOIN in SQL?" },
      { id: 2, text: "How do you distinguish between qualitative (categorical) and quantitative (numerical) data?" },
      { id: 3, text: "What is a Pivot Table in Excel or pandas, and what is it used for?" },
      { id: 4, text: "Explain the concept of standard deviation and why it is important in data analysis." },
      { id: 5, text: "What is the difference between data cleaning and data profiling?" }
    ],
    "mid-level": [
      { id: 1, text: "What are window functions in SQL, and when would you use ROW_NUMBER() vs RANK()?" },
      { id: 2, text: "Explain correlation vs causation and give an example of a confounding variable." },
      { id: 3, text: "Describe the difference between descriptive, predictive, and prescriptive analytics." },
      { id: 4, text: "How would you approach creating a key performance indicator (KPI) dashboard for an e-commerce executive?" },
      { id: 5, text: "What is Central Limit Theorem, and why is it foundational to hypothesis testing?" }
    ],
    "senior": [
      { id: 1, text: "Describe how you would design a data warehouse schema (e.g. Star vs Snowflake) for a retail chain." },
      { id: 2, text: "Explain how you optimize slow-running SQL queries operating on billions of records." },
      { id: 3, text: "Describe how you would set up data governance and ensure data quality across a multi-source ETL pipeline." },
      { id: 4, text: "How do you handle statistical anomalies, data leakage, and selection bias in business intelligence reports?" },
      { id: 5, text: "Detail how you would use cohort analysis to identify why user retention is dropping in a SaaS application." }
    ]
  },
  "cybersecurity": {
    "junior": [
      { id: 1, text: "What is the difference between symmetric and asymmetric encryption?" },
      { id: 2, text: "Explain what a firewall is and the difference between stateful and stateless firewalls." },
      { id: 3, text: "What is phishing, and what are the common indicators of a phishing email?" },
      { id: 4, text: "Describe the concept of 'Least Privilege' in access control." },
      { id: 5, text: "What is the purpose of a VPN, and how does it secure internet traffic?" }
    ],
    "mid-level": [
      { id: 1, text: "Explain how a Man-in-the-Middle (MitM) attack occurs and how HTTPS mitigates it." },
      { id: 2, text: "What is the OWASP Top 10, and can you explain how a SQL Injection (SQLi) works?" },
      { id: 3, text: "Describe the difference between vulnerability scanning, penetration testing, and red teaming." },
      { id: 4, text: "How does multi-factor authentication (MFA) work, and what are the security risks of SMS-based MFA?" },
      { id: 5, text: "Explain what a SIEM system is and how it helps in security incident detection." }
    ],
    "senior": [
      { id: 1, text: "Describe how you would architect a Zero Trust Network Architecture for an enterprise with remote staff." },
      { id: 2, text: "How would you respond to a live ransomware outbreak within a corporate network? Walk through your incident response steps." },
      { id: 3, text: "Explain how OAuth 2.0 works under the hood and what vulnerabilities exist if it is misconfigured." },
      { id: 4, text: "Describe the mechanics of a buffer overflow attack and how modern OS-level protections (like ASLR and DEP) prevent it." },
      { id: 5, text: "How do you establish a secure software development lifecycle (SSDLC) in a large dev team using automated DevSecOps pipelines?" }
    ]
  }
};

/**
 * Initialize the Gemini client if an API key is provided.
 */
function getGeminiClient(apiKey) {
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error("Error initializing Gemini API:", error);
    return null;
  }
}

/**
 * Helper to clean Markdown json blocks from model responses
 */
function cleanJSONString(str) {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

/**
 * Generate 5 questions for a given domain and difficulty.
 */
export async function generateQuestions(domain, difficulty, apiKey) {
  const ai = getGeminiClient(apiKey);
  
  if (!ai) {
    // Return mock questions if no API key is provided
    console.log("No API Key or failed init. Loading local questions...");
    const domainKey = domain.toLowerCase().replace(" ", "-");
    const diffKey = difficulty.toLowerCase();
    
    const bank = LOCAL_QUESTION_BANK[domainKey] || LOCAL_QUESTION_BANK["web-development"];
    return bank[diffKey] || bank["junior"];
  }

  const prompt = `You are a Senior Technical Recruiter and Engineer.
Generate exactly 5 technical interview questions for a candidate interviewing for a ${difficulty} level position in the field of ${domain}.
The questions must range from fundamental concepts (question 1-2) to practical scenarios (question 3-4) and one challenging/advanced question (question 5).
Provide the response strictly as a JSON array of objects. Do not write any markdown code blocks, intro, or outro text. Return only the raw JSON.

JSON Structure:
[
  { "id": 1, "text": "Question text here..." },
  { "id": 2, "text": "Question text here..." },
  { "id": 3, "text": "Question text here..." },
  { "id": 4, "text": "Question text here..." },
  { "id": 5, "text": "Question text here..." }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    
    const text = cleanJSONString(response.text);
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API generateQuestions failed, falling back to local questions:", error);
    const domainKey = domain.toLowerCase().replace(" ", "-");
    const diffKey = difficulty.toLowerCase();
    const bank = LOCAL_QUESTION_BANK[domainKey] || LOCAL_QUESTION_BANK["web-development"];
    return bank[diffKey] || bank["junior"];
  }
}

/**
 * Evaluate the candidate's answer to a single question.
 */
export async function evaluateAnswer(question, answer, domain, apiKey) {
  const ai = getGeminiClient(apiKey);

  if (!ai) {
    // Run local evaluation (Mock grader)
    return runLocalEvaluation(question, answer, domain);
  }

  const prompt = `You are a Senior Technical Interviewer. Evaluate the candidate's answer to the technical question below in the context of the "${domain}" domain.

Question: ${question}
Candidate's Answer: ${answer}

Instructions:
1. Determine if the answer is relevant. If the answer is completely off-topic, gibberish, an attempt to bypass the question, or just saying "I don't know", mark relevance as false, set the score to 0 or 1, and give constructive feedback explaining why the answer is not acceptable.
2. If it is relevant, grade the answer on a scale from 0 to 10 (decimals allowed e.g. 7.5). A score of 10 should be given only for a highly accurate, comprehensive, and clear explanation.
3. Provide concise, direct feedback outlining what was good, what was missing, and how to improve. Keep it professional and encouraging but honest.
4. Provide a sample model answer that would receive a perfect 10/10 score.

Response must be strictly in the following JSON format without any markdown wrapper (no \`\`\`json blocks), just the raw JSON text:
{
  "relevance": true,
  "score": 7.5,
  "feedback": "Your explanation of... was good. However, you missed mentioning...",
  "sampleAnswer": "A perfect response would explain that..."
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    
    const text = cleanJSONString(response.text);
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API evaluation failed, using local evaluator:", error);
    return runLocalEvaluation(question, answer, domain);
  }
}

/**
 * Local heuristic answer evaluation for Offline/Demo Mode.
 */
function runLocalEvaluation(question, answer, domain) {
  const ansNormalized = (answer || "").trim().toLowerCase();
  
  // 1. Check for blank or ultra short answers
  if (ansNormalized.length < 10) {
    return {
      relevance: false,
      score: 1,
      feedback: "Your answer is too short or empty. Please provide a detailed response explaining the concept.",
      sampleAnswer: "A comprehensive answer should define the core terms, explain how they operate, and provide a real-world example in the context of " + domain + "."
    };
  }

  // 2. Check for evasion keywords
  const bypassKeywords = ["don't know", "dont know", "no idea", "skip", "pass", "pizza", "burger", "hello world", "test answer", "blah"];
  const isEvading = bypassKeywords.some(keyword => ansNormalized === keyword || ansNormalized.includes("i " + keyword) || (ansNormalized.length < 25 && ansNormalized.includes(keyword)));
  
  if (isEvading) {
    return {
      relevance: false,
      score: 1,
      feedback: "The answer provided is unrelated to the question or indicates a lack of attempt. Please answer the technical question directly.",
      sampleAnswer: "To get a high score, explain the key principles of the asked topic and their implications in " + domain + "."
    };
  }

  // 3. Simple keyword matcher based on question keywords
  const questionWords = question.toLowerCase()
    .replace(/[?,.:;()'"]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 4); // Filter out short words (the, of, and, etc.)
  
  let matches = 0;
  questionWords.forEach(word => {
    if (ansNormalized.includes(word)) matches++;
  });

  const matchRatio = questionWords.length > 0 ? matches / questionWords.length : 0;
  
  // Base score on answer length and basic keyword overlap
  let baseScore = 5.0;
  
  // Length contribution
  if (ansNormalized.length > 150) baseScore += 1.5;
  else if (ansNormalized.length > 80) baseScore += 0.8;
  else if (ansNormalized.length < 30) baseScore -= 1.5;

  // Overlap contribution
  if (matchRatio > 0.4) baseScore += 2.0;
  else if (matchRatio > 0.1) baseScore += 1.0;
  else baseScore -= 1.0; // low correlation with question words

  // Cap score between 2 and 9 for local heuristic evaluation
  let score = Math.max(2, Math.min(9.5, baseScore));
  // Round to 1 decimal place
  score = Math.round(score * 10) / 10;

  // Check relevance
  const relevance = matchRatio > 0.05 || ansNormalized.length > 60;

  let feedback = "";
  if (score >= 8.0) {
    feedback = "Excellent effort! You demonstrated a strong conceptual understanding of the topic with key terms aligned with the question. To make it perfect, consider detailing specific syntax or implementation nuances.";
  } else if (score >= 6.0) {
    feedback = "Good response, showing a basic grasp of the question. You mentioned key concepts, but the explanation could be more comprehensive. Expand on the 'why' and 'how' to achieve a higher score.";
  } else {
    feedback = "Your answer touched on the domain but lacked depth or key technical details requested by the prompt. Be sure to address each part of the question explicitly.";
  }

  return {
    relevance,
    score,
    feedback,
    sampleAnswer: `[Demo Mode Model Answer] A thorough answer would clearly explain all aspects of "${question.substring(0, 45)}...", linking its application to standard practices in ${domain}.`
  };
}

/**
 * Validate an API key by listing models.
 */
export async function validateAPIKey(apiKey) {
  if (!apiKey) return false;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Respond with the word 'OK' only."
    });
    return response.text.trim().toLowerCase().includes('ok');
  } catch (error) {
    console.error("API Key validation failed:", error);
    return false;
  }
}
