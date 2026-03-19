import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, ArrowRight, Sparkles, Users, Globe, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Users, text: 'Community feedback' },
  { icon: Globe, text: 'Global reach' },
  { icon: Lightbulb, text: 'Idea analytics' },
];

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password strength
  const getStrength = () => {
    const pwd = formData.password;
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.length >= 10) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return Math.min(s, 4);
  };
  const strength = getStrength();
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-emerald-400', 'bg-primary-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding with Mesh Gradient */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden glass-panel">
        <div className="absolute inset-0 mesh-bg" />

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[500px] h-[500px] rounded-full border border-white/[0.03] animate-spin-slow" />
          <div className="absolute inset-8 rounded-full border border-white/[0.04]" style={{ animation: 'spin 12s linear infinite reverse' }} />
          <div className="absolute inset-20 rounded-full border border-white/[0.03] animate-spin-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="flex items-center space-x-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-emerald-600 flex items-center justify-center shadow-glow-md">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold text-white">
              Idea<span className="text-gradient">Vault</span>
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Start building<br />
            <span className="text-gradient">the future</span>
          </h1>
          <p className="text-white/25 text-base leading-relaxed mb-10">
            Share your vision with the world. Get upvotes, feedback, and validation from a community of builders.
          </p>

          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/10 flex items-center justify-center">
                  <f.icon className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-sm text-white/40">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="mb-8">
            <div className="lg:hidden flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-emerald-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-base font-bold text-white">Idea<span className="text-gradient">Vault</span></span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Create an account</h2>
            <p className="text-white/25 text-sm">Join the community of builders</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/[0.06] text-red-400 p-3 rounded-xl mb-5 flex items-start space-x-2 text-sm border border-red-500/10">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                <input type="text" name="username" required value={formData.username} onChange={handleChange}
                  className="input-field pl-10" placeholder="startup_founder" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                <input type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="input-field pl-10" placeholder="you@startup.com" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                <input type="password" name="password" required value={formData.password} onChange={handleChange}
                  className="input-field pl-10" placeholder="••••••••" />
              </div>
              {/* Password strength bar */}
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                          i <= strength ? strengthColors[strength] : 'bg-white/[0.06]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-white/30">{strengthLabels[strength]}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/30 uppercase tracking-[0.1em] mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                  className="input-field pl-10" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className={`w-full btn-primary py-3 flex justify-center items-center mt-2 ${isLoading ? 'opacity-60' : ''}`}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center space-x-2 text-sm font-semibold">
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/20">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
