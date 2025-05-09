import { useState, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { FiGithub, FiSearch, FiUser, FiStar, FiGitBranch, FiClock, FiDownload, FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';

import ProfileCard from './Components/ProfileCard';
import LanguageChart from './Components/LanguageChart';
import ActivityChart from './Components/ActivityChart';
import ResumeOutput from './Components/ResumeOutput';
import StatsGrid from './Components/StatsGrid';

const queryClient = new QueryClient();

function App() {
  const [username, setUsername] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    const timer = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setIsAnalyzing(true);
    setUsername(inputValue.trim());
    setActiveTab('overview'); // Reset to overview tab when analyzing new profile
    setTimeout(() => setIsAnalyzing(false), 1000);
  };

  const handleDownloadResume = useReactToPrint({
    content: () => resumeRef.current,
    pageStyle: `
      @page { size: A4; margin: 1cm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; } 
      }
    `,
    documentTitle: `${username}-github-resume`
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
        {/* Animated Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm sticky top-0 z-10`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FiGithub className={`text-2xl ${darkMode ? 'text-gray-100' : 'text-gray-800'}`} />
              <h1 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500`}>
                Profile Insights
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex space-x-6">
                <button 
                  className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'overview' ? 'text-purple-600 font-medium' : darkMode ? 'text-gray-300 hover:text-purple-500' : 'text-gray-600 hover:text-purple-600'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`px-3 py-1 rounded-md transition-colors ${activeTab === 'resume' ? 'text-purple-600 font-medium' : darkMode ? 'text-gray-300 hover:text-purple-500' : 'text-gray-600 hover:text-purple-600'}`}
                  onClick={() => setActiveTab('resume')}
                >
                  Resume
                </button>
              </nav>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <FiSun /> : <FiMoon />}
              </button>
            </div>
          </div>
        </motion.header>

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <AnimatePresence>
            {showIntro && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                  Unlock Your GitHub Potential
                </h2>
                <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                  Visualize your coding journey, analyze your contributions, and create a stunning profile overview.
                </p>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Search Form */}
          <motion.form 
            onSubmit={handleAnalyze}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter GitHub username..."
                className={`block w-full pl-10 pr-12 py-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`absolute right-2 top-2 px-4 py-2 rounded-md flex items-center space-x-2 transition-all ${
                  inputValue.trim()
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <FiSearch className="text-lg" />
                )}
                <span>Analyze</span>
              </button>
            </div>
          </motion.form>

          {/* Results Section */}
          {username && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Quick Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  icon={<FiStar className="text-yellow-500" />} 
                  label="Top Repo" 
                  value="react-portfolio" 
                  isLoading={isAnalyzing}
                  darkMode={darkMode}
                />
                <StatCard 
                  icon={<FiGitBranch className="text-blue-500" />} 
                  label="Total Repos" 
                  value="42" 
                  isLoading={isAnalyzing}
                  darkMode={darkMode}
                />
                <StatCard 
                  icon={<FiClock className="text-purple-500" />} 
                  label="Active Since" 
                  value="2020" 
                  isLoading={isAnalyzing}
                  darkMode={darkMode}
                />
                <StatCard 
                  icon={<div className="w-3 h-3 rounded-full bg-green-500"></div>} 
                  label="Status" 
                  value="Active" 
                  isLoading={isAnalyzing}
                  darkMode={darkMode}
                />
              </div>

              {/* Tab Navigation */}
              <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'overview' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${activeTab === 'resume' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('resume')}
                >
                  Resume Builder
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Column */}
                  <div className="lg:col-span-1 space-y-6">
                    <ProfileCard username={username} darkMode={darkMode} />
                    <div className={`rounded-xl shadow-md p-6 h-[400px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Weekly Activity</h3>
                      <div className="h-[300px]">
                        <ActivityChart username={username} darkMode={darkMode} />
                      </div>
                    </div>
                  </div>

                  {/* Data Column */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className={`rounded-xl shadow-md p-6 h-[400px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Code Language Distribution</h3>
                      <div className="h-[300px]">
                        <LanguageChart username={username} darkMode={darkMode} />
                      </div>
                    </div>

                    <div className={`rounded-xl shadow-md p-6 h-[300px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Repository Stats</h3>
                      <StatsGrid username={username} darkMode={darkMode} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Your Professional Resume</h3>
                    <button
                      onClick={handleDownloadResume}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md hover:shadow-lg transition-all"
                    >
                      <FiDownload />
                      <span>Download PDF</span>
                    </button>
                  </div>
                  <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="max-w-4xl mx-auto p-8 bg-white" ref={resumeRef}>
                      <ResumeOutput username={username} darkMode={darkMode} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className={`border-t mt-12 py-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`container mx-auto px-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>© {new Date().getFullYear()} GitHub Profile Insights. All data sourced from GitHub API.</p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

// Stat Card Component
const StatCard = ({ 
  icon, 
  label, 
  value, 
  isLoading, 
  darkMode 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  isLoading: boolean,
  darkMode: boolean
}) => (
  <motion.div 
    className={`p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}
    whileHover={{ y: -2 }}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
        {isLoading ? (
          <div className={`h-6 w-16 rounded animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        ) : (
          <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
        )}
      </div>
    </div>
  </motion.div>
);

export default App;