
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogin: (status: boolean) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'TLC@2024!') {
      onLogin(true);
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-black text-white rounded-[1.5rem] flex items-center justify-center mx-auto text-4xl font-black mb-8 shadow-2xl">T</div>
          <h1 className="text-5xl font-black text-black tracking-tighter leading-none mb-4">Admin Login</h1>
          <p className="text-xl text-slate-500 font-medium">Three Level of Credit Management</p>
        </div>
        
        {error && (
          <div className="mb-10 p-5 bg-red-50 text-red-700 rounded-2xl text-sm font-bold text-center border border-red-100 animate-in shake-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3rem] card-shadow border border-slate-100 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</label>
            <input
              type="text"
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
            <input
              type="password"
              required
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-6 bg-black text-white font-black text-xl rounded-2xl hover:opacity-85 transition active:scale-95 shadow-2xl"
          >
            Login to Dashboard
          </button>
        </form>
        
        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Admin Access</p>
          <p className="text-slate-300 text-xs mt-2">Contact administrator for credentials</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
