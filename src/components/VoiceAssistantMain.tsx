import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceAssistantMain: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const startVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      if (transcript.includes('go to dashboard') || transcript.includes('dashboard')) {
        navigate('/dashboard');
      } else if (transcript.includes('go to event hub') || transcript.includes('event hub')) {
        navigate('/event-hub');
      } else if (transcript.includes('go to aura safety engine') || transcript.includes('aura safety engine') || transcript.includes('safety engine')) {
        navigate('/aura-safety-engine');
      } else if (transcript.includes('go to operations') || transcript.includes('operations')) {
        navigate('/operations');
      } else if (transcript.includes('go to analytics') || transcript.includes('analytics')) {
        navigate('/analytics');
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700"
    >
      <motion.div
        animate={isListening ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
        className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
          isListening ? 'bg-red-500' : 'bg-indigo-600'
        }`}
      >
        <Mic className="w-12 h-12 text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {isListening ? 'Listening...' : 'Voice Assistant Ready'}
      </h2>
      <p className="text-slate-400 mb-6">
        {isListening ? 'Say your command now' : 'Say "Hey VocaLinc" or click to start'}
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startVoiceCommand}
        className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
          isListening 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white`}
      >
        <Play className="w-5 h-5" />
        <span>{isListening ? 'Listening...' : 'Start Voice Command'}</span>
      </motion.button>
    </motion.div>
  );
};

export default VoiceAssistantMain;