import React from 'react';
import { Link } from 'react-router-dom';

export function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Logo and Title */}
          <div className="mb-8">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-8"
                src="/logo.svg"
                alt="MaxIn Logo"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">MaxIn</span>
            </Link>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent you a verification link to your email address.
              Please click the link to verify your account.
            </p>

            <div className="mt-6">
              <svg
                className="mx-auto h-12 w-12 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                />
              </svg>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Didn't receive the email?{' '}
                <Link to="/auth/login" className="font-medium text-orange-500 hover:text-orange-400">
                  Try signing in
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <Link
                to="/"
                className="text-sm font-medium text-orange-500 hover:text-orange-400"
              >
                Return to home page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 