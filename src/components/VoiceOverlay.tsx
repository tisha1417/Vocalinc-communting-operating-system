import React, { useState, useEffect } from 'react';
import { Shield, Mic, MicOff } from 'lucide-react';

interface VoiceOverlayProps {
  onResponse: (needsHelp: boolean) => void;
}

export const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ onResponse }) => {
  const [isListening, setIsListening] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  const speakQuestion = () => {
    if ('speechSynthesis' in window && !hasSpoken) {
      const utterance = new SpeechSynthesisUtterance('Do you need a guardian angel?');
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
      setHasSpoken(true);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (transcript.includes('yes') || transcript.includes('help') || transcript.includes('emergency')) {
          onResponse(true);
        } else if (transcript.includes('no') || transcript.includes('fine') || transcript.includes('okay')) {
          onResponse(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion();
      startListening();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="relative w-full max-w-md mx-4">
        {/* Glassmorphism Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white border-opacity-20">
          {/* Guardian Angel Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-bold text-white text-center mb-8 leading-tight">
            Do you need a guardian angel?
          </h2>

          {/* Voice Recognition Indicator */}
          <div className="flex justify-center mb-8">
            <button
              onClick={startListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 bg-opacity-80 animate-pulse shadow-lg shadow-red-500/50' 
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 text-white" />
              ) : (
                <MicOff className="w-8 h-8 text-white" />
              )}
            </button>
          </div>

          {/* Manual Response Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => onResponse(true)}
              className="flex-1 bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              Yes, I need help
            </button>
            <button
              onClick={() => onResponse(false)}
              className="flex-1 bg-teal-500 bg-opacity-80 hover:bg-opacity-100 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              No, I'm fine
            </button>
          </div>

          {/* Voice Instructions */}
          <p className="text-white text-opacity-70 text-sm text-center mt-4">
            {isListening ? 'Listening for your response...' : 'Click the microphone or use the buttons above'}
          </p>
        </div>
      </div>
    </div>
  );
};