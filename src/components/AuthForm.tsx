import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  communityId: string;
}

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    communityId: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (isSignUp) {
      if (!formData.firstName || !formData.lastName || !formData.communityId) {
        setError('All fields are required');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const { data, error } = await signUp({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          communityId: formData.communityId,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created successfully! Please check your email to verify your account.');
          // Reset form
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            communityId: '',
          });
        }
      } else {
        const { data, error } = await signIn({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess('Signed in successfully!');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      communityId: '',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 25%, #16213e 50%, #0f172a 75%, #000000 100%)'
    }}>
      {/* Animated background shapes */}
      <div className="bg-shape absolute w-48 h-48 -top-24 -left-24 bg-gradient-to-br from-purple-500/20 to-purple-700/10 rounded-full blur-sm animate-pulse"></div>
      <div className="bg-shape absolute w-36 h-36 -bottom-18 -right-18 bg-gradient-to-br from-purple-400/15 to-purple-600/5 rounded-full blur-sm animate-pulse delay-1000"></div>
      <div className="bg-shape absolute w-24 h-24 top-1/2 left-1/10 bg-gradient-to-br from-purple-600/30 to-transparent rounded-full blur-sm animate-pulse delay-2000"></div>

      <div 
        className={`
          bg-gradient-to-br from-black/95 via-slate-900/90 to-black/95 
          backdrop-blur-xl rounded-3xl shadow-2xl 
          border border-purple-500/30 
          flex flex-col md:flex-row overflow-hidden max-w-4xl w-full mx-4 
          min-h-[500px] relative z-10 
          transition-all duration-700 ease-in-out
          ${isSignUp ? 'md:transform' : ''}
        `}
        style={{
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(139, 92, 246, 0.2),
            inset 0 1px 0 rgba(139, 92, 246, 0.1)
          `
        }}
      >
        {/* Welcome Panel */}
        <div 
          className={`
            bg-gradient-to-br from-black via-purple-900/30 to-purple-600 
            flex-1 p-8 md:p-16 hidden md:flex flex-col justify-center items-center text-center 
            text-white relative overflow-hidden
            transition-transform duration-700 ease-in-out
            ${isSignUp ? 'md:translate-x-full' : ''}
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-45 from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
          
          <div className="relative z-10">
            <h1 
              className="text-5xl font-bold mb-6 font-serif tracking-wider"
              style={{
                textShadow: `
                  0 2px 10px rgba(0, 0, 0, 0.7),
                  0 0 30px rgba(139, 92, 246, 0.6),
                  0 0 60px rgba(124, 58, 237, 0.4)
                `,
                background: 'linear-gradient(45deg, #ffffff, #e0e7ff, #c7d2fe, #a5b4fc)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {isSignUp ? 'Welcome Back!' : 'Hello, Friend!'}
            </h1>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              {isSignUp 
                ? 'To keep connected with us please login with your personal info'
                : 'Enter your personal details and start your journey with us'
              }
            </p>
            <button
              onClick={toggleForm}
              className="
                bg-gradient-to-r from-black/70 to-purple-600/30 
                border-2 border-purple-500/50 text-white 
                px-8 py-4 rounded-full font-bold text-lg
                transition-all duration-300 ease-in-out
                backdrop-blur-lg relative overflow-hidden
                hover:border-purple-500/80 hover:shadow-lg hover:shadow-purple-500/25
                hover:-translate-y-1
              "
            >
              <span className="relative z-10">
                {isSignUp ? 'SIGN IN' : 'SIGN UP'}
              </span>
            </button>
          </div>
        </div>

        {/* Form Panel */}
        <div 
          className={`
            flex-1 bg-gradient-to-br from-black/95 via-slate-900/90 to-black/95 
            p-8 md:p-16 flex flex-col justify-center
            md:border-l md:border-purple-500/20 relative
            transition-transform duration-700 ease-in-out
            ${isSignUp ? 'md:-translate-x-full' : ''}
          `}
        >
          <div className="hidden md:block absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-500/80 to-transparent animate-pulse"></div>
          
          <div className="text-center mb-12">
            <h2 
              className="text-4xl font-bold text-purple-400 mb-3"
              style={{
                textShadow: `
                  0 0 10px rgba(139, 92, 246, 0.5),
                  0 0 20px rgba(139, 92, 246, 0.3)
                `
              }}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignUp 
                ? 'Join us today! Please fill in your details'
                : 'Welcome back! Please sign in to your account'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-400 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="
                      w-full px-6 py-4 border-2 border-gray-600 rounded-full 
                      bg-gray-900/50 text-white text-lg
                      transition-all duration-300 ease-in-out
                      backdrop-blur-lg placeholder-gray-400
                      focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/25
                    "
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="
                      w-full px-6 py-4 border-2 border-gray-600 rounded-full 
                      bg-gray-900/50 text-white text-lg
                      transition-all duration-300 ease-in-out
                      backdrop-blur-lg placeholder-gray-400
                      focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/25
                    "
                  />
                </div>
              </div>
            )}

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="
                  w-full px-6 py-4 border-2 border-gray-600 rounded-full 
                  bg-gray-900/50 text-white text-lg
                  transition-all duration-300 ease-in-out
                  backdrop-blur-lg placeholder-gray-400
                  focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/25
                "
              />
            </div>

            {isSignUp && (
              <div>
                <input
                  type="text"
                  name="communityId"
                  placeholder="Community ID"
                  value={formData.communityId}
                  onChange={handleInputChange}
                  required={isSignUp}
                  className="
                    w-full px-6 py-4 border-2 border-gray-600 rounded-full 
                    bg-gray-900/50 text-white text-lg
                    transition-all duration-300 ease-in-out
                    backdrop-blur-lg placeholder-gray-400
                    focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/25
                  "
                />
              </div>
            )}

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="
                  w-full px-6 py-4 border-2 border-gray-600 rounded-full 
                  bg-gray-900/50 text-white text-lg
                  transition-all duration-300 ease-in-out
                  backdrop-blur-lg placeholder-gray-400
                  focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/25
                "
              />
            </div>

            {isSignUp && (
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={isSignUp}
                  className="
                    w-full px-6 py-4 border-2 border-gray-600 rounded-full 
                    bg-gray-900/50 text-white text-lg
                    transition-all duration-300 ease-in-out
                    backdrop-blur-lg placeholder-gray-400
                    focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/25
                  "
                />
              </div>
            )}

            {!isSignUp && (
              <div className="text-center">
                <a 
                  href="#" 
                  className="
                    text-purple-400 text-sm transition-all duration-300
                    hover:text-purple-300 hover:underline
                  "
                  style={{
                    textShadow: '0 0 10px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  Forgot your password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full py-4 rounded-full font-bold text-xl text-white
                bg-gradient-to-r from-black via-purple-900/30 to-purple-600
                border-2 border-purple-500/50 relative overflow-hidden
                transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/25
                hover:border-purple-500/80 disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:translate-y-0 disabled:hover:shadow-none
              "
              style={{
                boxShadow: `
                  0 4px 15px rgba(0, 0, 0, 0.3),
                  0 0 20px rgba(139, 92, 246, 0.2),
                  inset 0 1px 0 rgba(139, 92, 246, 0.2)
                `
              }}
            >
              <span className="relative z-10">
                {isSubmitting ? 'Loading...' : (isSignUp ? 'SIGN UP' : 'SIGN IN')}
              </span>
            </button>
            
            {/* Mobile Toggle Button */}
            <div className="md:hidden text-center mt-6">
              <p className="text-slate-400 text-sm mb-2">
                {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
              </p>
              <button
                type="button"
                onClick={toggleForm}
                className="text-purple-400 font-bold hover:text-purple-300 transition-colors underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}