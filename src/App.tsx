import { useEffect, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useRaceStore } from './stores/raceStore';
import { api, User, Car, LeaderboardEntry, Mission } from './lib/api';

/* ─────────────── Shared Components ─────────────── */

function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div className={`${s} border-2 border-primary/30 border-t-primary rounded-full animate-spin`} />
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center animate-slide-up">
        <div className="text-7xl animate-float mb-4">&#x1F3CE;&#xFE0F;</div>
        <Spinner size="lg" />
        <p className="text-gray-400 mt-4 font-mono text-sm">Loading...</p>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center py-12 animate-slide-up">
      <span className="text-6xl block mb-4 opacity-40">{icon}</span>
      <p className="text-gray-400 text-lg">{title}</p>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

function StatCard({ label, value, color = 'text-primary', icon }: { label: string; value: string | number; color?: string; icon?: string }) {
  return (
    <div className="glass-card p-4 text-center group hover:border-primary/30 transition-all duration-300">
      {icon && <span className="text-xl block mb-1">{icon}</span>}
      <p className={`text-2xl font-bold ${color} font-mono`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function ProgressBar({ value, max, color = 'from-primary to-secondary', glow = false }: { value: number; max: number; color?: string; glow?: boolean }) {
  const pct = Math.min((value / (max || 1)) * 100, 100);
  return (
    <div className="h-2 bg-dark-400 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 ease-out ${glow ? 'shadow-[0_0_10px_rgba(99,102,241,0.5)]' : ''}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function getRarityClass(rarity: string): string {
  switch (rarity) {
    case 'common': return 'border-gray-500 text-gray-400';
    case 'uncommon': return 'border-green-500 text-green-400';
    case 'rare': return 'border-blue-500 text-blue-400';
    case 'epic': return 'border-purple-500 text-purple-400';
    case 'legendary': return 'border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
    default: return 'border-gray-500 text-gray-400';
  }
}

function getRarityBg(rarity: string): string {
  switch (rarity) {
    case 'common': return 'from-gray-500/10 to-transparent';
    case 'uncommon': return 'from-green-500/10 to-transparent';
    case 'rare': return 'from-blue-500/10 to-transparent';
    case 'epic': return 'from-purple-500/10 to-transparent';
    case 'legendary': return 'from-amber-500/10 to-transparent';
    default: return 'from-gray-500/10 to-transparent';
  }
}

/* ─────────────── Header ─────────────── */

function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/garage', label: 'Garage', icon: '&#x1F697;' },
    { to: '/shop', label: 'Shop', icon: '&#x1F6D2;' },
    { to: '/leaderboard', label: 'Ranks', icon: '&#x1F3C6;' },
    { to: '/friends', label: 'Friends', icon: '&#x1F465;' },
    { to: '/teams', label: 'Teams', icon: '&#x1F91D;' },
    { to: '/classroom', label: 'Class', icon: '&#x1F393;' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0"
      style={{ borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:animate-float">&#x1F3CE;&#xFE0F;</span>
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary-light via-secondary to-accent bg-clip-text text-transparent">
              TypeRush
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className="relative px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 group">
                <span>{l.label}</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center gap-1.5 bg-dark-300/80 px-3 py-1.5 rounded-full text-sm">
                  <span className="text-yellow-400 font-bold font-mono">{(user.cash || 0).toLocaleString()}</span>
                  <span className="text-yellow-400">&#x1FA99;</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-dark-300/80 px-3 py-1.5 rounded-full text-sm">
                  <span className="text-purple-400 font-bold font-mono">{user.gems || 0}</span>
                  <span className="text-purple-400">&#x1F48E;</span>
                </div>
                <button onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors">
                  <span className="text-lg">{user.avatar}</span>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-[10px] text-gray-500">Lv.{user.level}</p>
                  </div>
                </button>
                <button onClick={logout}
                  className="text-gray-500 hover:text-red-400 text-xs transition-colors hidden sm:block">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">Sign Up</Link>
              </>
            )}
            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-400 hover:text-white p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 animate-slide-up">
            <div className="grid grid-cols-3 gap-2">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                  className="glass-card-hover p-3 text-center text-sm text-gray-300">
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

/* ─────────────── Login Page ─────────────── */

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, guestLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(username, password);
    if (success) { navigate('/'); } else { setError('Invalid credentials'); }
    setLoading(false);
  };

  const handleGuest = async () => {
    setLoading(true);
    await guestLogin();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <span className="text-7xl block animate-float">&#x1F3CE;&#xFE0F;</span>
          <h1 className="font-display text-4xl font-bold mt-4 bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">Sign in to continue racing</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all"
              required />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all"
              required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full btn-primary !py-3.5 text-lg disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" /><span className="text-gray-600 text-sm">or</span><div className="flex-1 h-px bg-white/10" />
          </div>
          <button onClick={handleGuest} disabled={loading}
            className="w-full btn-neon !py-3 flex items-center justify-center gap-2 disabled:opacity-50">
            &#x26A1; Play as Guest
          </button>
          <p className="text-gray-500 text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-light transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Register Page ─────────────── */

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (username.length < 3) { setError('Username must be at least 3 characters'); setLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
    const success = await register(username, email, password);
    if (success) { navigate('/'); } else { setError('Registration failed. Username may be taken.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-pattern p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <span className="text-7xl block animate-float">&#x1F3CE;&#xFE0F;</span>
          <h1 className="font-display text-4xl font-bold mt-4 bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            Join TypeRush
          </h1>
          <p className="text-gray-500 mt-2">Create your account and start racing</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm animate-shake">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              required minLength={3} maxLength={20} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              required />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              required minLength={6} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full btn-primary !py-3.5 text-lg disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-light transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

/* ─────────────── Home Page ─────────────── */

function HomePage() {
  const { user, isAuthenticated, refreshUser } = useAuthStore();
  const { quickMatch, isSearching, room, createRoom } = useRaceStore();
  const navigate = useNavigate();
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);

  useEffect(() => { if (room) navigate('/race'); }, [room, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      api.getLeaderboard().then(r => {
        if (r) {
          const resp = r as { leaderboard?: LeaderboardEntry[] };
          const entries = resp.leaderboard || [];
          setTopPlayers(entries.slice(0, 5));
        }
      });
    }
  }, [isAuthenticated]);

  const claimDailyReward = async () => { await api.getDailyReward(); refreshUser(); };

  const handleQuickMatch = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    quickMatch();
  };

  const handleJoinRoom = () => {
    if (!joinCode.trim()) return;
    navigate(`/race/${joinCode.toUpperCase()}`);
    setShowJoinDialog(false);
  };

  const xpProgress = user ? ((user.xp || 0) % 500) / 5 : 0;

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 animate-slide-up">

          {/* ── Left: Race Controls ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Hero Race Card */}
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

              {isAuthenticated && user ? (
                <div className="flex items-center gap-5 mb-8">
                  <div className="text-5xl animate-float">{user.selectedCar ? '&#x1F3CE;&#xFE0F;' : user.avatar}</div>
                  <div>
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-sm text-gray-400">
                      Level {user.level} &middot; {user.league} &middot; {user.title || 'Racer'}
                    </p>
                    <div className="mt-2 w-48">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>XP</span>
                        <span>{(user.xp || 0).toLocaleString()}</span>
                      </div>
                      <ProgressBar value={xpProgress} max={100} glow />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 text-center py-6">
                  <p className="text-gray-400 mb-3">Sign in to race against others!</p>
                  <Link to="/login" className="btn-primary inline-block">Login / Sign Up</Link>
                </div>
              )}

              {/* Big Race Buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <button onClick={handleQuickMatch} disabled={isSearching || !isAuthenticated}
                  className="relative py-5 px-6 rounded-2xl font-display font-bold text-xl bg-gradient-to-r from-accent to-accent-dark text-white disabled:opacity-40 transition-all duration-300 hover:scale-[1.02] animate-glow-pulse overflow-hidden group"
                  style={{ boxShadow: '0 0 30px rgba(244,63,94,0.3)' }}>
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSearching ? (
                      <><Spinner size="sm" /> Searching...</>
                    ) : (
                      <>&#x26A1; RACE NOW</>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>

                <button onClick={() => isAuthenticated ? createRoom() : navigate('/login')} disabled={!isAuthenticated}
                  className="py-5 px-6 rounded-2xl font-display font-bold text-xl bg-gradient-to-r from-primary to-primary-dark text-white disabled:opacity-40 transition-all duration-300 hover:scale-[1.02]"
                  style={{ boxShadow: '0 0 20px rgba(99,102,241,0.25)' }}>
                  &#x1F3C1; Create Room
                </button>
              </div>

              <button onClick={() => setShowJoinDialog(true)} disabled={!isAuthenticated}
                className="w-full mt-4 btn-neon !py-3 disabled:opacity-40">
                &#x1F517; Join Private Room
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="glass-card p-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-medium">Quick Actions</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { to: '/practice', icon: '&#x1F3AF;', label: 'Practice' },
                  { to: '/achievements', icon: '&#x1F3C5;', label: 'Badges' },
                  { to: '/missions', icon: '&#x1F4CB;', label: 'Missions' },
                  { to: '/stats', icon: '&#x1F4CA;', label: 'Stats' },
                  { to: '/shop', icon: '&#x1F381;', label: 'Mystery Box' },
                  { to: '/settings', icon: '&#x2699;&#xFE0F;', label: 'Settings' },
                ].map(a => (
                  <Link key={a.to} to={a.to}
                    className="glass-card-hover p-4 text-center group">
                    <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform"
                      dangerouslySetInnerHTML={{ __html: a.icon }} />
                    <span className="text-[11px] text-gray-400 group-hover:text-white transition-colors">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            {isAuthenticated && user && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Level" value={user.level} color="text-primary-light" icon="&#x1F31F;" />
                <StatCard label="Best WPM" value={user.highestWPM || 0} color="text-neon-green" icon="&#x26A1;" />
                <StatCard label="Races" value={user.totalRaces || 0} color="text-secondary" icon="&#x1F3C1;" />
                <StatCard label="Streak" value={`${user.streak || 0}&#x1F525;`} color="text-orange-400" icon="&#x1F525;" />
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-6">

            {/* Daily Streak */}
            {isAuthenticated && user && (
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider font-medium">Daily Streak</h3>
                  <button onClick={claimDailyReward}
                    className="text-xs bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg transition-colors font-medium">
                    &#x1F381; Claim
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl animate-float">&#x1F525;</div>
                  <div>
                    <p className="text-3xl font-bold text-orange-400 font-mono">{user.streak || 0}</p>
                    <p className="text-xs text-gray-500">
                      day{(user.streak || 0) !== 1 ? 's' : ''} &middot; {Math.min(1 + (user.streak || 0) * 0.1, 3).toFixed(1)}x multiplier
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Top Racers */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider font-medium">Top Racers</h3>
                <Link to="/leaderboard" className="text-xs text-primary hover:text-primary-light transition-colors">View All</Link>
              </div>
              <div className="space-y-2">
                {topPlayers.map((player, i) => (
                  <div key={player.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-200/50 hover:bg-dark-200 transition-colors animate-slide-in-right"
                    style={{ animationDelay: `${i * 50}ms` }}>
                    <span className="text-lg w-6 text-center font-bold">
                      {i === 0 ? '&#x1F947;' : i === 1 ? '&#x1F948;' : i === 2 ? '&#x1F949;' : `${i + 1}`}
                    </span>
                    <span className="text-lg">{player.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{player.username}</p>
                      <p className="text-[10px] text-gray-500">{player.highestWPM} WPM</p>
                    </div>
                    <span className="text-xs text-primary font-mono">{(player.xp || 0).toLocaleString()}</span>
                  </div>
                ))}
                {topPlayers.length === 0 && <EmptyState icon="&#x1F3C6;" title="Loading leaderboard..." />}
              </div>
            </div>

            {/* Navigate */}
            <div className="glass-card p-5">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-3">Navigate</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { to: '/garage', icon: '&#x1F697;', label: 'Garage' },
                  { to: '/shop', icon: '&#x1F6D2;', label: 'Shop' },
                  { to: '/profile', icon: '&#x1F464;', label: 'Profile' },
                ].map(n => (
                  <Link key={n.to} to={n.to} className="glass-card-hover p-3 text-center group">
                    <span className="text-xl block mb-1" dangerouslySetInnerHTML={{ __html: n.icon }} />
                    <span className="text-[11px] text-gray-400 group-hover:text-white transition-colors">{n.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Room Dialog */}
      {showJoinDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowJoinDialog(false)}>
          <div className="glass-card p-8 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-display font-bold mb-4 text-center">Join Room</h3>
            <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ROOM CODE"
              className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-4 text-center text-3xl font-mono uppercase tracking-[0.3em] focus:outline-none focus:border-primary transition-all"
              maxLength={6} autoFocus />
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowJoinDialog(false)}
                className="flex-1 bg-dark-400 hover:bg-dark-300 py-3 rounded-xl font-medium transition-colors">Cancel</button>
              <button onClick={handleJoinRoom}
                className="flex-1 btn-primary">Join</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Race Page ─────────────── */

function RacePage() {
  const {
    room, roomId, isCountdown, countdown, isRacing, text, currentIndex, errors,
    wpm, accuracy, finished, result, rewards, players, errorAtIndex,
    handleKeyPress, leaveRoom, reset, startRace, cleanupSocketListeners, joinRoom,
  } = useRaceStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const params = useParams();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!room && params.roomId) {
      joinRoom(params.roomId);
    } else if (!room && !params.roomId) {
      navigate('/');
    }
  }, [room, params.roomId, joinRoom, navigate]);

  useEffect(() => { return () => { cleanupSocketListeners(); }; }, [cleanupSocketListeners]);

  useEffect(() => {
    if (!isRacing || finished) return;
    const interval = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRacing, finished]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isRacing || finished) return;
      if (e.key === 'Backspace') { e.preventDefault(); handleKeyPress('Backspace'); return; }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); handleKeyPress(e.key); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isRacing, finished, handleKeyPress]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const playerList = Object.values(players);
  const progress = text.length > 0 ? Math.round((currentIndex / text.length) * 100) : 0;

  if (!room) return null;

  /* Countdown overlay */
  if (isCountdown) {
    return (
      <div className="min-h-screen bg-hero-pattern flex items-center justify-center">
        <div className="text-center animate-slide-up">
          <div className="text-[10rem] font-display font-bold text-primary text-glow leading-none"
            style={{ animation: 'glow-pulse 0.5s ease-in-out' }}>
            {countdown === 0 ? 'GO!' : countdown}
          </div>
          <p className="text-gray-500 mt-6 font-mono text-sm tracking-wider">GET READY TO TYPE</p>
        </div>
      </div>
    );
  }

  /* Race finished */
  if (finished) {
    const sortedPlayers = playerList.filter(p => p.finished).sort((a, b) => (a.place || 99) - (b.place || 99));
    return (
      <div className="min-h-screen bg-hero-pattern flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-lg w-full animate-slide-up">
          <div className="text-center mb-6">
            <div className="text-7xl mb-3">&#x1F3C6;</div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text text-transparent">
              Race Complete!
            </h1>
            {result && (
              <p className="text-gray-400 mt-1">
                You finished <span className="text-gold font-bold">#{result.place}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="WPM" value={result?.wpm || wpm} color="text-neon-green" />
            <StatCard label="Accuracy" value={`${result?.accuracy || accuracy}%`} color="text-primary-light" />
            <StatCard label="Time" value={fmt(elapsedTime)} color="text-orange-400" />
          </div>

          {rewards && (
            <div className="flex justify-center gap-8 mb-6 animate-slide-in-right">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400 font-mono">+{rewards.xp}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400 font-mono">+{rewards.cash}</p>
                <p className="text-xs text-gray-500">Coins</p>
              </div>
            </div>
          )}

          {/* Podium */}
          {sortedPlayers.length > 0 && (
            <div className="space-y-2 mb-6">
              {sortedPlayers.map(p => (
                <div key={p.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                  p.id === user?.id ? 'bg-primary/10 border border-primary/30' : 'bg-dark-200/50'}`}>
                  <span className="text-yellow-400 font-bold font-mono w-8">#{p.place}</span>
                  <span>{p.car.emoji}</span>
                  <span className="flex-1 text-sm font-medium">{p.username}</span>
                  <span className="text-neon-green text-sm font-mono">{p.wpm} WPM</span>
                  <span className="text-gray-500 text-sm font-mono">{p.accuracy}%</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={() => { reset(); navigate('/'); }}
              className="flex-1 bg-dark-400 hover:bg-dark-300 py-3.5 rounded-xl font-bold transition-colors">
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Main race view */
  return (
    <div className="min-h-screen bg-hero-pattern">
      <div className="max-w-5xl mx-auto p-4 animate-slide-up">

        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2">
              <p className="text-[10px] text-gray-500 uppercase">Room</p>
              <p className="font-mono font-bold text-primary text-sm">{roomId || room.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-neon-green font-mono text-glow-sm" style={{ color: '#00ff88' }}>{wpm}</p>
              <p className="text-[10px] text-gray-500 uppercase">WPM</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-light font-mono">{accuracy}%</p>
              <p className="text-[10px] text-gray-500 uppercase">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400 font-mono">{fmt(elapsedTime)}</p>
              <p className="text-[10px] text-gray-500 uppercase">Time</p>
            </div>
            <button onClick={() => { leaveRoom(); navigate('/'); }}
              className="text-gray-500 hover:text-red-400 transition-colors text-sm">&#x2715; Leave</button>
          </div>
        </div>

        {/* Race Tracks */}
        {playerList.length > 0 && (
          <div className="space-y-2 mb-6">
            {playerList.map(player => {
              const isMe = player.id === user?.id;
              const prog = player.progress || (isMe ? currentIndex / (text.length || 1) : 0);
              return (
                <div key={player.id}
                  className={`race-track p-3 ${isMe ? 'border-primary/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : ''}`}>
                  <div className="relative z-10 flex items-center gap-3 mb-1.5">
                    <span className={`text-sm font-medium ${isMe ? 'text-primary-light' : 'text-gray-400'}`}>
                      {player.username}{isMe ? ' (You)' : ''}{player.isBot ? ' [BOT]' : ''}
                    </span>
                    {player.finished && <span className="text-xs text-gold font-bold">#{player.place}</span>}
                    <span className="ml-auto text-xs text-gray-500 font-mono">{player.wpm} WPM</span>
                  </div>
                  <div className="relative z-10 h-8 bg-dark-200/60 rounded-lg overflow-hidden">
                    <div className={`h-full rounded-lg transition-all duration-300 flex items-center justify-end pr-1 ${
                      isMe ? 'bg-gradient-to-r from-accent/80 to-neon-green/60' : 'bg-gradient-to-r from-blue-600/60 to-cyan-500/40'
                    }`} style={{ width: `${Math.max(prog * 100, 3)}%` }}>
                      <span className="text-lg animate-car-drive">{player.car.emoji}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Waiting State */}
        {room.status === 'waiting' && (
          <div className="glass-card p-8 text-center">
            <p className="text-gray-400 mb-4 font-mono text-sm">Waiting for players...</p>
            <div className="flex gap-2 justify-center mb-6 flex-wrap">
              {(room.players || playerList).map(player => (
                <div key={player.id} className="glass-card px-4 py-2 flex items-center gap-2">
                  <span>{player.car?.emoji || '&#x1F697;'}</span>
                  <span className="text-sm">{player.username}</span>
                </div>
              ))}
            </div>
            {user && (room.players?.[0]?.id === user.id || playerList[0]?.id === user.id) && (
              <button onClick={() => startRace()}
                className="btn-accent !py-3.5 !px-10 text-lg font-display">
                &#x1F680; Start Race
              </button>
            )}
          </div>
        )}

        {/* Typing Area */}
        {(room.status === 'racing' || isRacing) && (
          <>
            <div className="glass-card p-6 mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Type the text below</p>
                <span className="text-xs text-primary font-mono">{progress}%</span>
              </div>
              <ProgressBar value={currentIndex} max={text.length || 1} color="from-accent to-neon-green" glow />

              <div className="bg-dark-100 rounded-xl p-6 mt-4 font-mono text-xl leading-relaxed">
                {(text || '').split('').map((char, i) => (
                  <span key={i} className={
                    i < currentIndex ? 'char-correct' :
                    i === currentIndex && errorAtIndex ? 'char-error animate-shake' :
                    i === currentIndex ? 'char-current' :
                    'char-pending'
                  }>{char}</span>
                ))}
              </div>

              {errorAtIndex && (
                <p className="text-red-400 text-center mt-4 text-sm font-medium animate-shake">
                  &#x26A0;&#xFE0F; Wrong character! Press <kbd className="bg-dark-400 px-2 py-0.5 rounded text-xs mx-1">Backspace</kbd> to fix.
                </p>
              )}
              {errors > 0 && (
                <p className="text-center mt-2 text-xs text-red-400/60">{errors} error{errors !== 1 ? 's' : ''}</p>
              )}
            </div>

            <div className="glass-card p-3 text-center">
              <p className="text-gray-500 text-sm">&#x1F3CE;&#xFE0F; Type to race! Your car moves as you type correctly.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Practice Page ─────────────── */

function PracticePage() {
  const [practiceText, setPracticeText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [wpmVal, setWpmVal] = useState(0);
  const [accuracyVal, setAccuracyVal] = useState(100);
  const [errorAtCurrent, setErrorAtCurrent] = useState(false);

  const TEXTS = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz.",
    "The five boxing wizards jump quickly at dawn.",
    "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent.",
  ];

  useEffect(() => { setPracticeText(TEXTS[Math.floor(Math.random() * TEXTS.length)]); }, []);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (finished || !practiceText) return;
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (errorAtCurrent) setErrorAtCurrent(false);
      return;
    }
    if (errorAtCurrent) return;
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (!startTime) setStartTime(Date.now());
      if (e.key === practiceText[currentIndex]) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        const elapsed = (Date.now() - (startTime || Date.now())) / 60000;
        setWpmVal(elapsed > 0 ? Math.round((newIndex / 5) / elapsed) : 0);
        setAccuracyVal(Math.round((newIndex / (newIndex + errors)) * 100));
        if (newIndex >= practiceText.length) setFinished(true);
      } else {
        setErrors(e2 => e2 + 1);
        setErrorAtCurrent(true);
      }
    }
  }, [finished, practiceText, currentIndex, startTime, errors, errorAtCurrent]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const doReset = () => {
    setPracticeText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
    setCurrentIndex(0); setErrors(0); setWpmVal(0); setAccuracyVal(100);
    setStartTime(null); setFinished(false); setErrorAtCurrent(false);
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold text-center mb-2">Practice Mode</h1>
        <p className="text-center text-gray-500 text-sm mb-8">Improve your typing speed</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="WPM" value={wpmVal} color="text-neon-green" />
          <StatCard label="Accuracy" value={`${accuracyVal}%`} color="text-primary-light" />
          <StatCard label="Errors" value={errors} color="text-red-400" />
        </div>

        <div className="glass-card p-6">
          <ProgressBar value={currentIndex} max={practiceText.length || 1} color="from-accent to-neon-green" glow />
          <div className="bg-dark-100 rounded-xl p-6 mt-4 font-mono text-xl leading-relaxed">
            {practiceText.split('').map((char, i) => (
              <span key={i} className={
                i < currentIndex ? 'char-correct' :
                i === currentIndex && errorAtCurrent ? 'char-error animate-shake' :
                i === currentIndex ? 'char-current' :
                'char-pending'
              }>{char}</span>
            ))}
          </div>
          {errorAtCurrent && (
            <p className="text-red-400 text-center mt-4 text-sm font-medium animate-shake">
              Press <kbd className="bg-dark-400 px-2 py-0.5 rounded text-xs mx-1">Backspace</kbd> to fix
            </p>
          )}
        </div>

        {finished && (
          <div className="mt-8 text-center animate-slide-up">
            <h2 className="text-2xl font-display font-bold text-neon-green mb-4">Practice Complete!</h2>
            <button onClick={doReset} className="btn-primary text-lg">Practice Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Shop Page ─────────────── */

function ShopPage() {
  const { refreshUser } = useAuthStore();
  const [shopData, setShopData] = useState<{ dailyItems: Car[]; featuredItems: Car[]; userCoins: number; userGems: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [mysteryResult, setMysteryResult] = useState<string | null>(null);

  useEffect(() => { loadShop(); }, []);

  const loadShop = async () => {
    const response = await api.getShop();
    if (response) setShopData(response as { dailyItems: Car[]; featuredItems: Car[]; userCoins: number; userGems: number });
    setLoading(false);
  };

  const handleBuy = async (car: Car) => {
    if ((shopData?.userCoins || 0) < car.price) { alert('Not enough coins!'); return; }
    setBuying(car.id);
    const response = await api.buyCar(car.id);
    if (response) { await loadShop(); refreshUser(); }
    setBuying(null);
  };

  const openMysteryBox = async () => {
    setBuying('mystery');
    const result = await api.openMysteryBox();
    if (result) {
      setMysteryResult(`You got: ${result.rewardType} - ${result.rewardValue}${result.car ? ` (${result.car.name})` : ''}`);
      await loadShop();
      refreshUser();
    }
    setBuying(null);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-6xl mx-auto px-4 animate-slide-up">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="font-display text-3xl font-bold">Shop</h1>
          <div className="flex items-center gap-3">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <span className="text-yellow-400">&#x1FA99;</span>
              <span className="text-yellow-400 font-bold font-mono">{(shopData?.userCoins || 0).toLocaleString()}</span>
            </div>
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <span className="text-purple-400">&#x1F48E;</span>
              <span className="text-purple-400 font-bold font-mono">{shopData?.userGems || 0}</span>
            </div>
          </div>
        </div>

        {/* Mystery Box */}
        <div className="glass-card p-6 mb-8 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 to-transparent" />
          <div className="relative z-10">
            <div className="text-6xl mb-3 group-hover:animate-shake cursor-pointer inline-block">&#x1F381;</div>
            <h2 className="font-display text-xl font-bold mb-2">Mystery Box</h2>
            <p className="text-gray-500 text-sm mb-4">Try your luck! Could contain rare cars and coins.</p>
            <button onClick={openMysteryBox} disabled={buying === 'mystery'}
              className="btn-accent inline-flex items-center gap-2 disabled:opacity-50">
              {buying === 'mystery' ? <Spinner size="sm" /> : null}
              Open for &#x1FA99; 500
            </button>
            {mysteryResult && (
              <p className="mt-3 text-neon-green text-sm animate-slide-up">{mysteryResult}</p>
            )}
          </div>
        </div>

        {/* Featured Items */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-yellow-400">&#x2B50;</span> Featured
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {(shopData?.featuredItems || []).map(car => (
            <div key={car.id}
              className={`glass-card border-2 ${getRarityClass(car.rarity)} p-6 bg-gradient-to-br ${getRarityBg(car.rarity)} hover:scale-[1.02] transition-all duration-300`}>
              <div className="text-center mb-4">
                <span className="text-7xl block mb-3">{car.emoji}</span>
                <h3 className="font-bold text-lg">{car.name}</h3>
                <span className={`text-xs uppercase tracking-wider ${getRarityClass(car.rarity)}`}>{car.rarity}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-dark-200/50 p-2.5 rounded-lg text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Speed</p>
                  <p className="font-bold font-mono">{car.speed}/10</p>
                </div>
                <div className="bg-dark-200/50 p-2.5 rounded-lg text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Accel</p>
                  <p className="font-bold font-mono">{car.acceleration}/10</p>
                </div>
              </div>
              <button onClick={() => handleBuy(car)} disabled={buying === car.id}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {buying === car.id ? <Spinner size="sm" /> : <>&#x1FA99; {(car.price || 0).toLocaleString()}</>}
              </button>
            </div>
          ))}
        </div>

        {/* Daily Deals */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>&#x1F4E6;</span> Daily Deals
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(shopData?.dailyItems || []).map(car => (
            <div key={car.id} className={`glass-card-hover border ${getRarityClass(car.rarity)} p-4`}>
              <div className="text-center mb-3">
                <span className="text-4xl block mb-1">{car.emoji}</span>
                <p className="font-bold text-sm">{car.name}</p>
                <span className={`text-[10px] uppercase ${getRarityClass(car.rarity)}`}>{car.rarity}</span>
              </div>
              <button onClick={() => handleBuy(car)} disabled={buying === car.id}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold py-2 rounded-lg text-sm disabled:opacity-50 flex items-center justify-center gap-1">
                {buying === car.id ? <Spinner size="sm" /> : <>&#x1FA99; {(car.price || 0).toLocaleString()}</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Garage Page ─────────────── */

function GaragePage() {
  const { user, refreshUser } = useAuthStore();
  const [ownedCars, setOwnedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadGarage(); }, []);

  const loadGarage = async () => {
    const response = await api.getGarage();
    if (response) setOwnedCars((response as { ownedCars: Car[] }).ownedCars || []);
    setLoading(false);
  };

  const handleSelect = async (carId: string) => { await api.selectCar(carId); refreshUser(); };

  if (loading) return <PageLoader />;

  const selected = ownedCars.find(c => c.id === user?.selectedCar);

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-6xl mx-auto px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold mb-8">Garage</h1>

        {/* Featured car display */}
        {selected && (
          <div className="glass-card p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
            <div className="relative z-10">
              <span className="text-8xl block mb-4 animate-float">{selected.emoji}</span>
              <h2 className="text-2xl font-bold">{selected.name}</h2>
              <span className={`text-sm uppercase tracking-wider ${getRarityClass(selected.rarity)}`}>{selected.rarity}</span>
              <div className="flex justify-center gap-8 mt-4">
                <div><p className="text-xs text-gray-500">Speed</p><p className="font-bold font-mono text-xl">{selected.speed}/10</p></div>
                <div><p className="text-xs text-gray-500">Accel</p><p className="font-bold font-mono text-xl">{selected.acceleration}/10</p></div>
              </div>
            </div>
          </div>
        )}

        {/* Car grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedCars.map(car => {
            const isSelected = user?.selectedCar === car.id;
            return (
              <div key={car.id} onClick={() => handleSelect(car.id)}
                className={`glass-card-hover border-2 ${getRarityClass(car.rarity)} p-6 cursor-pointer relative ${
                  isSelected ? 'ring-2 ring-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]' : ''}`}>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-sm font-bold">&#x2713;</div>
                )}
                <div className="text-center">
                  <span className="text-6xl block mb-3">{car.emoji}</span>
                  <h3 className="font-bold text-lg">{car.name}</h3>
                  <span className={`text-xs uppercase tracking-wider ${getRarityClass(car.rarity)}`}>{car.rarity}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-dark-200/50 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-500">Speed</p>
                    <p className="font-bold font-mono">{car.speed}/10</p>
                  </div>
                  <div className="bg-dark-200/50 p-2 rounded-lg text-center">
                    <p className="text-[10px] text-gray-500">Accel</p>
                    <p className="font-bold font-mono">{car.acceleration}/10</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-4 bg-primary/10 text-primary text-center py-2 rounded-lg text-sm font-medium border border-primary/20">
                    &#x2713; Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {ownedCars.length === 0 && <EmptyState icon="&#x1F697;" title="No cars yet" subtitle="Visit the shop to buy your first car!" />}
      </div>
    </div>
  );
}

/* ─────────────── Leaderboard Page ─────────────── */

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [tab, setTab] = useState<'global' | 'weekly'>('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fn = tab === 'global' ? api.getLeaderboard() : api.getWeeklyLeaderboard();
    fn.then(r => {
      if (r) setLeaderboard((r as { leaderboard: LeaderboardEntry[] }).leaderboard || []);
      setLoading(false);
    });
  }, [tab]);

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold mb-6">Leaderboard</h1>

        {/* Tab selector */}
        <div className="glass-card inline-flex p-1 mb-8">
          {(['global', 'weekly'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                tab === t ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              {t === 'global' ? 'Global' : 'Weekly'}
            </button>
          ))}
        </div>

        {loading ? <PageLoader /> : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="flex items-end justify-center gap-4 mb-10">
                {[1, 0, 2].map(idx => {
                  const p = leaderboard[idx];
                  const heights = ['h-32', 'h-24', 'h-20'];
                  const medals = ['&#x1F947;', '&#x1F948;', '&#x1F949;'];
                  const order = [0, 1, 2];
                  return (
                    <div key={p.id} className="text-center flex-1 max-w-[140px]">
                      <span className="text-4xl block mb-2">{p.avatar}</span>
                      <p className="font-bold text-sm truncate">{p.username}</p>
                      <p className="text-xs text-gray-500">{p.highestWPM} WPM</p>
                      <div className={`${heights[order[idx]]} mt-3 rounded-t-xl flex items-center justify-center text-3xl ${
                        idx === 0 ? 'bg-gradient-to-t from-gold/30 to-gold/10 border border-gold/30'
                        : idx === 1 ? 'bg-gradient-to-t from-gray-400/20 to-gray-400/5 border border-gray-400/20'
                        : 'bg-gradient-to-t from-bronze/20 to-bronze/5 border border-bronze/20'
                      }`}>
                        <span dangerouslySetInnerHTML={{ __html: medals[order[idx]] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Remaining list */}
            <div className="space-y-2">
              {leaderboard.slice(3).map((player, i) => (
                <div key={player.id}
                  className="glass-card-hover p-4 flex items-center gap-4 animate-slide-in-right"
                  style={{ animationDelay: `${i * 30}ms` }}>
                  <span className="text-lg font-bold text-gray-500 w-8 font-mono">{i + 4}</span>
                  <span className="text-2xl">{player.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{player.username}</p>
                    <p className="text-xs text-gray-500">{player.league} &middot; Level {player.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary font-mono">
                      {tab === 'weekly' ? (player.weeklyXP || 0).toLocaleString() : (player.xp || 0).toLocaleString()} XP
                    </p>
                    <p className="text-xs text-gray-500">{player.highestWPM} WPM</p>
                  </div>
                </div>
              ))}
            </div>

            {leaderboard.length === 0 && <EmptyState icon="&#x1F3C6;" title="No entries yet" />}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Friends Page ─────────────── */

function FriendsPage() {
  const { user } = useAuthStore();
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => { loadFriends(); }, []);

  const loadFriends = async () => {
    const response = await api.getFriends();
    if (response) {
      const r = response as { friends: User[]; incomingRequests?: User[]; incoming_requests?: User[] };
      setFriends(r.friends || []);
      setRequests(r.incomingRequests || r.incoming_requests || []);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    const response = await api.getUsers(search);
    if (response) {
      const users = (Array.isArray(response) ? response : (response as { users?: User[] }).users || []) as User[];
      setSearchResults(users.filter(u => u.id !== user?.id && !friends.some(f => f.id === u.id)));
    }
  };

  const handleAddFriend = async (userId: string) => { await api.addFriend(userId); handleSearch(); };
  const handleAccept = async (userId: string) => { await api.acceptFriend(userId); loadFriends(); };
  const handleRemove = async (userId: string) => { await api.removeFriend(userId); loadFriends(); };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold mb-8">Friends</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Search */}
          <div>
            <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-3 font-medium">Find Friends</h2>
            <div className="flex gap-2 mb-4">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search username..."
                className="flex-1 bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-all text-sm"
                onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              <button onClick={handleSearch} className="btn-primary !px-4 !py-2.5 text-sm">Search</button>
            </div>
            <div className="space-y-2">
              {searchResults.map(u => (
                <div key={u.id} className="glass-card-hover p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{u.avatar}</span>
                    <span className="font-medium text-sm">{u.username}</span>
                  </div>
                  <button onClick={() => handleAddFriend(u.id)}
                    className="bg-primary/20 text-primary hover:bg-primary/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Requests */}
            <div>
              <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-3 font-medium">
                Friend Requests {requests.length > 0 && <span className="text-accent">({requests.length})</span>}
              </h2>
              <div className="space-y-2">
                {requests.map(u => (
                  <div key={u.id} className="glass-card-hover p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{u.avatar}</span>
                      <span className="font-medium text-sm">{u.username}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(u.id)}
                        className="bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                        Accept
                      </button>
                      <button onClick={() => handleRemove(u.id)}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
                {requests.length === 0 && <p className="text-gray-600 text-sm">No pending requests</p>}
              </div>
            </div>

            {/* Friend List */}
            <div>
              <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-3 font-medium">Your Friends</h2>
              <div className="space-y-2">
                {friends.map(u => (
                  <div key={u.id} className="glass-card-hover p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="text-xl">{u.avatar}</span>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-dark ${
                          (u as User & { isOnline?: boolean }).isOnline ? 'bg-green-400' : 'bg-gray-600'}`} />
                      </div>
                      <span className="font-medium text-sm">{u.username}</span>
                    </div>
                    <button onClick={() => handleRemove(u.id)}
                      className="text-gray-600 hover:text-red-400 text-xs transition-colors">Remove</button>
                  </div>
                ))}
                {friends.length === 0 && <EmptyState icon="&#x1F465;" title="No friends yet" subtitle="Search to find other racers!" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Teams Page ─────────────── */

function TeamsPage() {
  const { user } = useAuthStore();
  const [teams, setTeams] = useState<{ id: string; name: string; tag: string; description: string; color: string; members?: string[]; wins?: number; totalXP?: number }[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', tag: '', description: '' });

  useEffect(() => { loadTeams(); }, []);

  const loadTeams = async () => {
    const response = await api.getTeams();
    if (response) setTeams(Array.isArray(response) ? response as typeof teams : ((response as { teams?: typeof teams }).teams || []));
  };

  const handleCreate = async () => { await api.createTeam(createForm); setShowCreate(false); loadTeams(); };
  const handleJoin = async (teamId: string) => { await api.joinTeam(teamId); loadTeams(); };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4 animate-slide-up">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-bold">Teams</h1>
          {!user?.team && (
            <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">Create Team</button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {teams.map(team => (
            <div key={team.id} className="glass-card-hover p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: team.color || '#6366f1' }} />
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold">
                    <span className="text-gray-500">[{team.tag}]</span> {team.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{team.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-dark-200/50 p-2 rounded-lg text-center">
                  <p className="font-bold font-mono text-sm">{team.members?.length || 0}</p>
                  <p className="text-[10px] text-gray-500">Members</p>
                </div>
                <div className="bg-dark-200/50 p-2 rounded-lg text-center">
                  <p className="font-bold font-mono text-sm">{team.wins || 0}</p>
                  <p className="text-[10px] text-gray-500">Wins</p>
                </div>
                <div className="bg-dark-200/50 p-2 rounded-lg text-center">
                  <p className="font-bold font-mono text-sm">{team.totalXP || 0}</p>
                  <p className="text-[10px] text-gray-500">XP</p>
                </div>
              </div>
              {user?.team !== team.id && (
                <button onClick={() => handleJoin(team.id)}
                  className="w-full bg-primary/10 text-primary hover:bg-primary/20 py-2 rounded-lg text-sm font-medium transition-colors">
                  Apply to Join
                </button>
              )}
            </div>
          ))}
        </div>

        {teams.length === 0 && <EmptyState icon="&#x1F91D;" title="No teams found" subtitle="Create the first team!" />}

        {/* Create Team Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreate(false)}>
            <div className="glass-card p-8 w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
              <h3 className="font-display text-xl font-bold mb-6">Create Team</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Team Name</label>
                  <input type="text" value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Tag (5 chars max)</label>
                  <input type="text" value={createForm.tag}
                    onChange={e => setCreateForm({ ...createForm, tag: e.target.value.toUpperCase().slice(0, 5) })}
                    className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 font-mono uppercase focus:outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Description</label>
                  <textarea value={createForm.description}
                    onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-all" rows={3} />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 bg-dark-400 hover:bg-dark-300 py-2.5 rounded-xl font-medium transition-colors">Cancel</button>
                <button onClick={handleCreate} className="flex-1 btn-primary">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Achievements Page ─────────────── */

function AchievementsPage() {
  const [achievements, setAchievements] = useState<{ id: string; name: string; description: string; icon: string; target: number; reward: number; progress: number; unlocked: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAchievements().then(r => {
      if (r) setAchievements((r as { achievements: typeof achievements }).achievements || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold mb-8">Achievements</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map(a => (
            <div key={a.id}
              className={`glass-card-hover p-4 border-2 transition-all ${
                a.unlocked ? 'border-gold/50 shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'border-transparent opacity-60'}`}>
              <div className="flex items-center gap-4">
                <span className={`text-4xl ${a.unlocked ? '' : 'grayscale'}`}>{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm">{a.name}</h3>
                  <p className="text-xs text-gray-500">{a.description}</p>
                </div>
                {a.unlocked
                  ? <span className="text-gold text-lg">&#x2713;</span>
                  : <span className="text-gray-600 text-lg">&#x1F512;</span>}
              </div>
              <div className="mt-3">
                <ProgressBar value={a.progress || 0} max={a.target || 1}
                  color={a.unlocked ? 'from-gold to-amber-400' : 'from-primary to-secondary'} />
                <div className="flex justify-between mt-1.5">
                  <p className="text-[10px] text-gray-500 font-mono">{a.progress || 0}/{a.target || 0}</p>
                  <p className="text-[10px] text-yellow-400">&#x1FA99; {a.reward}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {achievements.length === 0 && <EmptyState icon="&#x1F3C5;" title="No achievements available" />}
      </div>
    </div>
  );
}

/* ─────────────── Missions Page ─────────────── */

function MissionsPage() {
  const [missions, setMissions] = useState<{ daily: Mission[]; weekly: Mission[] } | null>(null);
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => { api.getMissions().then(r => r && setMissions(r as { daily: Mission[]; weekly: Mission[] })); }, []);

  if (!missions) return <PageLoader />;

  const list = tab === 'daily' ? (missions.daily || []) : (missions.weekly || []);

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold mb-6">Missions</h1>

        <div className="glass-card inline-flex p-1 mb-8">
          <button onClick={() => setTab('daily')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'daily' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>
            Daily
          </button>
          <button onClick={() => setTab('weekly')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'weekly' ? 'bg-secondary text-white' : 'text-gray-400 hover:text-white'}`}>
            Weekly
          </button>
        </div>

        <div className="space-y-3">
          {list.map((m, i) => (
            <div key={m.id} className={`glass-card-hover p-5 animate-slide-in-right ${m.completed ? 'border-green-500/30' : ''}`}
              style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    {m.completed && <span className="text-green-400">&#x2713;</span>}
                    {m.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold font-mono text-sm">&#x1FA99; {m.reward}</p>
                </div>
              </div>
              <ProgressBar value={m.progress || 0} max={m.target || 1}
                color={m.completed ? 'from-green-400 to-emerald-500' : tab === 'daily' ? 'from-primary to-secondary' : 'from-purple-500 to-pink-500'} />
              <p className="text-[10px] text-gray-500 mt-1.5 font-mono">{m.progress}/{m.target}</p>
            </div>
          ))}
        </div>

        {list.length === 0 && <EmptyState icon="&#x1F4CB;" title="No missions available" />}
      </div>
    </div>
  );
}

/* ─────────────── Profile Page ─────────────── */

function ProfilePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<{ highestWPM: number; averageAccuracy: number; totalRaces: number; winRate: number } | null>(null);

  useEffect(() => { api.getStats().then(r => r && setStats(r as typeof stats)); }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4 animate-slide-up">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
          <div className="relative z-10 flex items-center gap-6">
            <span className="text-8xl">{user.avatar}</span>
            <div>
              <h1 className="text-3xl font-display font-bold">{user.username}</h1>
              <p className="text-gray-400 mt-1">{user.title || 'Racer'} &middot; {user.league} {user.division || ''}</p>
              <p className="text-xs text-gray-500 mt-1">Level {user.level} &middot; {(user.xp || 0).toLocaleString()} XP</p>
              <div className="mt-3 w-48">
                <ProgressBar value={(user.xp || 0) % 500} max={500} glow />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Best WPM" value={stats.highestWPM} color="text-neon-green" icon="&#x26A1;" />
            <StatCard label="Avg Accuracy" value={`${stats.averageAccuracy}%`} color="text-primary-light" icon="&#x1F3AF;" />
            <StatCard label="Total Races" value={stats.totalRaces} color="text-secondary" icon="&#x1F3C1;" />
            <StatCard label="Win Rate" value={`${stats.winRate}%`} color="text-gold" icon="&#x1F3C6;" />
          </div>
        )}

        {/* Achievements */}
        <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-medium">Achievements</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {(user.achievements || []).filter(a => a.unlocked).slice(0, 16).map(a => (
            <div key={a.id} className="glass-card p-3 text-center group hover:border-gold/30 transition-all">
              <span className="text-2xl block group-hover:scale-110 transition-transform">{a.icon}</span>
              <p className="text-[10px] text-gray-500 mt-1 truncate">{a.name}</p>
            </div>
          ))}
          {(user.achievements || []).filter(a => a.unlocked).length === 0 && (
            <div className="col-span-full">
              <EmptyState icon="&#x1F3C5;" title="No achievements unlocked yet" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Settings Page ─────────────── */

function SettingsPage() {
  const { user, refreshUser } = useAuthStore();
  const [settings, setSettings] = useState(user?.settings);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!settings) return;
    await api.updateSettings(settings);
    refreshUser();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user || !settings) return null;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-2xl mx-auto px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-medium">Sound</h2>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Typing Sounds</span>
              <div className="relative">
                <input type="checkbox" checked={settings.sound}
                  onChange={e => setSettings({ ...settings, sound: e.target.checked })}
                  className="sr-only peer" />
                <div className="w-11 h-6 bg-dark-400 rounded-full peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
              </div>
            </label>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-medium">Display</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs text-gray-500 mb-2">Font Size</label>
                <select value={settings.fontSize}
                  onChange={e => setSettings({ ...settings, fontSize: e.target.value })}
                  className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-all text-sm">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                <div className="mt-2 p-3 bg-dark-200/50 rounded-lg">
                  <p className={`font-mono text-gray-400 ${settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-xl' : 'text-base'}`}>
                    The quick brown fox jumps...
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">Backspace Mode</label>
                <select value={settings.backspaceMode}
                  onChange={e => setSettings({ ...settings, backspaceMode: e.target.value })}
                  className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-all text-sm">
                  <option value="normal">Normal</option>
                  <option value="strict">Strict (no backspace)</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={handleSave}
            className={`w-full py-3.5 rounded-xl font-bold transition-all ${saved ? 'bg-green-500 text-white' : 'btn-primary'}`}>
            {saved ? '&#x2713; Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Classroom Page ─────────────── */

function ClassroomPage() {
  const [joinCode, setJoinCode] = useState('');
  const [classroom, setClassroom] = useState<{ name: string; joinCode: string; students?: string[]; description?: string } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');

  const handleJoin = async () => {
    const response = await api.joinClassroom(joinCode);
    if (response) setClassroom(response as typeof classroom);
  };

  const handleCreate = async () => {
    if (!createName.trim()) return;
    const response = await api.createClassroom(createName);
    if (response) { setClassroom(response as typeof classroom); setShowCreate(false); }
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold mb-8">Classroom</h1>

        {!classroom ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2"><span>&#x1F4DA;</span> Join a Classroom</h2>
              <div className="flex gap-2">
                <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter join code"
                  className="flex-1 bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 font-mono uppercase focus:outline-none focus:border-primary transition-all" />
                <button onClick={handleJoin} className="btn-primary !px-5">Join</button>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2"><span>&#x1F4DD;</span> Create a Classroom</h2>
              <p className="text-gray-500 text-sm mb-4">Teachers can create classrooms to track student progress.</p>
              {showCreate ? (
                <div className="flex gap-2">
                  <input type="text" value={createName} onChange={e => setCreateName(e.target.value)}
                    placeholder="Classroom name" autoFocus
                    className="flex-1 bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-all" />
                  <button onClick={handleCreate} className="btn-primary !px-5">Create</button>
                </div>
              ) : (
                <button onClick={() => setShowCreate(true)} className="btn-primary">Create Classroom</button>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-card p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{classroom.name}</h2>
                <p className="text-gray-500 mt-1">
                  Join Code: <span className="font-mono text-primary font-bold">{classroom.joinCode}</span>
                </p>
              </div>
              <button onClick={() => setClassroom(null)}
                className="text-gray-500 hover:text-white text-sm transition-colors">Leave</button>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-gray-400">Students: <span className="text-white font-bold">{classroom.students?.length || 0}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Stats Page ─────────────── */

function StatsPage() {
  const [stats, setStats] = useState<{
    highestWPM: number; averageAccuracy: number; totalRaces: number; racesWon: number; winRate: number;
    league: string; division: string; mmr: number;
  } | null>(null);

  useEffect(() => { api.getStats().then(r => r && setStats(r as typeof stats)); }, []);

  if (!stats) return <PageLoader />;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4 animate-slide-up">
        <h1 className="font-display text-3xl font-bold mb-8">Statistics</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6 text-center">
            <p className="text-5xl font-bold text-neon-green font-mono text-glow-sm" style={{ color: '#00ff88' }}>{stats.highestWPM}</p>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Best WPM</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-5xl font-bold text-primary-light font-mono">{stats.averageAccuracy}%</p>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Avg Accuracy</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className="text-5xl font-bold text-secondary font-mono">{stats.totalRaces}</p>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Total Races</p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-medium">Performance</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Races Won', value: stats.racesWon },
              { label: 'Win Rate', value: `${stats.winRate}%` },
              { label: 'Current League', value: `${stats.league} ${stats.division || ''}` },
              { label: 'MMR', value: stats.mmr },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-500 text-sm">{s.label}</span>
                <span className="font-bold font-mono text-sm">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Admin Page ─────────────── */

function AdminPage() {
  const [adminAuth, setAdminAuth] = useState(!!api.getAdminToken());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<{ totalUsers: number; totalRaces: number; activeUsers: number; revenue: number } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [tab, setTab] = useState<'dashboard' | 'users'>('dashboard');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await api.adminLogin(username, password);
    if (result?.token) { setAdminAuth(true); } else { setError('Invalid admin credentials'); }
    setLoading(false);
  };

  const handleLogout = () => {
    api.setAdminToken(null);
    setAdminAuth(false);
  };

  useEffect(() => {
    if (adminAuth) {
      api.getAdminDashboard().then(r => { if (r) setDashboard(r); else { api.setAdminToken(null); setAdminAuth(false); } });
      api.getAdminUsers().then(r => { if (r) setUsers(r.users || []); });
    }
  }, [adminAuth]);

  const searchUsers = async () => {
    const r = await api.getAdminUsers(1, 20, userSearch);
    if (r) setUsers(r.users || []);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await api.adminDeleteUser(id);
    searchUsers();
  };

  const handleGiveCash = async (id: string) => {
    const amount = prompt('Enter amount:');
    if (amount && !isNaN(Number(amount))) {
      await api.adminGiveCash(id, Number(amount));
      searchUsers();
    }
  };

  if (!adminAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-pattern p-4">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <span className="text-5xl">&#x1F6E1;&#xFE0F;</span>
            <h1 className="font-display text-3xl font-bold mt-4 text-white">Admin Panel</h1>
          </div>
          <form onSubmit={handleLogin} className="glass-card p-8 space-y-5">
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all" required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-primary !py-3.5 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Spinner size="sm" /> : null}
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-6xl mx-auto px-4 animate-slide-up">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 text-sm transition-colors">Logout</button>
        </div>

        {/* Tabs */}
        <div className="glass-card inline-flex p-1 mb-8">
          <button onClick={() => setTab('dashboard')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-400'}`}>
            Dashboard
          </button>
          <button onClick={() => setTab('users')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'users' ? 'bg-primary text-white' : 'text-gray-400'}`}>
            Users
          </button>
        </div>

        {tab === 'dashboard' && dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={dashboard.totalUsers} color="text-primary-light" icon="&#x1F465;" />
            <StatCard label="Total Races" value={dashboard.totalRaces} color="text-neon-green" icon="&#x1F3C1;" />
            <StatCard label="Active Users" value={dashboard.activeUsers} color="text-secondary" icon="&#x1F7E2;" />
            <StatCard label="Revenue" value={`$${dashboard.revenue}`} color="text-gold" icon="&#x1F4B0;" />
          </div>
        )}

        {tab === 'users' && (
          <div>
            <div className="flex gap-2 mb-6">
              <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="flex-1 bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-all text-sm"
                onKeyDown={e => e.key === 'Enter' && searchUsers()} />
              <button onClick={searchUsers} className="btn-primary !px-5 text-sm">Search</button>
            </div>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="glass-card-hover p-4 flex items-center gap-4">
                  <span className="text-2xl">{u.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{u.username}</p>
                    <p className="text-[10px] text-gray-500">Level {u.level} &middot; {u.league} &middot; &#x1FA99; {(u.cash || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleGiveCash(u.id)}
                      className="bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-yellow-500/30 transition-colors">
                      Give Cash
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)}
                      className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && <EmptyState icon="&#x1F465;" title="No users found" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Main App ─────────────── */

export default function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => { checkAuth(); }, [checkAuth]);

  if (isLoading) return <PageLoader />;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/race" element={<RacePage />} />
                <Route path="/race/:roomId" element={<RacePage />} />
                <Route path="/practice" element={<PracticePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/garage" element={<GaragePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/missions" element={<MissionsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/classroom" element={<ClassroomPage />} />
                <Route path="/stats" element={<StatsPage />} />
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
