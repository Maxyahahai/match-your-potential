import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quizData = [
  {
    category: "Physical Strength",
    question: "When faced with physical exhaustion, what is your immediate response?",
    options: [
      { text: "I stop entirely. My limit has been reached.", score: 10 },
      { text: "I take a long break and consider continuing.", score: 20 },
      { text: "I push through for a few more minutes.", score: 30 },
      { text: "I embrace the pain. The real work begins now.", score: 40 }
    ]
  },
  {
    category: "Discipline",
    question: "Your alarm goes off at 4:30 AM for a critical training session. It’s freezing outside.",
    options: [
      { text: "I hit snooze. Sleep is more important today.", score: 10 },
      { text: "I negotiate with myself to go later.", score: 20 },
      { text: "I get up slowly and eventually make it out.", score: 30 },
      { text: "I am up instantly. The mission demands it.", score: 40 }
    ]
  },
  {
    category: "Mental Toughness",
    question: "You fail a critical objective that impacts others. How do you process this?",
    options: [
      { text: "I blame external circumstances.", score: 10 },
      { text: "I feel defeated and withdraw from the team.", score: 20 },
      { text: "I analyze the failure but struggle to move on.", score: 30 },
      { text: "I take absolute ownership, adapt, and return stronger.", score: 40 }
    ]
  },
  {
    category: "Empathy",
    question: "A teammate is struggling to keep up and slowing the group down.",
    options: [
      { text: "I leave them behind; they must keep up.", score: 10 },
      { text: "I complain to leadership about their performance.", score: 20 },
      { text: "I wait for them but show frustration.", score: 30 },
      { text: "I carry their load and guide them forward.", score: 40 }
    ]
  }
];

export default function Quiz({ onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = [0, 0]; // Will implement state shortly
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState(1);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOptionClick = (optionScore) => {
    const newScore = score + optionScore;
    
    // Add a slight delay for visual feedback before proceeding
    setTimeout(() => {
        if (currentIndex < quizData.length - 1) {
            setDirection(1);
            setScore(newScore);
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete(newScore);
        }
    }, 400); 
  };

  const currentQ = quizData[currentIndex];

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 50 : -50,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 50 : -50,
        opacity: 0
      };
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center justify-center p-6 relative min-h-[500px]">
      
      <div className="mb-12 w-full flex justify-between items-end border-b border-white/20 pb-4">
        <h2 className="text-white/60 uppercase tracking-[0.2em] text-sm font-sans">
          {currentQ.category}
        </h2>
        <div className="text-white/40 uppercase tracking-[0.2em] text-xs font-mono">
          Phase {currentIndex + 1} // {quizData.length}
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 }
          }}
          className="w-full flex flex-col items-center"
        >
          <h3 className="text-2xl md:text-3xl font-serif text-white text-center mb-12 leading-relaxed tracking-wide drop-shadow-md">
            "{currentQ.question}"
          </h3>

          <div className="w-full flex flex-col space-y-4">
            {currentQ.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionClick(option.score)}
                className="w-full text-left p-6 bg-white/5 backdrop-blur-sm border border-white/10 text-white/90 hover:text-white transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-sm cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-white/30 font-mono text-sm uppercase group-hover:text-white/70 transition-colors">
                    [{String.fromCharCode(65 + idx)}]
                  </span>
                  <span className="font-sans font-light tracking-wide text-sm md:text-base">
                    {option.text}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
