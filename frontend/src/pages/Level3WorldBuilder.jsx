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
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchScenario(0, 0);
  }, []);

  const fetchScenario = async (x, y) => {
    try {
      const response = await fetch(`http://localhost:8000/api/level3/scenario?x=${x}&y=${y}`);
      const data = await response.json();
      setScenario(data);

      // Track explored quadrants
      setExploredQuadrants(prev => {
        const newSet = new Set(prev);
        newSet.add(data.quadrant);

        // If all 4 quadrants explored, complete the level
        if (newSet.size === 4 && !isComplete) {
          setIsComplete(true);
          addXP(100); // Big reward for exploring all scenarios
          setCurrentLevel(4); // Unlock Level 4
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
    }
  };

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to -1 to 1 range
    const normalizedX = (clickX / rect.width) * 2 - 1;
    const normalizedY = -((clickY / rect.height) * 2 - 1); // Invert Y

    setPosition({ x: normalizedX, y: normalizedY });
    fetchScenario(normalizedX, normalizedY);
  };

  if (!scenario) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-4xl">Loading...</div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">🎉 World Builder Mastered!</h2>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">Level 3: World Builder</h2>
        <p className="text-gray-400 mb-4">Explore future scenarios by moving the dot</p>
        <div className="text-sm text-gray-500">
          Quadrants Explored: {exploredQuadrants.size} / 4
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2D Axis Controller */}
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold mb-2">Axes of Uncertainty</h3>
            <p className="text-sm text-gray-400">Click anywhere to explore</p>
          </div>

          <div className="relative">
            {/* Canvas */}
            <motion.div
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-[400px] h-[400px] bg-gray-900 rounded-2xl border-2 border-gray-700 relative cursor-crosshair overflow-hidden"
              style={{
                background: `radial-gradient(circle at ${((position.x + 1) / 2) * 100}% ${((1 - position.y) / 2) * 100}%, ${scenario.scenario.color}33, transparent 60%)`
              }}
            >
              {/* Grid lines */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 w-px h-full bg-gray-700" />
                <div className="absolute left-0 top-1/2 w-full h-px bg-gray-700" />
              </div>

              {/* Quadrant Labels */}
              <div className="absolute top-4 right-4 text-xs text-gray-500">High Tech</div>
              <div className="absolute bottom-4 right-4 text-xs text-gray-500">Low Tech</div>
              <div className="absolute top-4 left-4 text-xs text-gray-500">Low Economy</div>
              <div className="absolute top-4 right-4 text-xs text-gray-500">High Economy</div>

              {/* Axis Labels */}
              <div className="absolute -left-24 top-1/2 transform -translate-y-1/2 -rotate-90">
                <span className="text-xs text-gray-400">Tech Advancement →</span>
              </div>
              <div className="absolute bottom--8 left-1/2 transform -translate-x-1/2">
                <span className="text-xs text-gray-400">Economic Growth →</span>
              </div>

              {/* Position Dot */}
              <motion.div
                className="absolute w-6 h-6 rounded-full shadow-lg cursor-pointer"
                style={{
                  left: `calc(${((position.x + 1) / 2) * 100}% - 12px)`,
                  top: `calc(${((1 - position.y) / 2) * 100}% - 12px)`,
                  backgroundColor: scenario.scenario.color
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 rounded-full border-2 border-white" />
              </motion.div>

              {/* Explored Quadrants Markers */}
              {Array.from(exploredQuadrants).map((quadrant, idx) => (
                <div
                  key={idx}
                  className="absolute text-2xl"
                  style={{
                    top: quadrant.includes("Future") || quadrant.includes("Divide") ? '10%' : '85%',
                    left: quadrant.includes("Future") || quadrant.includes("Material") ? '85%' : '10%',
                  }}
                >
                  ✓
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scenario Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.quadrant}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 p-8"
            style={{ borderColor: scenario.scenario.color }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{scenario.scenario.emoji}</span>
              <div>
                <h3 className="text-2xl font-bold">{scenario.scenario.title}</h3>
                <p className="text-sm text-gray-400">Year {scenario.scenario.year}</p>
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {scenario.scenario.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-gray-400 text-sm font-semibold min-w-[100px]">Economy:</span>
                <span className="text-white text-sm">{scenario.scenario.economy}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 text-sm font-semibold min-w-[100px]">Technology:</span>
                <span className="text-white text-sm">{scenario.scenario.technology}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 text-sm font-semibold min-w-[100px]">Society:</span>
                <span className="text-white text-sm">{scenario.scenario.society}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 text-sm font-semibold min-w-[100px]">Environment:</span>
                <span className="text-white text-sm">{scenario.scenario.environment}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                💡 Explore all 4 quadrants to unlock Level 4
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Level3WorldBuilder;
