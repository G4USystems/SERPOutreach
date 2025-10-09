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
              { icon: Home, label: 'Dashboard', id: 'dashboard', badge: null, enabled: true },
              { icon: Search, label: 'Keywords', id: 'keywords', badge: null, enabled: true },
              { icon: Target, label: 'Opportunities', id: 'opportunities', badge: null, enabled: true },
              { icon: Users, label: 'Contacts', id: 'contacts', badge: 'Próximamente', enabled: false },
              { icon: Send, label: 'Campaigns', id: 'campaigns', badge: 'Próximamente', enabled: false },
              { icon: BarChart3, label: 'Analytics', id: 'analytics', badge: 'Próximamente', enabled: false },
              { icon: Database, label: 'Backlinks', id: 'backlinks', badge: 'Próximamente', enabled: false },
              { icon: Settings, label: 'Settings', id: 'settings', badge: null, enabled: true },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => item.enabled && setCurrentPage(item.id)}
                disabled={!item.enabled}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  ${!item.enabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : currentPage === item.id 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        !item.enabled
                          ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                          : currentPage === item.id 
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
          {currentPage === 'settings' && <SettingsPage darkMode={darkMode} />}
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
      label: 'Keywords Analizadas', 
      value: '0', 
      change: 'Comienza ahora', 
      trend: 'up', 
      icon: Search,
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      label: 'Oportunidades SERP', 
      value: '0', 
      change: 'Analiza keywords', 
      trend: 'up', 
      icon: Target,
      color: 'from-green-500 to-green-600' 
    },
    { 
      label: 'Contactos Extraídos', 
      value: '0', 
      change: 'Próximamente', 
      trend: 'up', 
      icon: Users,
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      label: 'Campañas Activas', 
      value: '0', 
      change: 'Próximamente', 
      trend: 'up', 
      icon: Send,
      color: 'from-orange-500 to-orange-600' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Comienza analizando keywords y encontrando oportunidades SERP.
          </p>
        </div>
        <button 
          disabled
          className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg 
            cursor-not-allowed flex items-center gap-2 opacity-50">
          <Plus className="w-5 h-5" />
          New Campaign
          <span className="text-xs">(Próximamente)</span>
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
              <span className="text-xs text-gray-500 dark:text-gray-400">
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
        <button 
          onClick={() => window.location.href = '#keywords'}
          className={`${cardBg} ${borderColor} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group text-left`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg 
              flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Find Keywords</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Descubre nuevas oportunidades</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => window.location.href = '#opportunities'}
          className={`${cardBg} ${borderColor} border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group text-left`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg 
              flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Analyze SERPs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Encuentra objetivos de outreach</p>
            </div>
          </div>
        </button>

        <div className={`${cardBg} ${borderColor} border rounded-xl p-6 opacity-50 cursor-not-allowed`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-400 dark:bg-gray-600 rounded-lg 
              flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-500 dark:text-gray-400">Launch Campaign</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Próximamente</p>
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
        <button 
          disabled
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg 
            cursor-not-allowed flex items-center gap-2 opacity-50">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      <div className={`${cardBg} ${borderColor} border rounded-xl p-6`}>
        <div className="text-center py-12">
          <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
            Analytics Próximamente
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Las métricas estarán disponibles una vez que tengas datos de campañas
          </p>
        </div>
      </div>
    </div>
  );
}

// Settings Page
function SettingsPage({ darkMode }: { darkMode: boolean }) {
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className={`${cardBg} ${borderColor} border rounded-xl p-6`}>
        <h2 className="text-xl font-semibold mb-4">Webhooks Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Keywords Webhook</label>
            <input 
              type="text" 
              value="https://n8n-growth4u-u37225.vm.elestio.app/webhook/v0-KWs"
              readOnly
              className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} 
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">✅ Activo</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SERP Analysis Webhook</label>
            <input 
              type="text" 
              value="https://n8n-growth4u-u37225.vm.elestio.app/webhook/SERP-outreach"
              readOnly
              className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} 
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">✅ Activo</p>
          </div>

          <div className="opacity-50">
            <label className="block text-sm font-medium mb-2">Contact Enrichment Webhook</label>
            <input 
              type="text" 
              placeholder="Próximamente"
              disabled
              className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} 
                cursor-not-allowed`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">⏳ Próximamente</p>
          </div>

          <div className="opacity-50">
            <label className="block text-sm font-medium mb-2">Campaign Execution Webhook</label>
            <input 
              type="text" 
              placeholder="Próximamente"
              disabled
              className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} 
                cursor-not-allowed`}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">⏳ Próximamente</p>
          </div>
        </div>
      </div>

      <div className={`${cardBg} ${borderColor} border rounded-xl p-6`}>
        <h2 className="text-xl font-semibold mb-4">Application Info</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Version:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Status:</span>
            <span className="font-medium text-green-500">✅ Operational</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Active Features:</span>
            <span className="font-medium">Keywords, SERP Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
}

