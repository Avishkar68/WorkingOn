import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/common/SEO';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 text-[#ededed]">
      <SEO 
        title="404 - Page Not Found" 
        description="The page you are looking for does not exist on SPITConnect."
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-6">Oops! Page not found</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-10">
          The page you're looking for might have been moved, deleted, or never existed. 
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg shadow-teal-900/20"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </motion.div>
      
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-teal-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full -z-10" />
    </div>
  );
};

export default NotFound;
