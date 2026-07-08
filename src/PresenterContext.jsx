import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PresenterContext = createContext(null);

const NARRATIONS = {
  hero: [
    "Under Graduate Software Developer.",
    "Hi, I'm Varnit.",
    "B-tech Student at UU."
  ],
  about: [
    "About Me.",
    "I am currently pursuing a B.Tech in Computer Science Engineering at Uttaranchal University, Dehradun.",
    "I completed my 10th and 12th education in my hometown, Chhutmalpur, where I built a strong academic foundation and developed a keen interest in technology.",
    "I am a curious, dedicated, and enthusiastic learner who is always eager to explore new concepts and technologies.",
    "My goal is to continuously enhance my technical skills, apply my knowledge to solve real-world problems, and contribute meaningfully to the field of computer science.",
    "My interests include Web Development, Data Analytics, and AI Agents."
  ],
  skills: [
    "Technical Skill Set.",
    "In Development, I am advanced in HTML and CSS, JavaScript, and Python.",
    "In Data Analytics, I use Excel, Power B I, SQL, and Tableau.",
    "My additional skills include AI Agents using n 8 n, and Canva."
  ],
  projects: [
    "Featured Projects.",
    "First project is the AI-Powered Student Productivity Dashboard.",
    "A comprehensive SaaS platform built to integrate an AI chatbot, Study Hub, notes management, task scheduling, habit tracking, and a focus timer.",
    "Designed a responsive and interactive dashboard with personalized AI assistance to help students organize their studies and improve learning efficiency.",
    "Second project is the AI Career Analyzer.",
    "An intelligent tool that evaluates users' skills, resumes, and career goals to provide personalized career recommendations and custom learning roadmaps."
  ],
  contact: [
    "Contact Me.",
    "You can reach me at varnit kamboj zero six at gmail dot com, or call me at 9 4 5 7 0 7 2 4 1 8.",
    "Feel free to connect with me on Instagram, LinkedIn, and Github, or send me a message directly from the website."
  ]
};

// Database of answers for Interactive AI Q&A
const QA_DATABASE = [
  {
    keywords: ["who", "varnit", "you", "about"],
    answer: "I am Varnit, an undergraduate B.Tech student at Uttaranchal University, passionate about Web Development, Data Analytics, and AI Agents."
  },
  {
    keywords: ["skills", "technologies", "code", "programming", "development"],
    answer: "My development skills include HTML, CSS, JavaScript, and Python. For data analytics, I use Excel, Power BI, SQL, and Tableau. I'm also skilled in building AI Agents using n8n."
  },
  {
    keywords: ["projects", "work", "portfolio", "build"],
    answer: "My featured projects include an AI-Powered Student Productivity Dashboard (a comprehensive SaaS platform) and an AI Career Analyzer."
  },
  {
    keywords: ["education", "college", "degree", "school"],
    answer: "I am currently pursuing a B.Tech in Computer Science Engineering at Uttaranchal University, Dehradun. I completed my schooling at Dellmond International School."
  },
  {
    keywords: ["resume", "cv", "download"],
    answer: "You can download my updated resume directly from the Contact section at the bottom of the screen."
  },
  {
    keywords: ["contact", "email", "reach", "phone"],
    answer: "You can reach me at varnitkamboj06@gmail.com or call me at 9457072418. You can also send me a message directly from the Contact form!"
  }
];

export const PresenterProvider = ({ children }) => {
  const [currentSection, setCurrentSection] = useState('hero');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [language, setLanguage] = useState('en-US');
  const [subtitles, setSubtitles] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [viseme, setViseme] = useState('sil'); // sil, open, narrow, dental, etc.
  const [qaAnswer, setQaAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [chatLog, setChatLog] = useState([]);

  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const recognitionRef = useRef(null);
  const visemeIntervalRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const muteTimeoutRef = useRef(null);
  const isMutedRef = useRef(true);
  const isCancelledRef = useRef(false);

  // Speech Recognition will be initialized lazily on user gesture

  // Handle TTS boundary events for word highlighting and Visemes (lip sync)
  const animateLips = (text) => {
    if (isMutedRef.current) {
      setViseme('sil');
      return;
    }

    if (visemeIntervalRef.current) clearInterval(visemeIntervalRef.current);

    let charIdx = 0;
    visemeIntervalRef.current = setInterval(() => {
      if (charIdx >= text.length) {
        setViseme('sil');
        clearInterval(visemeIntervalRef.current);
        return;
      }

      const char = text[charIdx].toLowerCase();
      charIdx++;

      // Approximate standard viseme mappings based on spoken characters
      if (['a', 'e', 'i', 'o', 'u'].includes(char)) {
        setViseme('open'); // open mouth
      } else if (['o', 'w'].includes(char)) {
        setViseme('narrow'); // round lips
      } else if (['m', 'p', 'b'].includes(char)) {
        setViseme('sil'); // closed lips
      } else if (['f', 'v'].includes(char)) {
        setViseme('dental'); // labiodental teeth to lip
      } else {
        setViseme('mid'); // neutral slightly open
      }
    }, 60); // fast switching to simulate speech
  };

  const speakText = (text, callback = null) => {
    isCancelledRef.current = true; // Mark previous utterance as cancelled

    if (synthRef.current) {
      synthRef.current.cancel();
    }

    if (visemeIntervalRef.current) {
      clearInterval(visemeIntervalRef.current);
    }
    
    if (muteTimeoutRef.current) {
      clearTimeout(muteTimeoutRef.current);
    }

    isCancelledRef.current = false; // Reset for new utterance

    if (isMutedRef.current) {
      setSubtitles(text);
      setIsPlaying(true);
      // Simulate speech reading with fallback timer if muted
      let duration = text.split(' ').length * 400; 
      animateLips(text);
      muteTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
        setViseme('sil');
        if (!isCancelledRef.current && callback) {
          callback();
        }
      }, duration);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Configure voice properties
    utterance.rate = playbackSpeed; // Default speed
    utterance.lang = 'en-IN'; // Prefer Indian English to match the accent in the audio sample
    utterance.pitch = 1.1; // Slightly higher pitch for a younger male voice
    
    // Get available voices
    const voices = synthRef.current.getVoices();
    
    // Try to find a male Indian English voice first, then UK/US male voices
    const bestVoice = voices.find(v => 
      (v.name.includes('Ravi') || v.name.includes('Indian') || v.lang === 'en-IN') && v.name.toLowerCase().includes('male')
    ) || voices.find(v => 
      (v.lang === 'en-IN' || v.name.includes('Ravi'))
    ) || voices.find(v => 
      (v.name.includes('Google UK English Male') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('Male')) && v.lang.startsWith('en')
    ) || voices.find(v => 
      v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
    ) || voices[0];
    
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    setSubtitles(text);
    setIsPlaying(true);
    setCurrentWordIndex(-1);

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const words = text.slice(event.charIndex).split(/\s+/);
        const spokenWord = words[0];
        // Calculate index of word
        const fullWordsList = text.substring(0, event.charIndex + spokenWord.length).trim().split(/\s+/);
        setCurrentWordIndex(fullWordsList.length - 1);
        animateLips(spokenWord);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setViseme('sil');
      setCurrentWordIndex(-1);
      if (!isCancelledRef.current && callback) {
        callback();
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setViseme('sil');
      setCurrentWordIndex(-1);
    };

    // Web Speech API bug fix: wait briefly after cancel() before speaking
    setTimeout(() => {
      synthRef.current.speak(utterance);
    }, 50);
  };

  const startNarrationForSection = (section, sentenceIdx = 0) => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    setCurrentSection(section);
    setCurrentSentenceIndex(sentenceIdx);
    const sentences = NARRATIONS[section];

    if (!sentences || sentenceIdx >= sentences.length) {
      setIsPlaying(false);
      return;
    }

    speakText(sentences[sentenceIdx], () => {
      // Auto-advance to next sentence in section
      if (sentenceIdx + 1 < sentences.length) {
        speechTimeoutRef.current = setTimeout(() => {
          startNarrationForSection(section, sentenceIdx + 1);
        }, 600); // Natural pause between sentences
      } else {
        // Mark as finished by updating index
        setCurrentSentenceIndex(sentenceIdx + 1);
        
        // Auto-advance to the next section
        const sections = Object.keys(NARRATIONS);
        const currentIdx = sections.indexOf(section);
        if (currentIdx !== -1 && currentIdx + 1 < sections.length) {
          const nextSection = sections[currentIdx + 1];
          speechTimeoutRef.current = setTimeout(() => {
            startNarrationForSection(nextSection, 0);
          }, 1200); // Slightly longer pause between different sections
        } else {
           setIsPlaying(false);
           setViseme('sil');
        }
      }
    });
  };

  const stopSpeaking = () => {
    isCancelledRef.current = true; // Prevent any pending callbacks from firing
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    if (muteTimeoutRef.current) {
      clearTimeout(muteTimeoutRef.current);
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (visemeIntervalRef.current) {
      clearInterval(visemeIntervalRef.current);
    }
    setIsPlaying(false);
    setViseme('sil');
    setCurrentWordIndex(-1);
    setSubtitles(''); // Clear subtitles so it doesn't look like it's speaking
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    isMutedRef.current = nextMute;
    if (nextMute) {
      stopSpeaking();
    } else {
      // resume or replay current section
      const sentences = NARRATIONS[currentSection];
      if (sentences && currentSentenceIndex >= sentences.length) {
        startNarrationForSection(currentSection, 0);
      } else {
        startNarrationForSection(currentSection, currentSentenceIndex);
      }
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = language;

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event) => {
          const text = event.results[0][0].transcript;
          handleUserQuery(text);
        };

        rec.onerror = (e) => {
          console.error("Speech Recognition Error:", e);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition already active", e);
      }
    } else {
      alert("Speech recognition is not supported in this browser. Try Google Chrome or Edge.");
    }
  };

  const handleUserQuery = (query) => {
    if (!query.trim()) return;

    setChatLog(prev => [...prev, { sender: 'user', text: query }]);
    
    // Find closest match in QA DB
    const searchTerms = query.toLowerCase().split(/\s+/);
    let bestMatch = null;
    let maxMatches = 0;

    QA_DATABASE.forEach(item => {
      let matches = 0;
      item.keywords.forEach(kw => {
        if (searchTerms.some(term => term.includes(kw) || kw.includes(term))) {
          matches++;
        }
      });

      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = item;
      }
    });

    const reply = bestMatch 
      ? bestMatch.answer 
      : "I am not sure I understand that question. Try asking about my skills, projects, resume, or contact info!";

    setChatLog(prev => [...prev, { sender: 'ai', text: reply }]);
    
    // Narrative answer with avatar
    speakText(reply);
  };

  // Keep voices loaded
  useEffect(() => {
    const loadVoices = () => {
      if (synthRef.current) {
        synthRef.current.getVoices();
      }
    };
    loadVoices();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  return (
    <PresenterContext.Provider value={{
      currentSection,
      isPlaying,
      isMuted,
      playbackSpeed,
      setPlaybackSpeed,
      language,
      setLanguage,
      subtitles,
      currentWordIndex,
      currentSentenceIndex,
      viseme,
      isListening,
      chatLog,
      setChatLog,
      isInitialized,
      setIsInitialized,
      startNarrationForSection,
      stopSpeaking,
      toggleMute,
      startListening,
      handleUserQuery,
      speakText
    }}>
      {children}
    </PresenterContext.Provider>
  );
};

export const usePresenter = () => {
  const context = useContext(PresenterContext);
  if (!context) {
    throw new Error('usePresenter must be used within a PresenterProvider');
  }
  return context;
};
