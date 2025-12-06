import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import useGameStore from '../store/useGameStore';

const Level1SignalHunter = () => {
  const { signals, setSignals, processSignal, addXP, updateAccuracy, processedSignals } = useGameStore();
  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // Fetch signals from backend
  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/signals');
      const data = await response.json();
      setSignals(data);
    } catch (error) {
      console.error('Error fetching signals:', error);
      // Fallback to mock data if backend not available
      setSignals(getMockSignals());
    }
  };

  const getMockSignals = () => [
    {
      id: 1,
      title: 'Major Tech Company Announces AI Partnership',
      description: 'A leading technology company partners with an AI research lab to develop new machine learning models.',
      source: 'TechNews',
      date: '2025-01-15',
      category: 'Technology',
      isSignal: true,
      cipherCategory: 'Practice'
    },
    {
      id: 2,
      title: 'Celebrity Launches New Perfume Line',
      description: 'Popular celebrity announces limited edition perfume collection.',
      source: 'Entertainment Weekly',
      date: '2025-01-14',
      category: 'Entertainment',
      isSignal: false,
      cipherCategory: null
    },
    {
      id: 3,
      title: 'Quantum Computing Breakthrough at Research Lab',
      description: 'Scientists achieve room-temperature quantum coherence for 10 seconds, 100x improvement over previous records.',
      source: 'Science Journal',
      date: '2025-01-13',
      category: 'Technology',
      isSignal: true,
      cipherCategory: 'Inflection'
    },
    {
      id: 4,
      title: 'Local Restaurant Wins Award',
      description: 'Small family-owned restaurant receives regional culinary award.',
      source: 'Local News',
      date: '2025-01-12',
      category: 'Food',
      isSignal: false,
      cipherCategory: null
    },
    {
      id: 5,
      title: 'Multiple Countries Ban Single-Use Plastics',
      description: 'Five G20 nations simultaneously announce comprehensive bans on single-use plastics by 2026.',
      source: 'Global Policy News',
      date: '2025-01-11',
      category: 'Environment',
      isSignal: true,
      cipherCategory: 'Practice'
    }
  ];

  const currentSignal = signals[currentSignalIndex];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleSwipe = (direction) => {
    if (!currentSignal) return;

    const isSignal = direction === 'right';
    const isCorrect = isSignal === currentSignal.isSignal;

    // Process the signal
    processSignal(currentSignal, { isSignal, isCorrect });

    // Show feedback
    setFeedback({
      isCorrect,
      message: isCorrect
        ? `Correct! ${currentSignal.isSignal ? `This is a ${currentSignal.cipherCategory} signal.` : 'This is just noise.'}`
        : `Wrong! This was ${currentSignal.isSignal ? `a signal (${currentSignal.cipherCategory})` : 'noise'}.`
    });

    // Add XP if correct
    if (isCorrect) {
      addXP(10);
    }

    // Update accuracy
    const totalProcessed = processedSignals.length + 1;
    const correctCount = processedSignals.filter(s => s.userChoice.isCorrect).length + (isCorrect ? 1 : 0);
    updateAccuracy((correctCount / totalProcessed) * 100);

    // Move to next signal
    setTimeout(() => {
      setCurrentSignalIndex(prev => prev + 1);
      setFeedback(null);
      x.set(0);
    }, 1500);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
      handleSwipe('left');
    } else {
      x.set(0);
    }
  };

  if (!currentSignal) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Level 1 Complete!</h2>
          <p className="text-xl text-gray-400 mb-8">
            You've processed all signals. Accuracy: {processedSignals.length > 0
              ? ((processedSignals.filter(s => s.userChoice.isCorrect).length / processedSignals.length) * 100).toFixed(1)
              : 0}%
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-brilliant-blue rounded-lg hover:bg-blue-600 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8">
      {/* Instructions */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">Level 1: Signal Hunter</h2>
        <p className="text-gray-400">Swipe right for SIGNAL • Swipe left for NOISE</p>
      </div>

      {/* Signal Counter */}
      <div className="mb-4 text-center">
        <span className="text-sm text-gray-400">
          Signal {currentSignalIndex + 1} of {signals.length}
        </span>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-md h-[500px] mb-8">
        {/* Background Cards (for depth) */}
        {signals[currentSignalIndex + 1] && (
          <div className="absolute inset-0 bg-gray-800 rounded-2xl border border-gray-700 transform scale-95 opacity-50" />
        )}

        {/* Current Card */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-8 cursor-grab active:cursor-grabbing"
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 bg-brilliant-blue/20 text-brilliant-blue rounded">
                  {currentSignal.category}
                </span>
                <span className="text-xs text-gray-500">{currentSignal.date}</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{currentSignal.title}</h3>
            </div>

            {/* Description */}
            <p className="text-gray-300 flex-1">
              {currentSignal.description}
            </p>

            {/* Source */}
            <div className="mt-4 text-sm text-gray-500">
              Source: {currentSignal.source}
            </div>
          </div>

          {/* Swipe Indicators */}
          <motion.div
            className="absolute top-8 left-8 text-6xl"
            style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
          >
            ✅
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 text-6xl"
            style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
          >
            ❌
          </motion.div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 hover:bg-red-500/30 transition flex items-center justify-center text-2xl"
        >
          ✗
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 hover:bg-green-500/30 transition flex items-center justify-center text-2xl"
        >
          ✓
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg ${
            feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {feedback.message}
        </motion.div>
      )}
    </div>
  );
};

export default Level1SignalHunter;
