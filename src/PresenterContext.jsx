import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PresenterContext = createContext(null);

const NARRATIONS = {
  hero: [
    "Hello, I'm Varnit. Welcome to my AI-powered portfolio.",
    "I am a software engineer and data scientist, specializing in building intelligent web platforms and machine learning pipelines."
  ],
  about: [
    "I am deeply passionate about technology, analytics, and building high-performance systems.",
    "With a strong foundation in computer science, my goal is to bridge the gap between complex data models and beautiful, minimal user experiences.",
    "Welcome to my digital space."
  ],
  skills: [
    "Here are my core technical skills.",
    "I specialize in Data Science and Machine Learning, Web Development, Cloud Computing, and Python engineering.",
    "I focus on creating systems that are both powerful and highly optimized."
  ],
  projects: [
    "I've built several full-stack applications and predictive data models.",
    "Let me show you a few featured projects where I solved real-world challenges with clean code and advanced analytics."
  ],
  datascience: [
    "As a data scientist, I believe that data is only as good as the insights we can extract from it.",
    "Here you can view my analytical dashboards, machine learning models, and interactive reports."
  ],
  contact: [
    "Let's connect and build the future together.",
    "Whether you're a recruiter, developer, or researcher, feel free to reach out, download my resume, or drop a message."
  ]
};

// Database of answers for Interactive AI Q&A
const QA_DATABASE = [
  {
    keywords: ["who", "varnit", "you"],
    answer: "I am Varnit, a passionate software engineer and data scientist who builds beautiful frontend interfaces and intelligent machine learning models."
  },
  {
    keywords: ["skills", "technologies", "code", "programming"],
    answer: "My core skills include Python, React, Three.js, machine learning, deep learning, SQL, Power BI, and cloud deployment."
  },
  {
    keywords: ["projects", "work", "portfolio"],
    answer: "I have built smart tools like Instasell, automated ML dashboards, interactive 3D visualizations, and predictive models."
  },
  {
    keywords: ["education", "college", "degree"],
    answer: "I have a solid background in Computer Science and Data Science, focusing on building scalable, data-driven applications."
  },
  {
    keywords: ["resume", "cv", "download"],
    answer: "You can download my updated resume directly from the Contact section at the bottom of the screen."
  },
  {
    keywords: ["contact", "email", "reach"],
    answer: "You can contact me by filling out the form in the Contact section, or via my LinkedIn profile."
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

  // Speech Recognition will be initialized lazily on user gesture

  // Handle TTS boundary events for word highlighting and Visemes (lip sync)
  const animateLips = (text) => {
    if (isMuted) {
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
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    if (visemeIntervalRef.current) {
      clearInterval(visemeIntervalRef.current);
    }

    if (isMuted) {
      setSubtitles(text);
      setIsPlaying(true);
      // Simulate speech reading with fallback timer if muted
      let duration = text.split(' ').length * 400; 
      animateLips(text);
      setTimeout(() => {
        setIsPlaying(false);
        setViseme('sil');
        if (callback) callback();
      }, duration);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Configure voice properties
    utterance.rate = playbackSpeed;
    utterance.lang = language;
    
    // Choose local offline voices if available, to prevent silent play on restricted networks
    const voices = synthRef.current.getVoices();
    const localVoice = voices.find(v => 
      v.localService && (v.name.includes('Natural') || v.name.includes('Microsoft') || v.name.includes('Google')) && v.lang.startsWith('en')
    ) || voices.find(v => v.localService && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en'));
    
    if (localVoice) {
      utterance.voice = localVoice;
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
      if (callback) callback();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setViseme('sil');
      setCurrentWordIndex(-1);
    };

    synthRef.current.speak(utterance);
  };

  const startNarrationForSection = (section, sentenceIdx = 0) => {
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
        setTimeout(() => {
          startNarrationForSection(section, sentenceIdx + 1);
        }, 600); // Natural pause between sentences
      }
    });
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (visemeIntervalRef.current) {
      clearInterval(visemeIntervalRef.current);
    }
    setIsPlaying(false);
    setViseme('sil');
    setCurrentWordIndex(-1);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (nextMute) {
      stopSpeaking();
    } else {
      // resume or replay current sentence
      const sentences = NARRATIONS[currentSection];
      if (sentences) {
        speakText(sentences[currentSentenceIndex]);
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
