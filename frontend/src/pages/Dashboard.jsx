import { useState } from 'react';
import Layout from '../components/Layout';
import ChatInterface from '../components/ChatInterface';
import CourseManagement from '../components/CourseManagement';
import ChapterManagement from '../components/ChapterManagement';
import FileUpload from '../components/FileUpload';

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('chat');

  const renderContent = () => {
    switch (currentView) {
      case 'courses':
        return <CourseManagement />;
      case 'chapters':
        return <ChapterManagement />;
      case 'upload':
        return <FileUpload />;
      case 'chat':
      default:
        return <ChatInterface />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default Dashboard;