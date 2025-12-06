import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Link } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import confetti from 'canvas-confetti';

const Level4TimelineConstructor = () => {
  const { addXP, setCurrentLevel, incrementStreak, resetStreak, currentStreak } = useGameStore();
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [completedScenarios, setCompletedScenarios] = useState(new Set());
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/level4/scenarios');
      if (!response.ok) throw new Error('Failed to fetch scenarios');
      const data = await response.json();
      setScenarios(data.scenarios);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      setError('Failed to load scenarios. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectScenario = async (scenarioName) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/level4/scenario/${encodeURIComponent(scenarioName)}`);
      if (!response.ok) throw new Error('Failed to fetch scenario');
      const data = await response.json();
      setSelectedScenario(data);
      setMilestones(data.milestones);
      setUserOrder(data.milestones.map(m => m.id));
      setFeedback(null);
    } catch (error) {
      console.error('Error fetching scenario:', error);
      setError('Failed to load scenario. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerConfetti = (isMultiplier = false) => {
    const count = isMultiplier ? 250 : 120;
    const spread = isMultiplier ? 140 : 80;

    confetti({
      particleCount: count,
      spread: spread,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899']
    });
  };

  const handleSubmit = async () => {
    if (!selectedScenario) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/level4/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenarioName: selectedScenario.scenarioName,
          userOrder: userOrder
        })
      });

      if (!response.ok) throw new Error('Failed to validate timeline');
      const result = await response.json();

      // Handle streak
      if (result.correct) {
        incrementStreak();
        addXP(result.xpGained);

        // Trigger confetti
        if (currentStreak >= 2) {
          triggerConfetti(true);
        } else {
          triggerConfetti();
        }

        // Mark scenario as completed
        setCompletedScenarios(prev => {
          const newSet = new Set(prev);
          newSet.add(selectedScenario.scenarioName);

          // Check if all scenarios completed
          if (newSet.size === scenarios.length) {
            setIsLevelComplete(true);
            setCurrentLevel(5);
            confetti({
              particleCount: 400,
              spread: 180,
              origin: { y: 0.5 },
              colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444']
            });
          }

          return newSet;
        });
      } else {
        resetStreak();
      }

      // Show feedback
      setFeedback({
        correct: result.correct,
        feedback: result.feedback,
        correctPositions: result.correctPositions,
        xpGained: result.xpGained
      });

      // Auto-dismiss feedback after delay
      if (result.correct) {
        setTimeout(() => {
          setFeedback(null);
          setSelectedScenario(null);
          setMilestones([]);
        }, 3000);
      }

    } catch (error) {
      console.error('Error validating timeline:', error);
      setError('Failed to validate timeline. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLevelComplete) {
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
            🎓 Strategic Foresight Master!
          </motion.h2>
          <p className="text-xl text-gray-400 mb-4">
            You've completed all 4 levels of StratOS
          </p>
          <motion.p
            className="text-2xl text-brilliant-blue mb-8"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            You've mastered: Signal Detection • Pattern Recognition • Scenario Planning • Backcasting
          </motion.p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-brilliant-blue rounded-lg hover:bg-blue-600 transition"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!selectedScenario) {
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
                <h3 className="text-3xl font-bold mb-4">📅 Level 4: Timeline Constructor</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="text-lg">
                    Welcome to backcasting! You'll build timelines from present to future by arranging key milestones.
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                    <div><strong className="text-brilliant-blue">Backcasting:</strong> Working backwards from a desired future to identify steps needed to reach it</div>
                  </div>
                  <p>
                    <strong>How to play:</strong> Choose a future scenario, then drag milestones into chronological order from earliest to latest.
                  </p>
                  <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-3">
                    <p className="text-sm text-amber-300">
                      💡 Think about dependencies: what must happen first to enable later events?
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Complete all 4 scenarios to master strategic foresight!
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowInstructions(false)}
                  className="w-full mt-6 py-3 bg-brilliant-blue rounded-lg font-bold hover:bg-blue-600 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Building Timelines
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">Level 4: Timeline Constructor</h2>
          <p className="text-gray-400 mb-4">Master backcasting: arrange milestones from present to future</p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-sm text-gray-500">
              Scenarios Completed: {completedScenarios.size} / {scenarios.length}
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
            className="max-w-4xl mx-auto mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-brilliant-blue border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Scenario Selection */}
        {!isLoading && (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Choose a Future Scenario</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map((scenario, idx) => (
                <motion.button
                  key={scenario.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => selectScenario(scenario.name)}
                  className="p-6 rounded-xl border-2 text-left transition-all relative overflow-hidden group"
                  style={{
                    borderColor: scenario.futureState.color,
                    backgroundColor: `${scenario.futureState.color}15`,
                    opacity: completedScenarios.has(scenario.name) ? 0.6 : 1
                  }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Hover effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{ backgroundColor: scenario.futureState.color }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold" style={{ color: scenario.futureState.color }}>
                        {scenario.futureState.title}
                      </h4>
                      {completedScenarios.has(scenario.name) && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl"
                          style={{ filter: `drop-shadow(0 0 10px ${scenario.futureState.color})` }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Year {scenario.futureState.year}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{scenario.futureState.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Progress Indicators */}
            <div className="mt-8 flex justify-center gap-2">
              {scenarios.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`w-16 h-2 rounded-full transition-all ${
                    completedScenarios.size > idx ? 'bg-brilliant-blue' : 'bg-gray-700'
                  }`}
                  animate={{
                    scale: completedScenarios.size > idx ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Timeline view with drag-and-drop
  return (
    <div className="min-h-[80vh] py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2">Level 4: Timeline Constructor</h2>
        <p className="text-gray-400 mb-4">Arrange milestones in chronological order</p>
        <button
          onClick={() => {
            setSelectedScenario(null);
            setFeedback(null);
          }}
          className="text-sm text-gray-500 hover:text-brilliant-blue transition"
        >
          ← Back to scenario selection
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300"
        >
          {error}
        </motion.div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Future State Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 p-6 shadow-xl"
          style={{
            borderColor: selectedScenario.futureState.color,
            boxShadow: `0 0 40px ${selectedScenario.futureState.color}22`
          }}
        >
          <div className="text-sm text-gray-500 mb-2">Target Year</div>
          <motion.h3
            className="text-3xl font-bold mb-2"
            style={{ color: selectedScenario.futureState.color }}
            animate={{ textShadow: [`0 0 20px ${selectedScenario.futureState.color}66`, `0 0 30px ${selectedScenario.futureState.color}99`, `0 0 20px ${selectedScenario.futureState.color}66`] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {selectedScenario.futureState.year}
          </motion.h3>
          <h4 className="text-xl font-bold mb-3">{selectedScenario.futureState.title}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {selectedScenario.futureState.description}
          </p>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-3">
              💡 Drag milestones to arrange them from earliest to latest
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-lg">⋮⋮</span>
              <span>Drag handle</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-700 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Build the Timeline</h3>
              <span className="text-sm text-gray-500">Present → Future</span>
            </div>

            {/* Reorderable List */}
            <Reorder.Group
              axis="y"
              values={userOrder}
              onReorder={setUserOrder}
              className="space-y-3"
            >
              {userOrder.map((milestoneId, index) => {
                const milestone = milestones.find(m => m.id === milestoneId);
                return (
                  <Reorder.Item
                    key={milestoneId}
                    value={milestoneId}
                    className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700 cursor-grab active:cursor-grabbing hover:border-brilliant-blue transition-all group"
                    whileDrag={{
                      scale: 1.05,
                      boxShadow: "0 10px 40px rgba(0,102,255,0.3)",
                      rotate: 2
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 group-hover:bg-brilliant-blue flex items-center justify-center text-sm font-bold transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        {index + 1}
                      </motion.div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Year {milestone.year}</div>
                        <div className="font-semibold group-hover:text-brilliant-blue transition-colors">
                          {milestone.title}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-gray-600 group-hover:text-gray-400 text-xl transition-colors">
                        ⋮⋮
                      </div>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>

            {/* Submit Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full mt-6 py-4 rounded-lg font-bold text-lg transition-all ${
                isLoading
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-brilliant-blue hover:bg-blue-600'
              }`}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Validating...
                </div>
              ) : (
                'Validate Timeline'
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 max-w-md px-6 py-4 rounded-lg shadow-2xl ${
              feedback.correct ? 'bg-green-500' : 'bg-orange-500'
            }`}
          >
            <motion.div
              className="font-bold mb-1 text-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.3 }}
            >
              {feedback.correct ? '✓ Perfect Timeline!' : `✗ ${feedback.correctPositions}/5 Correct`}
            </motion.div>
            <div className="text-sm mb-2">{feedback.feedback}</div>
            <div className="text-xs opacity-80 font-semibold">+{feedback.xpGained} XP</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Level4TimelineConstructor;
