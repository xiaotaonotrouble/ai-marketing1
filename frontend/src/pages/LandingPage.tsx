import React from 'react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">MaxInfluencer,</span>
                  <span className="block text-orange-500">Your AI Marketing Assistant</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Professional AI taking over your influencer & affiliate marketing.
                  Let AI handle your marketing strategy, execution, and optimization.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => navigate('/auth/signup')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 md:py-4 md:text-lg md:px-10"
                    >
                      Try now
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              AI Marketer Can Do This?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Let your AI Marketer predict, execute & optimize your marketing tasks, no more guesswork
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Generate your brand DNA in one click
                  </h3>
                  <p className="text-gray-500">
                    Drop your website link and watch Max instantly craft your unique brand identity. 
                    In just seconds, we will capture your core values, key message, and market position.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Taking over your influencer marketing
                  </h3>
                  <p className="text-gray-500">
                    We take over your entire influencer marketing process, from matching the perfect fit 
                    creators to negotiating deals and tracking performance.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Fully responsible for your affiliate marketing
                  </h3>
                  <p className="text-gray-500">
                    We fully manage your affiliate program, recruiting high-converting partners, 
                    optimizing commission structures, and tracking conversions in real time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-white">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => navigate('/auth/signup')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50"
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 