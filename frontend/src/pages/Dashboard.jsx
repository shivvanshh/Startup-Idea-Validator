import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import IdeaCard from '../components/IdeaCard';
import FilterBar from '../components/FilterBar';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, BarChart3, Flame, ArrowUpRight, Sparkles, Clock, Rocket } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, suffix, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="glass-card p-5 flex flex-col justify-between group"
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ background: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="w-8 h-1 rounded-full opacity-30" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
    </div>
    <div>
      <p className="text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em] mb-1">{label}</p>
      <p className="text-3xl font-bold mono text-white tracking-tight stat-ticker">
        {value}
        {suffix && <span className="text-sm text-white/20 ml-0.5">{suffix}</span>}
      </p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    market: '',
    sortBy: 'newest'
  });
  
  const { user } = useAuth();

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      
      const res = await api.get(`/ideas?${queryParams.toString()}`);
      setIdeas(res.data);
    } catch (err) {
      console.error('Failed to fetch ideas', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => { fetchIdeas(); }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleUpvote = async (id) => {
    if (!user) return;
    setIdeas(ideas.map(idea => {
      if (idea._id === id) {
        const hasUpvoted = idea.upvotes.includes(user.id);
        return {
          ...idea,
          upvotes: hasUpvoted 
            ? idea.upvotes.filter(u => u !== user.id)
            : [...idea.upvotes, user.id]
        };
      }
      return idea;
    }));
    try {
      await api.put(`/ideas/${id}/upvote`);
    } catch (err) {
      fetchIdeas();
    }
  };

  const totalIdeas = ideas.length;
  const avgDifficulty = totalIdeas > 0 
    ? (ideas.reduce((acc, curr) => acc + curr.difficultyScore, 0) / totalIdeas).toFixed(1) 
    : 0;
  
  const getMostCommonCategory = () => {
    if (ideas.length === 0) return 'N/A';
    const counts = ideas.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const totalUpvotes = ideas.reduce((acc, curr) => acc + (curr.upvotes?.length || 0), 0);

  // Get the featured idea (most upvoted)
  const featuredIdea = ideas.length > 0 
    ? [...ideas].sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0))[0]
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 page-enter">
      {/* ─── Decorative Orbs ────────────────────────── */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="orb w-[500px] h-[500px] bg-primary-500/[0.04] -top-32 -left-32 animate-float" />
        <div className="orb w-[400px] h-[400px] bg-blue-500/[0.03] top-1/4 -right-32" style={{ animationDelay: '2s' }} />
        <div className="orb w-[300px] h-[300px] bg-purple-500/[0.03] bottom-0 left-1/4" style={{ animationDelay: '4s' }} />
      </div>

      {/* ─── Hero Section ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary-500/[0.08] border border-primary-500/15 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Dashboard</span>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4">
          Startup Idea<br />
          <span className="text-gradient">Validator</span>
        </h1>
        <p className="text-white/25 text-base max-w-lg mx-auto leading-relaxed">
          Submit, discover, and validate startup ideas. See what the community thinks of your next big thing.
        </p>
      </motion.div>

      {/* ─── Stats Grid ───────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard icon={TrendingUp} label="Total Ideas" value={totalIdeas} color="#22c55e" delay={0.1} />
        <StatCard icon={BarChart3} label="Avg Difficulty" value={avgDifficulty} suffix="/5" color="#3b82f6" delay={0.15} />
        <StatCard icon={Flame} label="Top Category" value={getMostCommonCategory()} color="#f97316" delay={0.2} />
        <StatCard icon={ArrowUpRight} label="Total Upvotes" value={totalUpvotes} color="#a855f7" delay={0.25} />
      </div>

      {/* ─── Featured Idea ────────────────────────── */}
      {featuredIdea && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card p-6 md:p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 via-emerald-400 to-teal-500" />
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-emerald-500/20 border border-primary-500/10 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary-400" />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider">🔥 Featured Idea</span>
                <span className="text-[10px] font-semibold text-white/15 uppercase tracking-wider">— {featuredIdea.category}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 truncate">{featuredIdea.title}</h3>
              <p className="text-sm text-white/25 line-clamp-1">{featuredIdea.description}</p>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold mono text-primary-400">{featuredIdea.upvotes?.length || 0}</p>
                <p className="text-[10px] text-white/20 uppercase tracking-wider">Upvotes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold mono text-white/60">{featuredIdea.views || 0}</p>
                <p className="text-[10px] text-white/20 uppercase tracking-wider">Views</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Shimmer Divider ─────────────────────── */}
      <div className="shimmer-line mb-6"></div>

      {/* ─── Filters ─────────────────────────────── */}
      <FilterBar filters={filters} setFilters={setFilters} />

      {/* ─── Ideas Grid ──────────────────────────── */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="relative">
            <div className="w-10 h-10 border-2 border-primary-500/20 rounded-full" />
            <div className="absolute inset-0 w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      ) : ideas.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-24 glass-card rounded-2xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-white/15" />
          </div>
          <h3 className="text-base font-semibold text-white/40">No ideas found</h3>
          <p className="text-white/20 mt-1 text-sm">Try adjusting your search or filters.</p>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {ideas.map((idea, index) => (
              <IdeaCard 
                key={idea._id} 
                idea={idea} 
                onUpvote={handleUpvote}
                currentUserId={user?.id}
                isUpvoting={false}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
