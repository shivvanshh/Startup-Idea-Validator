import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import IdeaCard from '../components/IdeaCard';
import { Loader2, FolderOpen, Edit3, PlusCircle, Sparkles, Layers, Eye, EyeOff, Archive } from 'lucide-react';

const tabs = [
  { key: 'all', label: 'All', icon: Layers },
  { key: 'Active', label: 'Active', icon: Eye },
  { key: 'Hidden', label: 'Hidden', icon: EyeOff },
  { key: 'Archived', label: 'Archived', icon: Archive },
];

const MyIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const res = await api.get('/ideas/my-ideas');
        setIdeas(res.data);
      } catch (err) {
        console.error('Failed to fetch personal ideas', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyIdeas();
  }, []);

  const filteredIdeas = activeTab === 'all' 
    ? ideas 
    : ideas.filter(i => i.visibility === activeTab);

  const activeCount = ideas.filter(i => i.visibility === 'Active').length;
  const hiddenCount = ideas.filter(i => i.visibility === 'Hidden').length;
  const archivedCount = ideas.filter(i => i.visibility === 'Archived').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/[0.08] border border-primary-500/15 mb-4">
            <Sparkles className="w-3 h-3 text-primary-400" />
            <span className="text-[11px] font-semibold text-primary-400 uppercase tracking-[0.15em]">Your Portfolio</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            My <span className="text-gradient">Ideas</span>
          </h1>
          <p className="text-white/25 mt-2 text-sm">Manage, edit, or hide your submissions.</p>
        </div>
        <Link to="/submit" className="btn-primary flex items-center space-x-2">
          <PlusCircle className="w-4 h-4" />
          <span>New Idea</span>
        </Link>
      </div>

      {/* Stat Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card px-4 py-3 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
            <Eye className="w-4 h-4 text-primary-400" />
          </div>
          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-wider font-semibold">Active</p>
            <p className="text-xl font-bold mono text-white">{activeCount}</p>
          </div>
        </div>
        <div className="glass-card px-4 py-3 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <EyeOff className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-wider font-semibold">Hidden</p>
            <p className="text-xl font-bold mono text-white">{hiddenCount}</p>
          </div>
        </div>
        <div className="glass-card px-4 py-3 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Archive className="w-4 h-4 text-white/30" />
          </div>
          <div>
            <p className="text-[10px] text-white/20 uppercase tracking-wider font-semibold">Archived</p>
            <p className="text-xl font-bold mono text-white">{archivedCount}</p>
          </div>
        </div>
      </div>

      {/* Tab Filters */}
      <div className="flex gap-1 mb-6 bg-white/[0.02] rounded-xl p-1 border border-white/[0.04] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
              activeTab === tab.key
                ? 'bg-primary-500/15 text-primary-400'
                : 'text-white/30 hover:text-white/50 hover:bg-white/[0.03]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="shimmer-line mb-6"></div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="relative">
            <div className="w-10 h-10 border-2 border-primary-500/20 rounded-full" />
            <div className="absolute inset-0 w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : filteredIdeas.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-24 glass-card rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-6 h-6 text-white/15" />
          </div>
          <h3 className="text-base font-semibold text-white/40 mb-1">
            {activeTab === 'all' ? 'No ideas yet' : `No ${activeTab.toLowerCase()} ideas`}
          </h3>
          <p className="text-white/20 text-sm mb-6">Got a concept? Share it with the community.</p>
          <Link to="/submit" className="btn-primary inline-flex items-center space-x-2">
            <PlusCircle className="w-4 h-4" /><span>Start Writing</span>
          </Link>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredIdeas.map((idea, index) => (
              <motion.div key={idea._id} layout
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: index * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative group">
                
                {idea.visibility !== 'Active' && (
                  <div className="absolute top-6 right-4 z-10">
                    <span className="text-[10px] font-semibold text-white/30 bg-white/5 px-2 py-0.5 rounded-md border border-white/[0.06]">
                      {idea.visibility}
                    </span>
                  </div>
                )}

                <Link to={`/edit/${idea._id}`}
                  className="absolute bottom-16 right-4 z-10 bg-primary-500 p-2 rounded-xl text-black hover:bg-primary-400 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 shadow-lg shadow-primary-500/20"
                  title="Edit">
                  <Edit3 className="w-3.5 h-3.5" />
                </Link>

                <div className={idea.visibility === 'Archived' ? 'opacity-40 grayscale' : ''}>
                  <IdeaCard idea={idea} onUpvote={() => {}} isUpvoting={true} index={index} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MyIdeas;
