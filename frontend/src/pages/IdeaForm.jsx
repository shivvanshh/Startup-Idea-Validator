import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Save, Loader2, Sparkles, Info } from 'lucide-react';

const difficultyEmojis = ['🟢', '🟡', '🟠', '🔴', '⚫'];
const difficultyLabels = ['Easy', 'Moderate', 'Hard', 'Very Hard', 'Extreme'];
const marketOptions = ['Low', 'Medium', 'High', 'Very High'];
const marketBadgeStyles = {
  'Low': 'market-badge market-badge-low',
  'Medium': 'market-badge market-badge-medium',
  'High': 'market-badge market-badge-high',
  'Very High': 'market-badge market-badge-very-high',
};

const IdeaForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '', description: '', problemStatement: '',
    category: 'Tech', difficultyScore: 3, marketPotential: 'Medium',
    visibility: 'Active', expiresHours: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchIdea = async () => {
        try {
          const res = await api.get(`/ideas/${id}`);
          const idea = res.data;
          if (idea.author._id !== user?.id && idea.author !== user?.id) { navigate('/'); return; }
          setFormData({
            title: idea.title, description: idea.description, problemStatement: idea.problemStatement,
            category: idea.category, difficultyScore: idea.difficultyScore, marketPotential: idea.marketPotential,
            visibility: idea.visibility, expiresHours: '',
          });
        } catch (err) { setError('Failed to fetch idea'); }
        finally { setInitialLoading(false); }
      };
      fetchIdea();
    }
  }, [id, isEditing, user, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditing) {
        const { expiresHours, ...updateData } = formData;
        await api.put(`/ideas/${id}`, updateData);
        navigate('/my-ideas');
      } else {
        await api.post('/ideas', formData);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally { setLoading(false); }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center py-32"><Loader2 className="w-6 h-6 text-primary-500 animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16 page-enter">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-500/[0.08] border border-primary-500/15 mb-4">
            <Sparkles className="w-3 h-3 text-primary-400" />
            <span className="text-[11px] font-semibold text-primary-400 uppercase tracking-[0.15em]">
              {isEditing ? 'Edit Mode' : 'New Submission'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {isEditing ? 'Edit your idea' : 'Submit a new '}
            {!isEditing && <span className="text-gradient">idea</span>}
          </h1>
          <p className="text-white/25 mt-2 text-sm">
            {isEditing ? 'Update the details below.' : 'Be clear, concise, and compelling.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/[0.06] text-red-400 p-3 rounded-xl flex items-start space-x-2 text-sm border border-red-500/10">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2">Title <span className="text-red-400">*</span></label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange}
                className="input-field text-lg font-semibold" placeholder="e.g., Uber for Dog Walking" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  {['Tech','Health','Finance','Education','E-commerce','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2">Visibility</label>
                <select name="visibility" value={formData.visibility} onChange={handleChange} className="input-field">
                  <option value="Active">Public</option>
                  <option value="Hidden">Private</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex justify-between text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2">
                <span>Description <span className="text-red-400">*</span></span>
                <span className="text-white/15 normal-case">{formData.description.length}/300</span>
              </label>
              <textarea name="description" required maxLength={300} rows={2} value={formData.description} onChange={handleChange}
                className="input-field resize-none" placeholder="Brief overview of your startup." />
            </div>

            <div>
              <label className="flex justify-between text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2">
                <span>Problem Statement <span className="text-red-400">*</span></span>
                <span className="text-white/15 normal-case">{formData.problemStatement.length} chars</span>
              </label>
              <textarea name="problemStatement" required rows={3} value={formData.problemStatement} onChange={handleChange}
                className="input-field" placeholder="What problem are you solving?" />
            </div>

            {/* Difficulty — Emoji Scale */}
            <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
              <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-3">
                Difficulty Level
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficultyScore: val })}
                    className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-300 border ${
                      formData.difficultyScore === val
                        ? 'bg-primary-500/10 border-primary-500/25 shadow-glow-sm scale-105'
                        : 'border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08]'
                    }`}
                  >
                    <span className="text-xl">{difficultyEmojis[val - 1]}</span>
                    <span className={`text-[10px] font-semibold ${formData.difficultyScore === val ? 'text-primary-400' : 'text-white/20'}`}>
                      {difficultyLabels[val - 1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Market Potential — Badge Pills */}
            <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
              <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-3">
                Market Potential
              </label>
              <div className="flex gap-2">
                {marketOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({ ...formData, marketPotential: m })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                      formData.marketPotential === m
                        ? `${marketBadgeStyles[m]} border-transparent scale-105`
                        : 'text-white/30 border-white/[0.04] hover:bg-white/[0.04] hover:text-white/50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {!isEditing && (
              <div className="p-3 bg-orange-500/[0.03] rounded-xl border border-orange-500/[0.06]">
                <label className="block text-[11px] font-semibold text-orange-400/60 uppercase tracking-[0.1em] mb-2 flex items-center">
                  <Info className="w-3 h-3 mr-1.5" />Auto-Archive (hours, optional)
                </label>
                <input type="number" name="expiresHours" min="1" value={formData.expiresHours} onChange={handleChange}
                  className="input-field max-w-[160px]" placeholder="e.g. 24" />
              </div>
            )}

            <div className="shimmer-line"></div>

            <div className="flex justify-end space-x-3 pt-1">
              <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
              <button type="submit" disabled={loading}
                className={`btn-primary px-6 flex items-center space-x-2 ${loading ? 'opacity-60' : ''}`}>
                {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : (
                  <><Save className="w-4 h-4" /><span>{isEditing ? 'Save' : 'Submit'}</span></>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default IdeaForm;
