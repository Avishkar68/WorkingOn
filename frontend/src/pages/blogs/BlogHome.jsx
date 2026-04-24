import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import SEO from '../../components/common/SEO';

const blogPosts = [
  {
    id: 'networking-for-spit-students',
    title: 'How to Network Effectively as an SPIT Student',
    excerpt: 'Networking is more than just collecting LinkedIn connections. Learn how to build meaningful relationships within the Sardar Patel Institute of Technology community.',
    date: 'April 20, 2026',
    readTime: '5 min read',
    category: 'Career',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'spit-internship-guide-2026',
    title: 'The Ultimate Guide to Internships for SPITians',
    excerpt: 'Finding the right internship can be tough. We’ve compiled a list of resources and tips specifically for students at SPIT Mumbai.',
    date: 'April 18, 2026',
    readTime: '8 min read',
    category: 'Internships',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'project-collaboration-tips',
    title: 'Success Secrets for Project Collaboration',
    excerpt: 'Building a great project requires more than just coding skills. Discover how to find the right teammates and manage your projects effectively on SPITConnect.',
    date: 'April 15, 2026',
    readTime: '6 min read',
    category: 'Collaboration',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
  }
];

const BlogHome = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#ededed] pt-24 pb-12 px-6">
      <SEO 
        title="SPITConnect Blog - Insights for SPIT Students" 
        description="Read the latest articles on networking, internships, and project collaboration specifically for Sardar Patel Institute of Technology (SPIT) students."
        keywords="SPIT blog, student networking SPIT, internship guide SPIT Mumbai, project tips for students"
      />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tighter mb-4"
          >
            SPITConnect <span className="text-brand-400">Blog</span>
          </motion.h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Insights, guides, and stories to help you navigate campus life and career growth at Sardar Patel Institute of Technology.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-[2rem] overflow-hidden group border border-white/5 hover:border-brand-500/20 transition-all flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-black text-brand-400 uppercase tracking-widest">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <Clock size={12} />
                    {post.readTime}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-brand-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                <Link 
                  to={`/blog/${post.id}`}
                  className="flex items-center gap-2 text-sm font-bold text-white group/link"
                >
                  Read More
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogHome;
