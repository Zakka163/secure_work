import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings as SettingsIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      {/* iOS Top App Bar is usually translucent, blending with the scroll */}
      <div 
        className="ios-header"
        style={{ 
          margin: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '0.5px solid rgba(0,0,0,0.1)',
          paddingTop: 'calc(16px + env(safe-area-inset-top))',
          paddingBottom: '12px'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          SecureWork
        </h2>
      </div>

      {/* Main scrolling content area */}
      <main className="main-content">
        {children}
      </main>

      {/* Apple iOS Bottom Navigation Bar */}
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={24} />
          <span>Beranda</span>
        </NavLink>
        
        <NavLink to="/reports" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={24} />
          <span>Laporan</span>
        </NavLink>
        
        <NavLink to="/employees" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Users size={24} />
          <span>Karyawan</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <SettingsIcon size={24} />
          <span>Setelan</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
