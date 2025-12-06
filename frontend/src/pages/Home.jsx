import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useGameStore from '../store/useGameStore';

const Home = () => {
  const { currentLevel } = useGameStore();

  const levels = [
    {
      number: 1,
      title: 'The Observer',
      subtitle: 'Signal Hunter',
      description: 'Learn to distinguish signals from noise',
      icon: '🔍',
      path: '/level-1',
      unlocked: true
    },
    {
      number: 2,
      title: 'The Analyst',
      subtitle: 'Pattern Matcher',
      description: 'Master the CIPHER framework',
      icon: '🧩',
      path: '/level-2',
      unlocked: currentLevel >= 2
    },
    {
      number: 3,
      title: 'The Futurist',
      subtitle: 'World Builder',
      description: 'Explore axes of uncertainty',
      icon: '🌐',
      path: '/level-3',
      unlocked: currentLevel >= 3
    },
    {
      number: 4,
      title: 'The Strategist',
      subtitle: 'Timeline Constructor',
      description: 'Master backcasting and planning',
      icon: '⚡',
      path: '/level-4',
      unlocked: currentLevel >= 4
    }
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-brilliant-blue to-purple-500 text-transparent bg-clip-text">
          Welcome to StratOS
        </h1>
        <p className="text-xl text-gray-400">
          Master Strategic Foresight Through Interactive Learning
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {levels.map((level, index) => (
          <motion.div
            key={level.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={level.unlocked ? level.path : '#'}
              className={`block p-6 rounded-xl border-2 transition-all ${
                level.unlocked
                  ? 'border-brilliant-blue hover:border-purple-500 hover:shadow-lg hover:shadow-brilliant-blue/20 cursor-pointer'
                  : 'border-gray-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{level.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-brilliant-blue">
                      Level {level.number}
                    </span>
                    {!level.unlocked && (
                      <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                        🔒 Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{level.title}</h3>
                  <p className="text-sm text-brilliant-blue mb-2">
                    {level.subtitle}
                  </p>
                  <p className="text-gray-400 text-sm">{level.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
