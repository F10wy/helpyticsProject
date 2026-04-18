import React from 'react';
import Admin from './admin/Admin.jsx';
import AICenter from './ai-center/AiCenter.jsx';
import CreateRequest from './create-request/CreateRequest';
import Dashboard from './dashboard/Dashboard';
import Explore from './explore/Explore';
import Home from './home/Home';
import Leaderboard from './leaderboard/Leaderboard.jsx';
import Notification from './notifications/Notifications.jsx';
import Messages from './messages/Messages';
import Onboarding from './onboarding/Onboarding';
import Profile from './profile/Profile';
import RequestDetail from './request-detail/RequestDetail.jsx';

function App() {
  // Basic routing based on the URL path
  const path = window.location.pathname;

  const renderContent = () => {
    switch (path) {
      case '/explore': return <Explore />;
      case '/dashboard': return <Dashboard />;
      case '/profile': return <Profile />;
      case '/leaderboard': return <Leaderboard />;
      case '/ai-center': return <AICenter />;
      case '/create-request': return <CreateRequest />;
      case '/notifications': return <Notification />;
      case '/messages': return <Messages />;
      case '/onboarding': return <Onboarding />;
      case '/admin': return <Admin />;
      case '/request-detail': return <RequestDetail />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col gap-10">
      {renderContent()}
    </div>
  );
}

export default App;