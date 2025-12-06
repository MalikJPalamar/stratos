import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Level1SignalHunter from './pages/Level1SignalHunter';
import Level2PatternMatcher from './pages/Level2PatternMatcher';
import Level3WorldBuilder from './pages/Level3WorldBuilder';
import Level4TimelineConstructor from './pages/Level4TimelineConstructor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="level-1" element={<Level1SignalHunter />} />
          <Route path="level-2" element={<Level2PatternMatcher />} />
          <Route path="level-3" element={<Level3WorldBuilder />} />
          <Route path="level-4" element={<Level4TimelineConstructor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
