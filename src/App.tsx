import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useRaceStore } from './stores/raceStore';
import { api, User, Car, LeaderboardEntry, Mission } from './lib/api';

// Header Component
function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="bg-surface/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🏎️</span>
            <span className="font-display font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TypeRush
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/garage" className="text-gray-300 hover:text-white transition">Garage</Link>
            <Link to="/shop" className="text-gray-300 hover:text-white transition">Shop</Link>
            <Link to="/leaderboard" className="text-gray-300 hover:text-white transition">Ranks</Link>
            <Link to="/friends" className="text-gray-300 hover:text-white transition">Friends</Link>
            <Link to="/teams" className="text-gray-300 hover:text-white transition">Teams</Link>
            <Link to="/classroom" className="text-gray-300 hover:text-white transition">Class</Link>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2 bg-dark px-3 py-1.5 rounded-full">
                  <span className="text-yellow-400 font-bold">{(user.cash || 0).toLocaleString()}</span>
                  <span>🪙</span>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-full transition"
                >
                  <span>{user.avatar}</span>
                  <span className="text-sm font-medium">{user.username}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-red-400 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg font-medium transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Login Page
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
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  const handleGuest = async () => {
    setLoading(true);
    await guestLogin();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark via-surface to-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl">🏎️</span>
          <h1 className="font-display text-4xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-400 mt-2">Sign in to continue racing</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/80 py-3 rounded-lg font-bold text-lg transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-gray-400">or</p>
          <button
            onClick={handleGuest}
            className="w-full bg-dark hover:bg-white/10 border border-white/20 py-3 rounded-lg font-medium transition"
          >
            Play as Guest
          </button>
          
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Register Page
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
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    const success = await register(username, email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Registration failed. Username may be taken.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark via-surface to-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl">🏎️</span>
          <h1 className="font-display text-4xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Join TypeRush
          </h1>
          <p className="text-gray-400 mt-2">Create your account and start racing</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                required
                minLength={3}
                maxLength={20}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/80 py-3 rounded-lg font-bold text-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// Home Page
function HomePage() {
  const { user, isAuthenticated, refreshUser } = useAuthStore();
  const { quickMatch, isSearching, room, createRoom } = useRaceStore();
  const navigate = useNavigate();
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (room) {
      navigate('/race');
    }
  }, [room]);

  useEffect(() => {
    if (isAuthenticated) {
      loadLeaderboard();
    }
  }, [isAuthenticated]);

  const loadLeaderboard = async () => {
    const response = await api.getLeaderboard();
    if (response) {
      const entries = (response as any).leaderboard || response;
      setTopPlayers((entries as LeaderboardEntry[]).slice(0, 5));
    }
  };

  const claimDailyReward = async () => {
    await api.getDailyReward();
    refreshUser();
  };

  const handleQuickMatch = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    quickMatch();
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) return;
    navigate(`/race/${joinCode.toUpperCase()}`);
    setShowJoinDialog(false);
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Race Mode Card */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-display font-bold mb-4">🏎️ Race Mode</h2>
              
              {isAuthenticated && user ? (
                <div className="flex items-center gap-4 mb-6 p-4 bg-dark rounded-xl">
                  <span className="text-4xl">{user.avatar}</span>
                  <div>
                    <p className="font-bold">{user.username}</p>
                    <p className="text-sm text-gray-400">
                      Level {user.level} • {user.league} • {user.title}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-dark rounded-xl text-center">
                  <p className="text-gray-400 mb-2">Sign in to race against others!</p>
                  <Link
                    to="/login"
                    className="bg-primary hover:bg-primary/80 px-6 py-2 rounded-lg font-medium inline-block"
                  >
                    Login / Sign Up
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleQuickMatch}
                  disabled={isSearching || !isAuthenticated}
                  className="bg-accent hover:bg-accent/80 disabled:opacity-50 py-4 px-6 rounded-xl font-bold text-lg transition transform hover:scale-105 animate-pulse-glow"
                >
                  {isSearching ? '⚡ Searching...' : '⚡ Quick Play'}
                </button>

                <button
                  onClick={() => isAuthenticated ? createRoom() : navigate('/login')}
                  disabled={!isAuthenticated}
                  className="bg-primary hover:bg-primary/80 disabled:opacity-50 py-4 px-6 rounded-xl font-bold text-lg transition transform hover:scale-105"
                >
                  🏁 Create Room
                </button>
              </div>

              <button
                onClick={() => setShowJoinDialog(true)}
                disabled={!isAuthenticated}
                className="w-full mt-4 bg-secondary hover:bg-secondary/80 disabled:opacity-50 py-3 px-6 rounded-xl font-bold transition"
              >
                🔗 Join Private Room
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">🎯 Quick Actions</h2>
              <div className="grid grid-cols-4 gap-3">
                <Link to="/practice" className="bg-dark hover:bg-white/5 p-4 rounded-xl text-center transition">
                  <span className="text-2xl mb-1 block">🎯</span>
                  <span className="text-xs text-gray-300">Practice</span>
                </Link>
                <Link to="/achievements" className="bg-dark hover:bg-white/5 p-4 rounded-xl text-center transition">
                  <span className="text-2xl mb-1 block">🏅</span>
                  <span className="text-xs text-gray-300">Badges</span>
                </Link>
                <Link to="/missions" className="bg-dark hover:bg-white/5 p-4 rounded-xl text-center transition">
                  <span className="text-2xl mb-1 block">📋</span>
                  <span className="text-xs text-gray-300">Missions</span>
                </Link>
                <Link to="/stats" className="bg-dark hover:bg-white/5 p-4 rounded-xl text-center transition">
                  <span className="text-2xl mb-1 block">📊</span>
                  <span className="text-xs text-gray-300">Stats</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* User Stats */}
            {isAuthenticated && user && (
              <>
                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">📊 Your Stats</h2>
                    <button
                      onClick={claimDailyReward}
                      className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                      🎁 Daily Reward
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="bg-dark p-3 rounded-xl text-center">
                      <p className="text-2xl font-bold text-primary">{user.level}</p>
                      <p className="text-xs text-gray-400">Level</p>
                    </div>
                    <div className="bg-dark p-3 rounded-xl text-center">
                      <p className="text-2xl font-bold text-accent">{user.highestWPM || 0}</p>
                      <p className="text-xs text-gray-400">Best WPM</p>
                    </div>
                    <div className="bg-dark p-3 rounded-xl text-center">
                      <p className="text-2xl font-bold text-purple-400">{user.totalRaces || 0}</p>
                      <p className="text-xs text-gray-400">Races</p>
                    </div>
                    <div className="bg-dark p-3 rounded-xl text-center">
                      <p className="text-2xl font-bold text-yellow-400">{user.streak || 0}</p>
                      <p className="text-xs text-gray-400">Streak</p>
                    </div>
                  </div>
                  <div className="bg-dark p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">XP Progress</span>
                      <span className="text-sm text-primary">{(user.xp || 0).toLocaleString()} XP</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                        style={{ width: `${((user.xp || 0) % 500) / 5}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-surface border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">🔥 Daily Streak</h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">🔥</span>
                      <div>
                        <p className="text-2xl font-bold text-orange-400">{user.streak || 0} days</p>
                        <p className="text-sm text-gray-400">Keep it going!</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Multiplier</p>
                      <p className="font-bold text-orange-400">×{Math.min(1 + (user.streak || 0) * 0.1, 3).toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Top Racers */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">🏆 Top Racers</h2>
              <div className="space-y-2">
                {topPlayers.map((player, i) => (
                  <div key={player.id} className="flex items-center gap-4 p-3 bg-dark rounded-xl">
                    <span className="text-xl font-bold text-gray-400 w-6">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                    </span>
                    <span className="text-xl">{player.avatar}</span>
                    <div className="flex-1">
                      <p className="font-medium">{player.username}</p>
                      <p className="text-xs text-gray-400">{player.league} • {player.highestWPM} WPM</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{(player.xp || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">XP</p>
                    </div>
                  </div>
                ))}
                {topPlayers.length === 0 && (
                  <p className="text-gray-400 text-center py-4">Loading...</p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">🧭 Navigate</h2>
              <div className="grid grid-cols-3 gap-3">
                <Link to="/garage" className="bg-dark hover:bg-white/5 p-3 rounded-xl text-center transition">
                  <span className="text-xl mb-1 block">🚗</span>
                  <span className="text-sm text-gray-300">Garage</span>
                </Link>
                <Link to="/shop" className="bg-dark hover:bg-white/5 p-3 rounded-xl text-center transition">
                  <span className="text-xl mb-1 block">🛒</span>
                  <span className="text-sm text-gray-300">Shop</span>
                </Link>
                <Link to="/profile" className="bg-dark hover:bg-white/5 p-3 rounded-xl text-center transition">
                  <span className="text-xl mb-1 block">👤</span>
                  <span className="text-sm text-gray-300">Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Dialog */}
      {showJoinDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">🔗 Join Room</h3>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 text-center text-2xl font-mono uppercase tracking-widest focus:outline-none focus:border-primary"
              maxLength={6}
              autoFocus
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setShowJoinDialog(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinRoom}
                className="flex-1 bg-primary hover:bg-primary/80 py-3 rounded-lg font-medium transition"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Race Page
function RacePage() {
  const {
    room, roomId, isCountdown, countdown, isRacing, text, currentIndex, errors,
    wpm, accuracy, finished, result, rewards, players, errorAtIndex,
    handleKeyPress, leaveRoom, reset, startRace, cleanupSocketListeners,
  } = useRaceStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!room) {
      navigate('/');
    }
  }, [room]);

  // Setup socket listeners on mount, cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSocketListeners();
    };
  }, []);

  useEffect(() => {
    if (!isRacing || finished) return;
    const interval = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRacing, finished]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isRacing || finished) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('Backspace');
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleKeyPress(e.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isRacing, finished, handleKeyPress]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const playerList = Object.values(players);

  if (!room) return null;

  if (isCountdown) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl font-display font-bold text-primary animate-pulse">
            {countdown === 0 ? 'GO!' : countdown}
          </div>
          <p className="text-gray-400 mt-4">Get ready to type!</p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark flex items-center justify-center p-4">
        <div className="bg-surface border border-white/10 rounded-2xl p-8 max-w-lg w-full text-center">
          <div className="text-8xl mb-4">🏆</div>
          <h1 className="text-4xl font-display font-bold mb-2">Race Complete!</h1>

          {result && (
            <p className="text-gray-400 mb-2">You finished in <span className="text-yellow-400 font-bold">#{result.place}</span> place!</p>
          )}

          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="bg-dark p-4 rounded-xl">
              <p className="text-3xl font-bold text-accent">{result?.wpm || wpm}</p>
              <p className="text-sm text-gray-400">WPM</p>
            </div>
            <div className="bg-dark p-4 rounded-xl">
              <p className="text-3xl font-bold text-primary">{result?.accuracy || accuracy}%</p>
              <p className="text-sm text-gray-400">Accuracy</p>
            </div>
            <div className="bg-dark p-4 rounded-xl">
              <p className="text-3xl font-bold text-orange-400">{formatTime(elapsedTime)}</p>
              <p className="text-sm text-gray-400">Time</p>
            </div>
          </div>

          {rewards && (
            <div className="flex justify-center gap-6 my-4">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-400">+{rewards.xp}</p>
                <p className="text-xs text-gray-400">XP</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-yellow-400">+{rewards.cash}</p>
                <p className="text-xs text-gray-400">Coins</p>
              </div>
            </div>
          )}

          {/* Final standings */}
          {playerList.filter(p => p.finished).length > 0 && (
            <div className="my-4 space-y-2">
              {playerList
                .filter(p => p.finished)
                .sort((a, b) => (a.place || 99) - (b.place || 99))
                .map(p => (
                  <div key={p.id} className="bg-dark rounded-lg px-4 py-2 flex items-center gap-3">
                    <span className="text-yellow-400 font-bold w-6">#{p.place}</span>
                    <span>{p.car.emoji}</span>
                    <span className="flex-1 text-left text-sm">{p.username}</span>
                    <span className="text-accent text-sm">{p.wpm} WPM</span>
                    <span className="text-gray-400 text-sm">{p.accuracy}%</span>
                  </div>
                ))}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => { reset(); navigate('/'); }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold transition"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-surface to-dark">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🏁</span>
            <div>
              <p className="text-sm text-gray-400">Room</p>
              <p className="font-mono font-bold text-primary">{roomId || room.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{wpm}</p>
              <p className="text-xs text-gray-400">WPM</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{accuracy}%</p>
              <p className="text-xs text-gray-400">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{formatTime(elapsedTime)}</p>
              <p className="text-xs text-gray-400">Time</p>
            </div>
            <button onClick={() => { leaveRoom(); navigate('/'); }} className="text-gray-400 hover:text-red-400">
              ✕ Leave
            </button>
          </div>
        </div>

        {/* Race Track - All players */}
        {playerList.length > 0 && (
          <div className="space-y-3 mb-6">
            {playerList.map(player => (
              <div key={player.id} className="bg-surface border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-3 mb-1">
                  <span>{player.car.emoji}</span>
                  <span className={`text-sm ${player.id === user?.id ? 'text-primary font-bold' : 'text-gray-300'}`}>
                    {player.username}{player.id === user?.id ? ' (You)' : ''}{player.isBot ? ' [BOT]' : ''}
                  </span>
                  {player.finished && <span className="text-xs text-yellow-400">#{player.place}</span>}
                  <span className="text-xs text-gray-400 ml-auto">{player.wpm} WPM</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      player.id === user?.id
                        ? 'bg-gradient-to-r from-accent to-green-400'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                    }`}
                    style={{ width: `${(player.progress || (player.id === user?.id ? currentIndex / (text.length || 1) : 0)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {room.status === 'waiting' && (
          <div className="bg-surface border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-gray-400 mb-4">Waiting for players...</p>
            <div className="flex gap-2 justify-center mb-4">
              {(room.players || playerList).map((player) => (
                <div key={player.id} className="bg-dark px-3 py-2 rounded-lg flex items-center gap-2">
                  <span>{player.car?.emoji || '🚗'}</span>
                  <span className="text-sm text-gray-300">{player.username}</span>
                </div>
              ))}
            </div>
            {user && (room.players?.[0]?.id === user.id || playerList[0]?.id === user.id) && (
              <button
                onClick={() => startRace()}
                className="bg-accent hover:bg-accent/80 px-8 py-3 rounded-xl font-bold text-lg transition"
              >
                🚀 Start Race
              </button>
            )}
          </div>
        )}

        {(room.status === 'racing' || isRacing) && (
          <>
            <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-6">
              <div className="bg-dark p-4 rounded-xl font-mono text-xl leading-relaxed">
                {(text || '').split('').map((char, i) => (
                  <span key={i} className={
                    i < currentIndex ? 'text-green-400' :
                    i === currentIndex && errorAtIndex ? 'text-red-400 bg-red-400/20 underline' :
                    i === currentIndex ? 'text-primary bg-primary/20' :
                    'text-gray-500'
                  }>{char}</span>
                ))}
              </div>

              {errorAtIndex && (
                <p className="text-red-400 text-center mt-3 animate-pulse">
                  Wrong character! Press Backspace to fix.
                </p>
              )}

              {errors > 0 && (
                <p className="text-red-400 text-center mt-2 text-sm">
                  {errors} {errors === 1 ? 'error' : 'errors'}
                </p>
              )}
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-4 text-center">
              <p className="text-gray-400">🏎️ Type to speed up! Your car moves as you type correctly.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Practice Page
function PracticePage() {
  const [practiceText, setPracticeText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const TEXTS = [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!",
    "Sphinx of black quartz, judge my vow.",
    "Two driven jocks help fax my big quiz.",
  ];

  useEffect(() => {
    setPracticeText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (finished || !practiceText) return;
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (!startTime) setStartTime(Date.now());
        
        const expectedChar = practiceText[currentIndex];
        if (e.key === expectedChar) {
          const newIndex = currentIndex + 1;
          setCurrentIndex(newIndex);
          
          const elapsed = (Date.now() - (startTime || Date.now())) / 60000;
          const words = newIndex / 5;
          setWpm(Math.round(words / elapsed));
          
          const totalKeystrokes = newIndex + errors;
          setAccuracy(Math.round((newIndex / totalKeystrokes) * 100));
          
          if (newIndex >= practiceText.length) {
            setFinished(true);
          }
        } else {
          setErrors(e => e + 1);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [finished, practiceText, currentIndex, startTime, errors]);

  const reset = () => {
    setPracticeText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
    setCurrentIndex(0);
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
    setFinished(false);
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold text-center mb-8">🎯 Practice Mode</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-surface p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-accent">{wpm}</p>
            <p className="text-sm text-gray-400">WPM</p>
          </div>
          <div className="bg-surface p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-primary">{accuracy}%</p>
            <p className="text-sm text-gray-400">Accuracy</p>
          </div>
          <div className="bg-surface p-4 rounded-xl text-center">
            <p className="text-3xl font-bold text-red-400">{errors}</p>
            <p className="text-sm text-gray-400">Errors</p>
          </div>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6">
          <div className="h-2 bg-dark rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-accent to-green-400"
              style={{ width: `${(currentIndex / (practiceText.length || 1)) * 100}%` }}
            />
          </div>

          <div className="bg-dark p-6 rounded-xl font-mono text-xl leading-relaxed">
            {practiceText.split('').map((char, i) => (
              <span key={i} className={
                i < currentIndex ? 'text-green-400' :
                i === currentIndex ? 'text-primary bg-primary/20' :
                'text-gray-500'
              }>{char}</span>
            ))}
          </div>
        </div>

        {finished && (
          <div className="mt-6 text-center">
            <p className="text-2xl font-bold text-green-400 mb-4">Practice Complete!</p>
            <button onClick={reset} className="bg-primary hover:bg-primary/80 px-8 py-3 rounded-xl font-bold">
              Practice Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Shop Page
function ShopPage() {
  const { user } = useAuthStore();
  const [shopData, setShopData] = useState<{ dailyItems: Car[]; featuredItems: Car[]; userCoins: number; userGems: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShop();
  }, []);

  const loadShop = async () => {
    const response = await api.getShop();
    if (response) {
      setShopData(response as any);
    }
    setLoading(false);
  };

  const handleBuy = async (car: Car) => {
    if (!user || (user.cash || 0) < car.price) {
      alert('Not enough coins!');
      return;
    }
    
    const response = await api.buyCar(car.id);
    if (response) {
      alert(`You bought ${car.name}!`);
      loadShop();
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 text-gray-400';
      case 'rare': return 'border-blue-500 text-blue-400';
      case 'epic': return 'border-purple-500 text-purple-400';
      case 'legendary': return 'border-orange-500 text-orange-400';
      default: return 'border-gray-500 text-gray-400';
    }
  };

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">🛒 Shop</h1>
          <div className="flex items-center gap-4">
            <div className="bg-dark px-4 py-2 rounded-full">
              <span className="text-yellow-400">🪙 {(shopData?.userCoins || 0).toLocaleString()}</span>
            </div>
            <div className="bg-dark px-4 py-2 rounded-full">
              <span className="text-purple-400">💎 {shopData?.userGems || 0}</span>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">⭐ Featured</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(shopData?.featuredItems || []).map((car) => (
            <div key={car.id} className={`bg-surface border-2 ${getRarityColor(car.rarity)} rounded-2xl p-6`}>
              <div className="text-center mb-4">
                <span className="text-6xl block mb-2">{car.emoji}</span>
                <h3 className="font-bold text-lg">{car.name}</h3>
                <span className={`text-sm ${getRarityColor(car.rarity)}`}>{car.rarity}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-dark p-2 rounded text-center">
                  <p className="text-xs text-gray-400">Speed</p>
                  <p className="font-bold">{car.speed}/10</p>
                </div>
                <div className="bg-dark p-2 rounded text-center">
                  <p className="text-xs text-gray-400">Accel</p>
                  <p className="font-bold">{car.acceleration}/10</p>
                </div>
              </div>
              <button
                onClick={() => handleBuy(car)}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl"
              >
                🪙 {(car.price || 0).toLocaleString()}
              </button>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">📦 Daily Deals</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {(shopData?.dailyItems || []).map((car) => (
            <div key={car.id} className={`bg-surface border ${getRarityColor(car.rarity)} rounded-xl p-4`}>
              <div className="text-center mb-2">
                <span className="text-4xl">{car.emoji}</span>
                <p className="font-bold text-sm">{car.name}</p>
              </div>
              <button
                onClick={() => handleBuy(car)}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg text-sm"
              >
                🪙 {(car.price || 0).toLocaleString()}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Garage Page
function GaragePage() {
  const { user, refreshUser } = useAuthStore();
  const [ownedCars, setOwnedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGarage();
  }, []);

  const loadGarage = async () => {
    const response = await api.getGarage();
    if (response) {
      setOwnedCars((response as any).ownedCars || []);
    }
    setLoading(false);
  };

  const handleSelect = async (carId: string) => {
    await api.selectCar(carId);
    refreshUser();
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500';
      case 'rare': return 'border-blue-500';
      case 'epic': return 'border-purple-500';
      case 'legendary': return 'border-orange-500';
      default: return 'border-gray-500';
    }
  };

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-8">🚗 Garage</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedCars.map((car) => (
            <div
              key={car.id}
              className={`bg-surface border-2 ${getRarityColor(car.rarity)} rounded-2xl p-6 cursor-pointer transition hover:scale-105 ${
                user?.selectedCar === car.id ? 'ring-4 ring-primary' : ''
              }`}
              onClick={() => handleSelect(car.id)}
            >
              <div className="text-center">
                <span className="text-6xl block mb-4">{car.emoji}</span>
                <h3 className="text-xl font-bold">{car.name}</h3>
                <span className={`text-sm ${getRarityColor(car.rarity)}`}>{car.rarity}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-dark p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-400">Speed</p>
                  <p className="font-bold">{car.speed}/10</p>
                </div>
                <div className="bg-dark p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-400">Accel</p>
                  <p className="font-bold">{car.acceleration}/10</p>
                </div>
              </div>
              {user?.selectedCar === car.id && (
                <div className="mt-4 bg-primary/20 text-primary text-center py-2 rounded-lg font-medium">
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Leaderboard Page
function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [tab, setTab] = useState<'global' | 'weekly'>('global');

  useEffect(() => {
    loadLeaderboard();
  }, [tab]);

  const loadLeaderboard = async () => {
    const response = tab === 'global' ? await api.getLeaderboard() : await api.getWeeklyLeaderboard();
    if (response) {
      setLeaderboard((response as any).leaderboard || []);
    }
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-8">🏆 Leaderboard</h1>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTab('global')}
            className={`px-6 py-2 rounded-lg font-medium ${tab === 'global' ? 'bg-primary' : 'bg-surface'}`}
          >
            Global
          </button>
          <button
            onClick={() => setTab('weekly')}
            className={`px-6 py-2 rounded-lg font-medium ${tab === 'weekly' ? 'bg-primary' : 'bg-surface'}`}
          >
            Weekly
          </button>
        </div>

        <div className="space-y-2">
          {leaderboard.map((player, i) => (
            <div key={player.id} className="bg-surface border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-400 w-10">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
              </span>
              <span className="text-3xl">{player.avatar}</span>
              <div className="flex-1">
                <p className="font-bold">{player.username}</p>
                <p className="text-sm text-gray-400">{player.league} • Level {player.level}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{tab === 'weekly' ? (player.weeklyXP || 0).toLocaleString() : (player.xp || 0).toLocaleString()} XP</p>
                <p className="text-sm text-gray-400">{player.highestWPM} WPM</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Friends Page
function FriendsPage() {
  const { user } = useAuthStore();
  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    const response = await api.getFriends();
    if (response) {
      setFriends((response as any).friends || []);
      setRequests((response as any).incomingRequests || (response as any).incoming_requests || []);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    const response = await api.getUsers(search);
    if (response) {
      const users = (Array.isArray(response) ? response : (response as any).users || []) as User[];
      setSearchResults(users.filter(u => u.id !== user?.id && !friends.some(f => f.id === u.id)));
    }
  };

  const handleAddFriend = async (userId: string) => {
    await api.addFriend(userId);
    handleSearch();
  };

  const handleAccept = async (userId: string) => {
    await api.acceptFriend(userId);
    loadFriends();
  };

  const handleRemove = async (userId: string) => {
    await api.removeFriend(userId);
    loadFriends();
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-8">👥 Friends</h1>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Find Friends</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search username..."
                className="flex-1 bg-surface border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="bg-primary px-4 py-2 rounded-lg">Search</button>
            </div>
            <div className="space-y-2">
              {searchResults.map((u) => (
                <div key={u.id} className="bg-surface p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{u.avatar}</span>
                    <span>{u.username}</span>
                  </div>
                  <button onClick={() => handleAddFriend(u.id)} className="bg-primary px-3 py-1 rounded text-sm">Add</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
            <div className="space-y-2 mb-8">
              {requests.map((u) => (
                <div key={u.id} className="bg-surface p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{u.avatar}</span>
                    <span>{u.username}</span>
                  </div>
                  <button onClick={() => handleAccept(u.id)} className="bg-green-500 px-3 py-1 rounded text-sm">Accept</button>
                </div>
              ))}
              {requests.length === 0 && <p className="text-gray-400">No pending requests</p>}
            </div>

            <h2 className="text-xl font-bold mb-4">Your Friends</h2>
            <div className="space-y-2">
              {friends.map((u) => (
                <div key={u.id} className="bg-surface p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{u.avatar}</span>
                    <span>{u.username}</span>
                    <span className={`w-2 h-2 rounded-full ${(u as any).isOnline ? 'bg-green-400' : 'bg-gray-500'}`}></span>
                  </div>
                  <button onClick={() => handleRemove(u.id)} className="text-red-400 text-sm">Remove</button>
                </div>
              ))}
              {friends.length === 0 && <p className="text-gray-400">No friends yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Teams Page
function TeamsPage() {
  const { user } = useAuthStore();
  const [teams, setTeams] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', tag: '', description: '' });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    const response = await api.getTeams();
    if (response) setTeams(Array.isArray(response) ? response as any[] : (response as any).teams || []);
  };

  const handleCreate = async () => {
    await api.createTeam(createForm);
    setShowCreate(false);
    loadTeams();
  };

  const handleJoin = async (teamId: string) => {
    await api.joinTeam(teamId);
    loadTeams();
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">👥 Teams</h1>
          {!user?.team && (
            <button onClick={() => setShowCreate(true)} className="bg-primary px-6 py-2 rounded-lg font-bold">
              Create Team
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams..."
            className="flex-1 bg-surface border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />
          <button onClick={loadTeams} className="bg-surface px-4 py-2 rounded-lg">Refresh</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-surface border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold">[{team.tag}] {team.name}</h3>
                  <p className="text-sm text-gray-400">{team.description}</p>
                </div>
                <span className="text-2xl" style={{ color: team.color }}>●</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="bg-dark p-2 rounded text-center">
                  <p className="font-bold">{team.members?.length || 0}</p>
                  <p className="text-xs text-gray-400">Members</p>
                </div>
                <div className="bg-dark p-2 rounded text-center">
                  <p className="font-bold">{team.wins || 0}</p>
                  <p className="text-xs text-gray-400">Wins</p>
                </div>
                <div className="bg-dark p-2 rounded text-center">
                  <p className="font-bold">{team.totalXP || 0}</p>
                  <p className="text-xs text-gray-400">XP</p>
                </div>
              </div>
              {user?.team !== team.id && (
                <button onClick={() => handleJoin(team.id)} className="w-full bg-primary py-2 rounded-lg text-sm">
                  Apply to Join
                </button>
              )}
            </div>
          ))}
        </div>

        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Create Team</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Team Name"
                  className="w-full bg-dark border border-white/20 rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  value={createForm.tag}
                  onChange={(e) => setCreateForm({ ...createForm, tag: e.target.value.toUpperCase().slice(0, 5) })}
                  placeholder="Tag (5 chars)"
                  className="w-full bg-dark border border-white/20 rounded-lg px-4 py-2"
                />
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Description"
                  className="w-full bg-dark border border-white/20 rounded-lg px-4 py-2"
                  rows={3}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowCreate(false)} className="flex-1 bg-gray-700 py-2 rounded-lg">Cancel</button>
                <button onClick={handleCreate} className="flex-1 bg-primary py-2 rounded-lg">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Achievements Page
function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    api.getAchievements().then(r => r && setAchievements((r as any).achievements || []));
  }, []);

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-8">🏅 Achievements</h1>
        
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((a) => (
            <div key={a.id} className={`bg-surface border rounded-xl p-4 ${a.unlocked ? 'border-yellow-500' : 'border-white/10'}`}>
              <div className="flex items-center gap-4">
                <span className={`text-4xl ${a.unlocked ? '' : 'grayscale opacity-50'}`}>{a.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold">{a.name}</h3>
                  <p className="text-sm text-gray-400">{a.description}</p>
                </div>
                {a.unlocked && <span className="text-yellow-400">✓</span>}
              </div>
              <div className="mt-2">
                <div className="h-2 bg-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full ${a.unlocked ? 'bg-yellow-500' : 'bg-primary'}`}
                    style={{ width: `${Math.min(((a.progress || 0) / (a.target || 1)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{a.progress || 0}/{a.target || 0}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Missions Page
function MissionsPage() {
  const [missions, setMissions] = useState<{ daily: Mission[]; weekly: Mission[] } | null>(null);

  useEffect(() => {
    api.getMissions().then(r => r && setMissions(r as any));
  }, []);

  if (!missions) return <div className="min-h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-8">📋 Missions</h1>
        
        <h2 className="text-xl font-bold mb-4">☀️ Daily Missions</h2>
        <div className="space-y-4 mb-8">
          {(missions.daily || []).map((m) => (
            <div key={m.id} className="bg-surface border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{m.title}</h3>
                  <p className="text-sm text-gray-400">{m.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold">🪙 {m.reward}</p>
                  {m.completed && <span className="text-green-400 text-sm">✓ Complete</span>}
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.completed ? 'bg-green-400' : 'bg-primary'}`}
                    style={{ width: `${Math.min(((m.progress || 0) / (m.target || 1)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{m.progress}/{m.target}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">📅 Weekly Missions</h2>
        <div className="space-y-4">
          {(missions.weekly || []).map((m) => (
            <div key={m.id} className="bg-surface border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{m.title}</h3>
                  <p className="text-sm text-gray-400">{m.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold">🪙 {m.reward}</p>
                  {m.completed && <span className="text-green-400 text-sm">✓ Complete</span>}
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 bg-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.completed ? 'bg-green-400' : 'bg-purple-400'}`}
                    style={{ width: `${Math.min(((m.progress || 0) / (m.target || 1)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{m.progress}/{m.target}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Profile Page
function ProfilePage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getStats().then(r => r && setStats(r));
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-6">
            <span className="text-8xl">{user.avatar}</span>
            <div>
              <h1 className="text-3xl font-display font-bold">{user.username}</h1>
              <p className="text-gray-400">{user.title} • {user.league} {user.division}</p>
              <p className="text-sm text-gray-500">Level {user.level}</p>
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-surface p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-accent">{stats.highestWPM}</p>
              <p className="text-sm text-gray-400">Best WPM</p>
            </div>
            <div className="bg-surface p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-primary">{stats.averageAccuracy}%</p>
              <p className="text-sm text-gray-400">Avg Accuracy</p>
            </div>
            <div className="bg-surface p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-purple-400">{stats.totalRaces}</p>
              <p className="text-sm text-gray-400">Total Races</p>
            </div>
            <div className="bg-surface p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-yellow-400">{stats.winRate}%</p>
              <p className="text-sm text-gray-400">Win Rate</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">🏆 Achievements</h2>
        <div className="grid grid-cols-4 gap-4">
          {(user.achievements || []).filter(a => a.unlocked).slice(0, 8).map((a) => (
            <div key={a.id} className="bg-surface p-4 rounded-xl text-center">
              <span className="text-3xl">{a.icon}</span>
              <p className="text-sm font-medium mt-2">{a.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Settings Page
function SettingsPage() {
  const { user, refreshUser } = useAuthStore();
  const [settings, setSettings] = useState(user?.settings);

  const handleSave = async () => {
    await api.updateSettings(settings!);
    refreshUser();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-8">⚙️ Settings</h1>
        
        <div className="space-y-6">
          <div className="bg-surface border border-white/10 rounded-xl p-6">
            <h2 className="font-bold mb-4">Sound</h2>
            <label className="flex items-center justify-between">
              <span>Typing Sounds</span>
              <input
                type="checkbox"
                checked={settings?.sound}
                onChange={(e) => setSettings({ ...settings!, sound: e.target.checked })}
                className="w-5 h-5"
              />
            </label>
          </div>

          <div className="bg-surface border border-white/10 rounded-xl p-6">
            <h2 className="font-bold mb-4">Display</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Font Size</label>
                <select
                  value={settings?.fontSize}
                  onChange={(e) => setSettings({ ...settings!, fontSize: e.target.value })}
                  className="w-full bg-dark border border-white/20 rounded-lg px-4 py-2"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Backspace Mode</label>
                <select
                  value={settings?.backspaceMode}
                  onChange={(e) => setSettings({ ...settings!, backspaceMode: e.target.value })}
                  className="w-full bg-dark border border-white/20 rounded-lg px-4 py-2"
                >
                  <option value="normal">Normal</option>
                  <option value="strict">Strict (no backspace)</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-primary py-3 rounded-xl font-bold">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// Classroom Page
function ClassroomPage() {
  useAuthStore();
  const [joinCode, setJoinCode] = useState('');
  const [classroom, setClassroom] = useState<any>(null);

  const handleJoin = async () => {
    const response = await api.joinClassroom(joinCode);
    if (response) {
      setClassroom(response);
    }
  };

  const handleCreate = async () => {
    const name = prompt('Enter classroom name:');
    if (name) {
      const response = await api.createClassroom(name);
      if (response) {
        setClassroom(response);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-8">🎓 Classroom</h1>
        
        {!classroom ? (
          <div className="space-y-6">
            <div className="bg-surface border border-white/10 rounded-xl p-6">
              <h2 className="font-bold mb-4">Join a Classroom</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter join code"
                  className="flex-1 bg-dark border border-white/20 rounded-lg px-4 py-2"
                />
                <button onClick={handleJoin} className="bg-primary px-6 py-2 rounded-lg">Join</button>
              </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-xl p-6">
              <h2 className="font-bold mb-4">Create a Classroom</h2>
              <p className="text-gray-400 mb-4">Teachers can create classrooms to track student progress.</p>
              <button onClick={handleCreate} className="bg-primary px-6 py-2 rounded-lg font-bold">
                Create Classroom
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-surface border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{classroom.name}</h2>
                <p className="text-gray-400">Join Code: <span className="font-mono text-primary">{classroom.joinCode}</span></p>
              </div>
            </div>
            <p className="text-gray-400">Students: {classroom.students?.length || 0}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Stats Page
function StatsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getStats().then(r => r && setStats(r));
  }, []);

  if (!stats) return <div className="min-h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold mb-8">📊 Statistics</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface p-6 rounded-xl text-center">
            <p className="text-4xl font-bold text-accent">{stats.highestWPM}</p>
            <p className="text-gray-400">Best WPM</p>
          </div>
          <div className="bg-surface p-6 rounded-xl text-center">
            <p className="text-4xl font-bold text-primary">{stats.averageAccuracy}%</p>
            <p className="text-gray-400">Avg Accuracy</p>
          </div>
          <div className="bg-surface p-6 rounded-xl text-center">
            <p className="text-4xl font-bold text-purple-400">{stats.totalRaces}</p>
            <p className="text-gray-400">Total Races</p>
          </div>
        </div>

        <div className="bg-surface border border-white/10 rounded-xl p-6">
          <h2 className="font-bold mb-4">Performance</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Races Won</span>
              <span className="font-bold">{stats.racesWon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Win Rate</span>
              <span className="font-bold">{stats.winRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Current League</span>
              <span className="font-bold">{stats.league} {stats.division}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">MMR</span>
              <span className="font-bold">{stats.mmr}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl animate-bounce">🏎️</span>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
      </div>
    </BrowserRouter>
  );
}
