import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function Result({ score, onRetake }) {
  const maxScore = 160;
  const percentage = Math.round((score / maxScore) * 100);

  // Animated Number
  const scoreSpring = useSpring(0, { stiffness: 50, damping: 20, duration: 2000 });
  const displayScore = useTransform(scoreSpring, (current) => Math.round(current));

  useEffect(() => {
    scoreSpring.set(percentage);
  }, [percentage, scoreSpring]);

  // Determine Tier
  const getTierInfo = () => {
    if (percentage >= 90) return { title: "Elite", desc: "Rare mindset. You demand perfection and suffer no excuses." };
    if (percentage >= 70) return { title: "Strong Potential", desc: "Keep sharpening. The foundation is there, but the edge needs honing." };
    if (percentage >= 50) return { title: "You're Rising", desc: "Discipline will define you. You have flashes of strength but lack consistency." };
    return { title: "Untapped Potential", desc: "Time to build. You are far from your limits." };
  };

  const tier = getTierInfo();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-2xl flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-6">
        <h2 className="text-white/40 uppercase tracking-[0.3em] text-sm font-sans mb-2">
          Assessment Complete
        </h2>
        <div className="w-16 h-[1px] bg-white/20 mx-auto" />
      </div>

      <div className="relative mb-8 group">
        <motion.div 
          className="absolute -inset-4 bg-white/5 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" 
        />
        <div className="relative flex items-end justify-center">
            <motion.h1 
            className="text-8xl md:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
            {displayScore}
            </motion.h1>
            <span className="text-3xl md:text-4xl text-white/40 font-serif mb-4 ml-2">%</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mb-12"
      >
        <h3 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest mb-4">
          {tier.title}
        </h3>
        <p className="text-white/60 font-sans font-light tracking-wide text-lg max-w-lg mx-auto leading-relaxed">
          "{tier.desc}"
        </p>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetake}
        className="px-8 py-3 bg-transparent border border-white/20 text-white/80 hover:text-white uppercase tracking-[0.2em] font-light text-xs transition-all duration-300 rounded-sm cursor-pointer"
      >
        Initiate Re-test
      </motion.button>
    </motion.div>
  );
}
