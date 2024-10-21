import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, UserPlus, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (await register(username, email, password)) {
        navigate('/schedule');
      } else {
        alert('Registration failed. Username or email may already exist.');
      }
    } else {
      if (await login(username, password)) {
        navigate('/schedule');
      } else {
        alert('Invalid credentials');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full">
        <div className="w-1/2 px-8 py-6">
          <h3 className="text-2xl font-bold text-center flex items-center justify-center mb-4">
            {isRegistering ? <UserPlus className="mr-2" /> : <LogIn className="mr-2" />}
            Welcome to Inclass
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {isRegistering && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            )}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {isRegistering ? 'Register' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-blue-600 hover:text-blue-800"
              >
                {isRegistering ? 'Back to Login' : 'Register'}
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/2">
          <img
            src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Classroom with teacher and students"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;