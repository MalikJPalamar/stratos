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

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/level4/scenarios');
      const data = await response.json();
      setScenarios(data.scenarios);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const selectScenario = async (scenarioName) => {
    try {
      const response = await fetch(`http://localhost:8000/api/level4/scenario/${encodeURIComponent(scenarioName)}`);
      const data = await response.json();
      setSelectedScenario(data);
      setMilestones(data.milestones);
      setUserOrder(data.milestones.map(m => m.id));
      setFeedback(null);
    } catch (error) {
      console.error('Error fetching scenario:', error);
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
            setCurrentLevel(5); // Unlock next level (or mark as complete)
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
    }
  };

  if (isLevelComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">🎓 Strategic Foresight Master!</h2>
          <p className="text-xl text-gray-400 mb-4">
            You've completed all 4 levels of StratOS
          </p>
          <p className="text-2xl text-brilliant-blue mb-8">
            You've mastered: Signal Detection • Pattern Recognition • Scenario Planning • Backcasting
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-brilliant-blue rounded-lg hover:bg-blue-600 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedScenario) {
    return (
      <div className="min-h-[80vh] py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">Level 4: Timeline Constructor</h2>
          <p className="text-gray-400 mb-4">Master backcasting: arrange milestones from present to future</p>
          <div className="text-sm text-gray-500">
            Scenarios Completed: {completedScenarios.size} / {scenarios.length}
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Choose a Future Scenario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <motion.button
                key={scenario.name}
                onClick={() => selectScenario(scenario.name)}
                className="p-6 rounded-xl border-2 text-left transition-all hover:scale-105"
                style={{
                  borderColor: scenario.futureState.color,
                  backgroundColor: `${scenario.futureState.color}15`,
                  opacity: completedScenarios.has(scenario.name) ? 0.5 : 1
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-xl font-bold" style={{ color: scenario.futureState.color }}>
                    {scenario.futureState.title}
                  </h4>
                  {completedScenarios.has(scenario.name) && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-2">Year {scenario.futureState.year}</p>
                <p className="text-gray-300">{scenario.futureState.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
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

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Future State Card */}
        <div
          className="lg:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border-2 p-6"
          style={{ borderColor: selectedScenario.futureState.color }}
        >
          <div className="text-sm text-gray-500 mb-2">Target Year</div>
          <h3 className="text-3xl font-bold mb-2" style={{ color: selectedScenario.futureState.color }}>
            {selectedScenario.futureState.year}
          </h3>
          <h4 className="text-xl font-bold mb-3">{selectedScenario.futureState.title}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {selectedScenario.futureState.description}
          </p>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              💡 Drag milestones to arrange them from earliest to latest
            </p>
          </div>
        </div>

        {/* Timeline Area */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-2xl border-2 border-gray-700 p-6">
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
                    className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700 cursor-grab active:cursor-grabbing hover:border-brilliant-blue transition"
                    whileDrag={{ scale: 1.05, boxShadow: "0 10px 40px rgba(0,102,255,0.3)" }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Year {milestone.year}</div>
                        <div className="font-semibold">{milestone.title}</div>
                      </div>
                      <div className="flex-shrink-0 text-gray-600">
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
              className="w-full mt-6 py-4 bg-brilliant-blue rounded-lg font-bold text-lg hover:bg-blue-600 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Validate Timeline
            </motion.button>
          </div>
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
              {feedback.correct ? '✓ Perfect Timeline!' : `✗ ${feedback.correctPositions}/5 Correct`}
            </div>
            <div className="text-sm mb-2">{feedback.feedback}</div>
            <div className="text-xs opacity-80">+{feedback.xpGained} XP</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Level4TimelineConstructor;
