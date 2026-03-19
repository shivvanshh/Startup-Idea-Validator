import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, Eye, Clock, Zap, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const categoryColors = {
  Tech: { accent: '#3b82f6', glow: 'rgba(59, 130, 246, 0.08)', gradient: 'linear-gradient(90deg, #3b82f6, #60a5fa)' },
  Health: { accent: '#ef4444', glow: 'rgba(239, 68, 68, 0.08)', gradient: 'linear-gradient(90deg, #ef4444, #f87171)' },
  Finance: { accent: '#f59e0b', glow: 'rgba(245, 158, 11, 0.08)', gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
  Education: { accent: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.08)', gradient: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' },
  'E-commerce': { accent: '#ec4899', glow: 'rgba(236, 72, 153, 0.08)', gradient: 'linear-gradient(90deg, #ec4899, #f472b6)' },
  Other: { accent: '#6b7280', glow: 'rgba(107, 114, 128, 0.08)', gradient: 'linear-gradient(90deg, #6b7280, #9ca3af)' },
};

const difficultyColors = ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

const marketBadgeClass = {
  'Low': 'market-badge market-badge-low',
  'Medium': 'market-badge market-badge-medium',
  'High': 'market-badge market-badge-high',
  'Very High': 'market-badge market-badge-very-high',
};

const IdeaCard = ({ idea, onUpvote, isUpvoting, currentUserId, index = 0 }) => {
  const cat = categoryColors[idea.category] || categoryColors.Other;
  const hasUpvoted = idea.upvotes.includes(currentUserId);
  const diffScore = idea.difficultyScore;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="glow-card flex flex-col h-full group"
      style={{
        '--card-accent': cat.gradient,
        '--card-glow': cat.glow,
      }}
    >
      {/* Colored top accent */}
      <div className="h-[2px] w-full" style={{ background: cat.gradient, opacity: 0.6 }} />

      <div className="p-5 flex-grow">
        {/* Top: Category + Timer */}
        <div className="flex justify-between items-center mb-4">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-lg border"
            style={{
              color: cat.accent,
              background: `${cat.accent}12`,
              borderColor: `${cat.accent}20`,
            }}
          >
            {idea.category}
          </span>
          {idea.expiresAt && new Date(idea.expiresAt) > new Date() && (
            <span className="text-[10px] text-orange-400/70 font-medium flex items-center bg-orange-500/[0.06] px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 mr-1" />
              {formatDistanceToNow(new Date(idea.expiresAt))}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-semibold mb-2.5 text-white/90 line-clamp-2 leading-snug group-hover:text-white transition-colors duration-300">
          {idea.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-white/25 mb-5 line-clamp-3 leading-relaxed">
          {idea.description}
        </p>

        {/* Metrics Row */}
        <div className="flex items-center gap-4">
          {/* Difficulty dots */}
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3" style={{ color: difficultyColors[diffScore - 1] }} />
            <div className="flex gap-[3px]">
              {[1, 2, 3, 4, 5].map((d) => (
                <div
                  key={d}
                  className="diff-dot"
                  style={{
                    background: d <= diffScore ? difficultyColors[diffScore - 1] : 'rgba(255,255,255,0.06)',
                    boxShadow: d <= diffScore ? `0 0 6px ${difficultyColors[diffScore - 1]}40` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-3 bg-white/[0.06]"></div>

          {/* Market potential badge */}
          <span className={marketBadgeClass[idea.marketPotential] || 'market-badge market-badge-medium'}>
            {idea.marketPotential}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.04] flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Author */}
          {idea.author && (
            <div className="flex items-center space-x-1.5">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary-500/50 to-emerald-600/50 flex items-center justify-center">
                <span className="text-[7px] font-bold text-white">
                  {(idea.author.username || '?').charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-[11px] text-white/20 truncate max-w-[80px]">
                {idea.author.username || 'Anon'}
              </span>
            </div>
          )}
          <span className="flex items-center space-x-1 text-white/15">
            <Eye className="w-3 h-3" />
            <span className="text-[11px] mono">{idea.views || 0}</span>
          </span>
        </div>

        <button
          onClick={() => onUpvote(idea._id)}
          disabled={isUpvoting || !currentUserId}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 text-[11px] font-semibold ${
            hasUpvoted
              ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20 shadow-glow-sm'
              : 'text-white/20 hover:text-white/40 hover:bg-white/[0.04] border border-transparent'
          } ${!currentUserId ? 'cursor-not-allowed opacity-30' : 'cursor-pointer active:scale-90'}`}
        >
          <ThumbsUp className={`w-3 h-3 ${hasUpvoted ? 'fill-current' : ''}`} />
          <span className="mono">{idea.upvotes?.length || 0}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default IdeaCard;
