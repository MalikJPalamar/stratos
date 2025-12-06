import { Link } from 'react-router-dom';

const Level2PatternMatcher = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Level 2: Pattern Matcher</h2>
        <p className="text-xl text-gray-400 mb-8">
          Master the CIPHER framework
        </p>
        <p className="text-gray-500 mb-8">Coming soon...</p>
        <Link
          to="/"
          className="px-6 py-3 bg-brilliant-blue rounded-lg hover:bg-blue-600 transition inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default Level2PatternMatcher;
