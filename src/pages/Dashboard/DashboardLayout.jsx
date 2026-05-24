import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  BookOpen, 
  Calendar, 
  Mail, 
  Lock, 
  LogOut, 
  LayoutDashboard,
  ExternalLink,
  ImagePlus
} from 'lucide-react';

// Subcomponents
import SettingsManager from './SettingsManager';
import MinistriesManager from './MinistriesManager';
import EventsManager from './EventsManager';
import InboxManager from './InboxManager';
import PasswordManager from './PasswordManager';
import MediaManager from './MediaManager';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('settings');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/');
  };

  const menuItems = [
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'ministries', label: 'Ministries', icon: BookOpen },
    { id: 'events', label: 'Events Calendar', icon: Calendar },
    { id: 'media', label: 'Photo & Video', icon: ImagePlus },
    { id: 'messages', label: 'Inbox Inquiries', icon: Mail },
    { id: 'password', label: 'Security (Password)', icon: Lock },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return <SettingsManager />;
      case 'ministries':
        return <MinistriesManager />;
      case 'events':
        return <EventsManager />;
      case 'media':
        return <MediaManager />;
      case 'messages':
        return <InboxManager />;
      case 'password':
        return <PasswordManager />;
      default:
        return <SettingsManager />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar navigation */}
      <aside className="dashboard-sidebar">
        <div>
          <div className="sidebar-brand">
            <LayoutDashboard size={20} />
            Holy Faith <span>CMS</span>
          </div>
          
          <ul className="sidebar-menu">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              return (
                <li 
                  key={item.id} 
                  className={`sidebar-menu-item ${activeTab === item.id ? 'active' : ''}`}
                >
                  <button onClick={() => setActiveTab(item.id)}>
                    <IconComp size={18} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">Logged in as Admin</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', width: '100%' }}
            >
              <ExternalLink size={12} />
              View Public Site
            </button>
            <button 
              onClick={handleLogout} 
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', width: '100%' }}
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="dashboard-title">
            <h2>Holy Faith CMS Dashboard</h2>
            <p>Welcome! Modify and update your church website information below.</p>
          </div>
        </header>

        {/* Dynamic Content */}
        <div>
          {renderActiveTabContent()}
        </div>
      </main>
    </div>
  );
}
