import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff } from "lucide-react";
import { motion } from "framer-motion";

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSupported(
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window
    );
  }, []);

  const startListening = () => {
    if (!isSupported) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Voice command:", transcript);

      // Navigation commands
      if (
        transcript.includes("go to dashboard") ||
        transcript.includes("dashboard")
      ) {
        navigate("/dashboard");
      } else if (
        transcript.includes("go to event hub") ||
        transcript.includes("event hub")
      ) {
        navigate("/event-hub");
      } else if (
        transcript.includes("go to aura safety engine") ||
        transcript.includes("aura safety engine") ||
        transcript.includes("safety engine")
      ) {
        navigate("/aura-safety-engine");
      } else if (
        transcript.includes("go to operations") ||
        transcript.includes("operations")
      ) {
        navigate("/operations");
      } else if (
        transcript.includes("go to analytics") ||
        transcript.includes("analytics")
      ) {
        navigate("/analytics");
      } else {
        console.log("Command not recognized:", transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="bg-slate-700 rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-white font-medium">Voice Assistant</span>
      </div>

      <p className="text-slate-400 text-sm mb-4">
        Ready to assist
        <br />
        Say "Hey VocaLinc"
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startListening}
        disabled={!isSupported}
        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isListening
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
        <span>{isListening ? "Listening..." : "Start Voice Command"}</span>
      </motion.button>
    </div>
  );
};

export default VoiceAssistant;
