import React, { useState } from 'react';
import { SensoryProvider } from './context/SensoryContext';
import Layout from './components/Layout';
import BreathingCircle from './components/BreathingCircle';
import Meditation from './components/Meditation';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Achievements from './components/Achievements';
import FocusTimer from './components/FocusTimer';

function AppContent() {
  const [view, setView] = useState('home');

  const getPageInfo = () => {
    switch (view) {
      case 'breathing':
        return { title: 'Breathe', subtitle: 'Find your rhythm. Follow the circle.' };
      case 'meditation':
        return { title: 'Meditate', subtitle: 'Take a moment to be present.' };
      case 'focus':
        return { title: 'Focus', subtitle: 'Stay productive with the Pomodoro technique.' };
      case 'history':
        return { title: 'History', subtitle: 'Your mindfulness journey over time.' };
      case 'achievements':
        return { title: 'Achievements', subtitle: 'Celebrate your progress.' };
      default:
        return { title: 'Dashboard', subtitle: 'Track your mindfulness journey.' };
    }
  };

  const { title, subtitle } = getPageInfo();

  const renderContent = () => {
    switch (view) {
      case 'breathing':
        return <BreathingCircle />;
      case 'meditation':
        return <Meditation />;
      case 'focus':
        return <FocusTimer />;
      case 'history':
        return <History />;
      case 'achievements':
        return <Achievements />;
      default:
        return <Dashboard onNavigate={setView} />;
    }
  };

  return (
    <Layout
      title={title}
      subtitle={subtitle}
      currentView={view}
      onViewChange={setView}
    >
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <SensoryProvider>
      <AppContent />
    </SensoryProvider>
  );
}

export default App;
