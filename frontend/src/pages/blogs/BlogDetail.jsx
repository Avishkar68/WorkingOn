import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import SEO from '../../components/common/SEO';

const blogContent = {
  'networking-for-spit-students': {
    title: 'How to Network Effectively as an SPIT Student',
    description: 'Learn how to build meaningful relationships within the Sardar Patel Institute of Technology community.',
    date: 'April 20, 2026',
    author: 'SPITConnect Team',
    readTime: '5 min read',
    category: 'Career',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200',
    content: `
      <p>Networking at Sardar Patel Institute of Technology (SPIT) is more than just attending events or adding people on LinkedIn. It's about building a community of peers and mentors who can support each other's growth.</p>
      
      <h2>1. Start with your Peers</h2>
      <p>Your classmates are your first network. Collaborate on projects, join study groups, and participate in campus hackathons. These relationships often lead to internal referrals and partnership opportunities later in your career.</p>
      
      <h2>2. Engage with Seniors</h2>
      <p>Seniors at SPIT have valuable insights into courses, internships, and placements. Don't be afraid to reach out to them on SPITConnect to ask for advice or guidance.</p>
      
      <h2>3. Utilize SPITConnect Communities</h2>
      <p>Join communities that align with your interests. Whether it's coding, entrepreneurship, or photography, being active in these groups helps you meet like-minded students across different branches and years.</p>
      
      <h2>Conclusion</h2>
      <p>Effective networking is about giving as much as you take. Be helpful, stay curious, and build genuine connections that last beyond your four years at SPIT.</p>
    `
  },
  'spit-internship-guide-2026': {
    title: 'The Ultimate Guide to Internships for SPITians',
    description: 'A comprehensive guide to finding and landing internships for students at Sardar Patel Institute of Technology.',
    date: 'April 18, 2026',
    author: 'SPITConnect Team',
    readTime: '8 min read',
    category: 'Internships',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
    content: `
      <p>Landing a quality internship is a crucial step for any student at SPIT Mumbai. Here's how you can prepare and apply effectively.</p>
      
      <h2>1. Perfect Your Portfolio</h2>
      <p>Showcase your projects on your SPITConnect profile. Highlight your role, the technologies used, and the impact of your work.</p>
      
      <h2>2. Leverage Campus Referrals</h2>
      <p>Many students at SPIT intern at top companies. Check the Opportunities section on SPITConnect for internal referrals and openings shared by fellow students.</p>
      
      <h2>3. Prepare for Interviews</h2>
      <p>Utilize the Academic Help section to find seniors who have interviewed at companies you're interested in. Their first-hand experience can be invaluable for your preparation.</p>
    `
  },
  'project-collaboration-tips': {
    title: 'Success Secrets for Project Collaboration',
    description: 'Discover how to find the right teammates and manage your projects effectively on SPITConnect.',
    date: 'April 15, 2026',
    author: 'SPITConnect Team',
    readTime: '6 min read',
    category: 'Collaboration',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
    content: `
      <p>Successful collaboration is the key to building great projects at Sardar Patel Institute of Technology. Here are our top tips for working together effectively.</p>
      
      <h2>1. Find the Right Match</h2>
      <p>Use SPITConnect's project section to find students with complementary skills. If you're a frontend dev, look for someone with backend or design expertise.</p>
      
      <h2>2. Set Clear Goals</h2>
      <p>Before you start coding, define the project's scope and individual responsibilities. Clear communication prevents misunderstandings and ensures steady progress.</p>
      
      <h2>3. Communicate Regularly</h2>
      <p>Stay in touch with your teammates through your community or messaging groups. Regular updates keep everyone on the same page and motivated.</p>
    `
  }
};

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogContent[id];

  if (!post) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#ededed] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-brand-400 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#ededed] pt-24 pb-12 px-6">
      <SEO 
        title={`${post.title} | SPITConnect Blog`} 
        description={post.description}
        type="article"
        image={post.image}
      />
      
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[10px] font-black text-brand-400 uppercase tracking-widest">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-3 py-6 border-y border-white/5">
            <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
              <User size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{post.author}</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Article Author</div>
            </div>
          </div>
        </header>
        
        <div className="rounded-[2.5rem] overflow-hidden mb-12 border border-white/10">
          <img 
            src={post.image} 
            alt={post.title}
            loading="lazy"
            className="w-full h-auto"
          />
        </div>
        
        <div 
          className="prose prose-invert prose-brand max-w-none 
          prose-h2:text-3xl prose-h2:font-black prose-h2:tracking-tighter prose-h2:mt-12 prose-h2:mb-6
          prose-p:text-gray-400 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <footer className="mt-16 pt-12 border-t border-white/5">
          <div className="glass-card p-10 rounded-[2.5rem] text-center border border-brand-500/20">
            <h3 className="text-2xl font-bold mb-4">Want more insights?</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Join the SPITConnect community to connect with peers, find opportunities, and grow your career at SPIT.
            </p>
            <Link 
              to="/register"
              className="inline-flex px-8 py-4 bg-brand-500 text-black font-black rounded-2xl hover:scale-105 transition-transform"
            >
              Join SPITConnect Now
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogDetail;
