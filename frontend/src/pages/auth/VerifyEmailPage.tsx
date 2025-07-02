import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { VerificationCodeInput } from '../../components/VerificationCodeInput';
import { useAuth } from '../../context/AuthContext';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, completeSignUp, sendVerificationCode } = useAuth();
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get email from location state or localStorage
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('verificationEmail');
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('verificationEmail', stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate('/auth/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Initialize resend timer if not already running
    if (resendTimer === 0) {
      setResendTimer(24);
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleVerificationComplete = (code: string) => {
    setVerificationCode(code);
    setError('');
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // 验证 OTP
      const response = await verifyOtp(email, verificationCode);
      if (response.error) throw response.error;

      // 完成注册
      await completeSignUp();

      // 清理并跳转
      localStorage.removeItem('verificationEmail');
      navigate('/auth/login', { 
        state: { message: 'Email verified successfully! Please log in.' }
      });
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    try {
      await sendVerificationCode(email, false);
      setResendTimer(24);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    localStorage.setItem('verificationEmail', email);
    // TODO: Implement email update logic if needed
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Logo */}
          <div className="mb-8">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-8" src="/logo.svg" alt="MaxIn Logo" />
              <span className="ml-2 text-xl font-semibold text-gray-900">MaxIn</span>
            </Link>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Verify your email
            </h2>

            {/* Email display/edit */}
            <div className="mt-4">
              {isEditing ? (
                <form onSubmit={handleEmailUpdate} className="flex items-center justify-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="max-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                  {email}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Edit
                  </button>
                </p>
              )}
            </div>

            {/* Verification code input */}
            <div className="mt-6">
              <VerificationCodeInput onComplete={handleVerificationComplete} />
            </div>

            {/* Error message */}
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Continue Button */}
            <div className="mt-6">
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || !verificationCode || verificationCode.length !== 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Continue'}
              </button>
            </div>

            {/* Resend code */}
            <div className="mt-6">
              <button
                onClick={handleResendCode}
                disabled={resendTimer > 0}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Didn't receive a code? {' '}
                <span className="text-orange-500">
                  {resendTimer > 0 ? `Resend (${resendTimer})` : 'Resend'}
                </span>
              </button>
            </div>

            {/* Support contact */}
            <div className="mt-8 text-sm text-gray-500">
              Need help? Contact support at{' '}
              <a href="mailto:support@maxin.com" className="text-orange-500 hover:text-orange-600">
                support@maxin.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 