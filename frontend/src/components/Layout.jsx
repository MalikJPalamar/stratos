import { Link, Outlet } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import { motion } from 'framer-motion';

const Layout = () => {
  const { currentLevel, xp, accuracy } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brilliant-dark via-gray-900 to-black">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-brilliant-blue">
            StratOS
          </Link>

          {/* Stats */}
          <div className="flex gap-6 items-center">
            <div className="text-sm">
              <span className="text-gray-400">Level:</span>{' '}
              <span className="text-white font-semibold">{currentLevel}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">XP:</span>{' '}
              <span className="text-white font-semibold">{xp}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Accuracy:</span>{' '}
              <span className="text-white font-semibold">{accuracy.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
