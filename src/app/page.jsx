"use client";

import Link from "next/link";
import { useState } from "react";

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="Brezora"
                className="h-12 w-12 rounded-full object-cover"
              />
              Inzora
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </nav>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
            <Link
              href="/login"
              className="block text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Grow Your Instagram Organically & Track Your Progress In Real-Time
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            INZORA by Brezora — Helping creators and brands <br /> to grow on
            Instagram in a smart, reliable way.
          </p>
          <Link href="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-600 font-medium">
            Trusted by 99+ creators and brands to grow their social media
            presence.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with our simple process and watch your Instagram
              growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "1",
                title: "Add Zora Coins",
                desc: "Add coins to order all services",
                bg: "bg-blue-100",
                color: "text-blue-600",
              },
              {
                num: "2",
                title: "Select Any Service",
                desc: "Pick what suits your growth service",
                bg: "bg-green-100",
                color: "text-green-600",
              },
              {
                num: "3",
                title: "Add the Details",
                desc: "Add your Instagram post/reel or profile link",
                bg: "bg-purple-100",
                color: "text-purple-600",
              },
              {
                num: "4",
                title: "Watch Your Social Growth",
                desc: "Sit back and see your social growth",
                bg: "bg-orange-100",
                color: "text-orange-600",
              },
            ].map((item, idx) => (
              <div className="text-center" key={idx}>
                <div
                  className={`${item.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <span className={`text-2xl font-bold ${item.color}`}>
                    {item.num}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                70% Organic Reach
              </h3>
              <p className="text-gray-600">
                Authentic growth through organic engagement strategies
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                30-70% Audience Engagement
              </h3>
              <p className="text-gray-600">
                Genuine mixed audience followers who interact with your content
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Weekly & Monthly Growth Reports
              </h3>
              <p className="text-gray-600">
                Detailed analytics to track your progress and optimize strategy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">99+</div>
              <p className="text-gray-600">Happy Creators</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10M+</div>
              <p className="text-gray-600">Views Generated</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">12/7</div>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* The rest of your Contact & Footer sections would be kept exactly the same */}
    </div>
  );
};

export default LandingPage;
