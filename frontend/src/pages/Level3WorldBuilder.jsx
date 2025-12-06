import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import confetti from 'canvas-confetti';

const Level3WorldBuilder = () => {
  const { addXP, setCurrentLevel } = useGameStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scenario, setScenario] = useState(null);
  const [exploredQuadrants, setExploredQuadrants] = useState(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchScenario(0, 0);
  }, []);

  const fetchScenario = async (x, y) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/level3/scenario?x=${x}&y=${y}`);
      if (!response.ok) throw new Error('Failed to fetch scenario');
      const data = await response.json();
      setScenario(data);

      // Track explored quadrants
      setExploredQuadrants(prev => {
        const newSet = new Set(prev);
        newSet.add(data.quadrant);

        // If all 4 quadrants explored, complete the level
        if (newSet.size === 4 && !isComplete) {
          setIsComplete(true);
          addXP(100);
          setCurrentLevel(4);
          confetti({
            particleCount: 300,
            spread: 160,
            origin: { y: 0.5 },
            colors: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
          });
        }

        return newSet;
      });
    } catch (error) {
      console.error('Error fetching scenario:', error);
      setError('Failed to load scenario. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current || isLoading) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to -1 to 1 range
    const normalizedX = (clickX / rect.width) * 2 - 1;
    const normalizedY = -((clickY / rect.height) * 2 - 1);

    setPosition({ x: normalizedX, y: normalizedY });
    fetchScenario(normalizedX, normalizedY);
  };

  if (!scenario) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-4xl mb-4">🌍</div>
          <div className="text-xl">Loading World Builder...</div>
        </motion.div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.h2
            className="text-5xl font-bold mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉 World Builder Mastered!
          </motion.h2>
          <p className="text-xl text-gray-400 mb-4">
            You've explored all 4 future scenarios
          </p>
          <p className="text-2xl text-brilliant-blue mb-8">+100 XP • Level 4 Unlocked</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-brilliant-blue rounded-lg hover:bg-blue-600 transition"
            >
              Return Home
            </Link>
            <Link
              to="/level-4"
              className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition"
            >
              Continue to Level 4 →
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-8">
      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 border-brilliant-blue p-8 max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold mb-4">🌍 Level 3: World Builder</h3>
              <div className="space-y-4 text-gray-300">
                <p className="text-lg">
                  Welcome to scenario planning! You'll explore 4 different future scenarios based on two axes of uncertainty:
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                  <div><strong className="text-brilliant-blue">Economic Growth</strong> (Left ↔ Right)</div>
                  <div><strong className="text-brilliant-blue">Tech Advancement</strong> (Bottom ↔ Top)</div>
                </div>
                <p>
                  <strong>How to play:</strong> Click anywhere on the canvas to explore different futures. Each quadrant represents a unique scenario.
                </p>
                <p className="text-sm text-gray-400">
                  💡 Explore all 4 quadrants to unlock Level 4!
                </p>
              </div>
              <motion.button
                onClick={() => setShowInstructions(false)}
                className="w-full mt-6 py-3 bg-brilliant-blue rounded-lg font-bold hover:bg-blue-600 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Exploring
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">Level 3: World Builder</h2>
        <p className="text-gray-400 mb-4">Explore future scenarios by clicking the canvas</p>
        <div className="flex items-center justify-center gap-4">
          <div className="text-sm text-gray-500">
            Quadrants Explored: {exploredQuadrants.size} / 4
          </div>
          <button
            onClick={() => setShowInstructions(true)}
            className="text-sm text-brilliant-blue hover:text-blue-400 transition"
          >
            ℹ️ Instructions
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
        >
          {error}
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2D Axis Controller */}
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold mb-2">Axes of Uncertainty</h3>
            <p className="text-sm text-gray-400">
              {isLoading ? 'Loading...' : 'Click anywhere to explore'}
            </p>
          </div>

          <div className="relative">
            {/* Canvas */}
            <motion.div
              ref={canvasRef}
              onClick={handleCanvasClick}
              className={`w-[400px] h-[400px] bg-gray-900 rounded-2xl border-2 relative overflow-hidden transition-all ${
                isLoading ? 'cursor-wait border-gray-700' : 'cursor-crosshair border-gray-700 hover:border-brilliant-blue'
              }`}
              style={{
                background: `radial-gradient(circle at ${((position.x + 1) / 2) * 100}% ${((1 - position.y) / 2) * 100}%, ${scenario.scenario.color}33, transparent 60%)`
              }}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  className="absolute top-0 left-1/2 w-px h-full bg-gray-700"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute left-0 top-1/2 w-full h-px bg-gray-700"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Axis Labels */}
              <div className="absolute -left-32 top-1/2 transform -translate-y-1/2 -rotate-90 pointer-events-none">
                <span className="text-xs text-gray-400 font-semibold">Tech Advancement →</span>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
                <span className="text-xs text-gray-400 font-semibold">Economic Growth →</span>
              </div>

              {/* Position Dot */}
              <motion.div
                className="absolute w-8 h-8 rounded-full shadow-2xl pointer-events-none"
                style={{
                  left: `calc(${((position.x + 1) / 2) * 100}% - 16px)`,
                  top: `calc(${((1 - position.y) / 2) * 100}% - 16px)`,
                  backgroundColor: scenario.scenario.color,
                  boxShadow: `0 0 30px ${scenario.scenario.color}66`
                }}
                animate={{
                  scale: isLoading ? [1, 1.1, 1] : [1, 1.3, 1],
                }}
                transition={{
                  duration: isLoading ? 0.5 : 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 rounded-full border-2 border-white" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: scenario.scenario.color }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Explored Quadrants Markers */}
              {Array.from(exploredQuadrants).map((quadrant, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute text-3xl pointer-events-none"
                  style={{
                    top: quadrant.includes("Future") || quadrant.includes("Divide") ? '10%' : '85%',
                    left: quadrant.includes("Future") || quadrant.includes("Material") ? '85%' : '10%',
                    filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))'
                  }}
                >
                  ✓
                </motion.div>
              ))}

              {/* Loading Overlay */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-brilliant-blue border-t-transparent rounded-full"
                  />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Progress Indicators */}
          <div className="mt-6 flex gap-2">
            {[1, 2, 3, 4].map((num) => (
              <motion.div
                key={num}
                className={`w-12 h-2 rounded-full transition-all ${
                  exploredQuadrants.size >= num ? 'bg-brilliant-blue' : 'bg-gray-700'
                }`}
                animate={{
                  scale: exploredQuadrants.size >= num ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* Scenario Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.quadrant}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 p-8 shadow-xl"
            style={{
              borderColor: scenario.scenario.color,
              boxShadow: `0 0 40px ${scenario.scenario.color}22`
            }}
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-4"
            >
              <motion.span
                className="text-4xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {scenario.scenario.emoji}
              </motion.span>
              <div>
                <h3 className="text-2xl font-bold">{scenario.scenario.title}</h3>
                <p className="text-sm text-gray-400">Year {scenario.scenario.year}</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-300 mb-6 leading-relaxed"
            >
              {scenario.scenario.description}
            </motion.p>

            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              {[
                { label: 'Economy', value: scenario.scenario.economy },
                { label: 'Technology', value: scenario.scenario.technology },
                { label: 'Society', value: scenario.scenario.society },
                { label: 'Environment', value: scenario.scenario.environment }
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + idx * 0.05 }}
                  className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-800/50 transition"
                >
                  <span className="text-gray-400 text-sm font-semibold min-w-[100px]">{item.label}:</span>
                  <span className="text-white text-sm">{item.value}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 pt-6 border-t border-gray-700"
            >
              <p className="text-xs text-gray-500">
                💡 Explore all 4 quadrants to unlock Level 4
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Level3WorldBuilder;
