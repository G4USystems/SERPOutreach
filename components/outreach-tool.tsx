"use client"

import React, { useState, useEffect } from 'react';
import { 
  Search, TrendingUp, Globe, Mail, Users, Target, Link2, 
  BarChart3, Send, CheckCircle, XCircle, AlertCircle, 
  Sparkles, Zap, Shield, Clock, Eye, MessageSquare,
  Filter, Download, Plus, Settings, ChevronRight, 
  ArrowUp, ArrowDown, ExternalLink, Linkedin, Twitter,
  RefreshCw, Play, Pause, Edit3, Trash2, Copy, ChevronDown,
  Moon, Sun, Menu, X, Bell, User, LogOut, Home, Database,
  FileText, PieChart, Activity
} from 'lucide-react';

// Import existing components
import { KeywordExplorer } from './keyword-explorer';
import { KeywordResults } from './keyword-results';

// Main App Component
export default function OutreachTool() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-900';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-200`}>
      {/* Header */}
      <header className={`${cardBg} ${borderColor} border-b sticky top-0 z-50 backdrop-blur-lg bg-opacity-90`}>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SERP Outreach Pro
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search campaigns, contacts..." 
                className={`pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all`}
              />
            </div>
            
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-300 dark:border-gray-600">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">Growth 4U</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Pro Plan</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} ${cardBg} ${borderColor} border-r h-[calc(100vh-64px)] 
          sticky top-16 transition-all duration-300 overflow-hidden`}>
          <nav className="p-4 space-y-2">
            {[
              { icon: Home, label: 'Dashboard', id: 'dashboard', badge: null },
              { icon: Search, label: 'Keywords', id: 'keywords', badge: '12 new' },
              { icon: Target, label: 'Opportunities', id: 'opportunities', badge: '45' },
              { icon: Users, label: 'Contacts', id: 'contacts', badge: '234' },
              { icon: Send, label: 'Campaigns', id: 'campaigns', badge: '3 active' },
              { icon: BarChart3, label: 'Analytics', id: 'analytics', badge: null },
              { icon: Database, label: 'Backlinks', id: 'backlinks', badge: null },
              { icon: Settings, label: 'Settings', id: 'settings', badge: null },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  ${currentPage === item.id 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        currentPage === item.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentPage === 'dashboard' && <Dashboard darkMode={darkMode} />}
          {currentPage === 'keywords' && <KeywordsPage darkMode={darkMode} />}
          {currentPage === 'opportunities' && <OpportunitiesPage darkMode={darkMode} />}
          {currentPage === 'contacts' && <ContactsPage darkMode={darkMode} />}
          {currentPage === 'campaigns' && <CampaignsPage darkMode={darkMode} />}
          {currentPage === 'analytics' && <AnalyticsPage darkMode={darkMode} />}
        </main>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard({ darkMode }: { darkMode: boolean }) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  const stats = [
    { 
      label: 'Active Campaigns', 
      value: '12', 
      change: '+23%', 
      trend: 'up', 
      icon: Send,
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      label: 'Links Acquired', 
      value: '847', 
      change: '+52%', 
      trend: 'up', 
      icon: Link2,
      color: 'from-green-500 to-green-600' 
    },
    { 
      label: 'Response Rate', 
      value: '34%', 
      change: '+8%', 
      trend: 'up', 
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      label: 'Domain Authority', 
      value: '67', 
      change: '+5', 
      trend: 'up', 
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your outreach campaigns today.
          </p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
          hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Campaign
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${cardBg} ${borderColor} border rounded-xl p-6 
            hover:shadow-xl transition-all duration-200 group`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg 
                flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium flex items-center gap-1 
                ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${cardBg} ${borderColor} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg 
              flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Find Keywords</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Discover new opportunities</p>
            </div>
          </div>
        </div>

        <div className={`${cardBg} ${borderColor} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg 
              flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Analyze SERPs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Find outreach targets</p>
            </div>
          </div>
        </div>

        <div className={`${cardBg} ${borderColor} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg 
              flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Launch Campaign</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start outreach</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keywords Page - Integrates existing KeywordExplorer
function KeywordsPage({ darkMode }: { darkMode: boolean }) {
  const [showResults, setShowResults] = useState(false);
  const [keywordResults, setKeywordResults] = useState<any[]>([]);

  const handleShowResults = (results: any[]) => {
    setKeywordResults(results);
    setShowResults(true);
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setKeywordResults([]);
  };

  return (
    <div>
      {!showResults ? (
        <KeywordExplorer onShowResults={handleShowResults} />
      ) : (
        <KeywordResults 
          onBackToSearch={handleBackToSearch} 
          keywordData={keywordResults} 
        />
      )}
    </div>
  );
}

// Opportunities Page
function OpportunitiesPage({ darkMode }: { darkMode: boolean }) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Opportunities</h1>
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
          hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2">
          <Search className="w-4 h-4" />
          Find New
        </button>
      </div>

      <div className={`${cardBg} ${borderColor} border rounded-xl p-6`}>
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          Opportunities will appear here after SERP analysis
        </p>
      </div>
    </div>
  );
}

// Contacts Page
function ContactsPage({ darkMode }: { darkMode: boolean }) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
          hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2">
            <Users className="w-4 h-4" />
          Find Contacts
        </button>
      </div>

      <div className={`${cardBg} ${borderColor} border rounded-xl p-6`}>
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          Contacts will be extracted from opportunities
        </p>
      </div>
    </div>
  );
}

// Campaigns Page
function CampaignsPage({ darkMode }: { darkMode: boolean }) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg 
          hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      <div className={`${cardBg} ${borderColor} border rounded-xl p-6`}>
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          Create your first outreach campaign
        </p>
      </div>
    </div>
  );
}

// Analytics Page
function AnalyticsPage({ darkMode }: { darkMode: boolean }) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <button className={`px-4 py-2 ${cardBg} ${borderColor} border rounded-lg 
          hover:shadow-md transition-all flex items-center gap-2`}>
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className={`${cardBg} ${borderColor} border rounded-xl p-6`}>
        <p className="text-center text-gray-500 dark:text-gray-400 py-12">
          Analytics will be available once you have campaign data
        </p>
      </div>
    </div>
  );
}

