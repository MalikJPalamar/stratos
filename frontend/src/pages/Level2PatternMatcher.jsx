import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/useGameStore';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Level2PatternMatcher = () => {
  const {
    level2Signals,
    level2ProcessedSignals,
    level2Categories,
    setLevel2Signals,
    setLevel2Categories,
    processLevel2Signal,
    addXP,
    updateAccuracy,
    setCurrentLevel,
    incrementStreak,
    resetStreak,
    currentStreak
  } = useGameStore();

  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch signals for Level 2
      const signalsResponse = await fetch('http://localhost:8000/api/level2/signals?limit=15');
      const signalsData = await signalsResponse.json();
      setLevel2Signals(signalsData);

      // Fetch CIPHER categories
      const categoriesResponse = await fetch('http://localhost:8000/api/cipher-categories');
      const categoriesData = await categoriesResponse.json();
      setLevel2Categories(categoriesData.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const currentSignal = level2Signals[currentSignalIndex];

  const triggerConfetti = (isMultiplier = false) => {
    const count = isMultiplier ? 200 : 100;
    const spread = isMultiplier ? 120 : 70;

    confetti({
      particleCount: count,
      spread: spread,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#3B82F6']
    });
  };

  const handleCategorySelect = async (categoryName) => {
    if (!currentSignal) return;

    try {
      const response = await fetch('http://localhost:8000/api/level2/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signalId: currentSignal.id,
          userCategory: categoryName
        })
      });

      const result = await response.json();

      // Process the signal
      processLevel2Signal(
        currentSignal,
        categoryName,
        result.correct,
        result.correctCategory
      );

      // Handle streak and confetti
      if (result.correct) {
        incrementStreak();
        addXP(result.xpGained);

        // Trigger confetti
        if (currentStreak >= 4) {
          triggerConfetti(true);
        } else {
          triggerConfetti();
        }

        // Bonus XP for streaks
        if (currentStreak >= 2) {
          const bonusXP = Math.min(currentStreak * 3, 30);
          addXP(bonusXP);
        }
      } else {
        resetStreak();
      }

      // Show feedback
      setFeedback({
        correct: result.correct,
        explanation: result.explanation
      });

      // Update accuracy
      const totalProcessed = level2ProcessedSignals.length + 1;
      const correctCount = level2ProcessedSignals.filter(s => s.isCorrect).length + (result.correct ? 1 : 0);
      updateAccuracy((correctCount / totalProcessed) * 100);

      // Move to next signal after delay
      setTimeout(() => {
        setCurrentSignalIndex(prev => prev + 1);
        setFeedback(null);
      }, 2500);

    } catch (error) {
      console.error('Error classifying signal:', error);
    }
  };

  if (level2Signals.length === 0 || level2Categories.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">Loading...</div>
          <p className="text-gray-400">Preparing Level 2: Pattern Matcher</p>
        </div>
      </div>
    );
  }

  if (!currentSignal) {
    // Level complete
    const accuracy = level2ProcessedSignals.length > 0
      ? ((level2ProcessedSignals.filter(s => s.isCorrect).length / level2ProcessedSignals.length) * 100)
      : 0;

    // Unlock Level 3 if accuracy >= 60%
    if (accuracy >= 60) {
      setCurrentLevel(3);
    }

    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Level 2 Complete!</h2>
          <p className="text-xl text-gray-400 mb-4">
            Accuracy: {accuracy.toFixed(1)}%
          </p>
          <p className="text-lg text-gray-300 mb-8">
            {accuracy >= 60
              ? '🎉 Level 3 Unlocked! You\'ve mastered the CIPHER framework.'
              : 'Try again to unlock Level 3 (need 60% accuracy)'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-brilliant-blue rounded-lg hover:bg-blue-600 transition"
            >
              Return Home
            </Link>
            {accuracy >= 60 && (
              <Link
                to="/level-3"
                className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
              >
                Continue to Level 3 →
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progress = (currentSignalIndex / level2Signals.length) * 100;

  return (
    <div className="min-h-[80vh] py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">Level 2: Pattern Matcher</h2>
        <p className="text-gray-400 mb-2">Classify signals into CIPHER categories</p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-3">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Signal {currentSignalIndex + 1} of {level2Signals.length}
        </div>
      </div>

      {/* Signal Card */}
      <motion.div
        key={currentSignal.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 p-6"
      >
        <div className="mb-3">
          <span className="text-xs px-2 py-1 bg-brilliant-blue/20 text-brilliant-blue rounded">
            {currentSignal.category}
          </span>
          <span className="text-xs text-gray-500 ml-2">{currentSignal.date}</span>
        </div>
        <h3 className="text-2xl font-bold mb-3">{currentSignal.title}</h3>
        <p className="text-gray-300 mb-4">{currentSignal.description}</p>
        <div className="text-sm text-gray-500">Source: {currentSignal.source}</div>
      </motion.div>

      {/* CIPHER Categories Grid */}
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-400 mb-4">Select the CIPHER category:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {level2Categories.map((category) => (
              <motion.button
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                onMouseEnter={() => setDraggedOver(category.name)}
                onMouseLeave={() => setDraggedOver(null)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  draggedOver === category.name
                    ? 'scale-105 shadow-lg'
                    : 'hover:scale-105'
                }`}
                style={{
                  borderColor: category.color,
                  backgroundColor: `${category.color}15`
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-left">
                  <h4
                    className="text-xl font-bold mb-2"
                    style={{ color: category.color }}
                  >
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-400">{category.description}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 max-w-md px-6 py-4 rounded-lg shadow-xl ${
              feedback.correct ? 'bg-green-500' : 'bg-orange-500'
            }`}
          >
            <div className="font-bold mb-1">
              {feedback.correct ? '✓ Correct!' : '✗ Not quite'}
            </div>
            <div className="text-sm">{feedback.explanation}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Level2PatternMatcher;
