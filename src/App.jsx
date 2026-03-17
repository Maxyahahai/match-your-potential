import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Quiz from './components/Quiz';
import Result from './components/Result';

const TOTAL_FRAMES = 53;

export default function App() {
  const canvasRef = useRef(null);
  const framesRef = useRef([]); // Ref for fast access without re-renders
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload frames gradually
  useEffect(() => {
    let isCancelled = false;
    let currentLoadIndex = 1;

    const loadNextFrame = () => {
      if (isCancelled) return;
      if (currentLoadIndex > TOTAL_FRAMES) {
        setIsLoaded(true);
        return;
      }
      
      const img = new window.Image();
      img.src = `/frames/frame (${currentLoadIndex}).jpg`;
      img.onload = () => {
        if (!isCancelled) {
          framesRef.current.push(img);
          setLoadedCount(prev => prev + 1);
          currentLoadIndex++;
          // Small delay to prevent blocking the main thread too much during load
          setTimeout(loadNextFrame, 10);
        }
      };
      img.onerror = () => {
        if (!isCancelled) {
            console.error(`Failed to load frame ${currentLoadIndex}`);
            currentLoadIndex++;
            setTimeout(loadNextFrame, 10);
        }
      };
    };

    loadNextFrame();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Animation Loop and Resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let frameIndex = 0;
    let animationFrameId;
    let lastTime = 0;
    const fpsInterval = 50; // ~20fps per frame
    
    // Handle Canvas resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawFrame = (time) => {
      animationFrameId = requestAnimationFrame(drawFrame);
      
      const elapsed = time - lastTime;
      if (elapsed > fpsInterval) {
        lastTime = time - (elapsed % fpsInterval);
        
        const frames = framesRef.current;
        if (frames.length === 0) return; // Nothing to draw yet
        
        const img = frames[frameIndex % frames.length];
        if (img && img.complete) {
           const { width, height } = canvas;
           const imgRatio = img.width / img.height;
           const canvasRatio = width / height;
           
           let drawWidth = width;
           let drawHeight = height;
           let offsetX = 0;
           let offsetY = 0;
           
           // Cover behavior
           if (imgRatio > canvasRatio) {
              drawWidth = height * imgRatio;
              offsetX = (width - drawWidth) / 2;
           } else {
              drawHeight = width / imgRatio;
              offsetY = (height - drawHeight) / 2;
           }
           
           ctx.clearRect(0, 0, width, height);
           ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
        
        // Loop through actually loaded frames rather than returning to 0 to provide a smooth loop mid-load
        frameIndex = (frameIndex + 1) % frames.length;
      }
    };

    animationFrameId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const [appState, setAppState] = useState('landing');
  const [finalScore, setFinalScore] = useState(0);

  const handleQuizComplete = (score) => {
    setFinalScore(score);
    setAppState('result');
  };

  const handleRetake = () => {
    setAppState('landing');
    setFinalScore(0);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
      {/* Canvas for Video replacement */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      
      {/* Dark Overlay for cinematic look and better text visibility */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 pointer-events-none" />

      {/* Main UI */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        
        <AnimatePresence mode="wait">
          {appState === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center space-y-12"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.2em] text-center uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] font-serif">
                Match<br/>Your<br/><span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-gray-600">Potential</span>
              </h1>
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAppState('quiz')}
                className="px-12 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white uppercase tracking-[0.3em] font-light text-sm md:text-base hover:border-white/50 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] rounded-sm cursor-pointer"
              >
                Start Quiz
              </motion.button>
            </motion.div>
          )}

          {appState === 'quiz' && (
            <motion.div 
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full flex justify-center"
            >
                <Quiz onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {appState === 'result' && (
             <Result key="result" score={finalScore} onRetake={handleRetake} />
          )}
        </AnimatePresence>

        {/* Loading Indicator */}
        <AnimatePresence>
          {!isLoaded && appState === 'landing' && (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-8 flex flex-col items-center space-y-2"
            >
              <div className="text-xs text-white/40 tracking-[0.3em] uppercase font-mono">
                Loading Experience {Math.round((loadedCount / TOTAL_FRAMES) * 100)}%
              </div>
              <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-white/40"
                  initial={{ width: 0 }}
                  animate={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
