import Link from 'next/link';
import Button from '@/components/Button';
import { Heart, BookOpen, Bot, TrendingUp, Sparkles, Shield, Clock, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-lg mb-8">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Mental Health
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              {' '}Matters
            </span>
          </h1>
          <p className="text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Track your mood, journal your thoughts, and get AI-powered support for your mental wellness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-10">
          <div className="glassmorphism rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300 animate-slide-up">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Journal Your Thoughts</h3>
            <p className="text-gray-600 leading-relaxed">
              Express yourself freely with our private journaling feature. Track your mood and reflect on your day with beautiful, intuitive tools.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Support</h3>
            <p className="text-gray-600 leading-relaxed">
              Get compassionate AI-powered conversations and personalized coping strategies when you need them most.
            </p>
          </div>

          <div className="glassmorphism rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize your mental health journey with detailed analytics and mood trend analysis to understand your patterns.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 glassmorphism rounded-3xl p-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="grid md:grid-cols-4 gap-10 text-center">
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support Available</div>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-800 bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-gray-600 font-medium">Private & Secure</div>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent mb-2">AI-Powered</div>
              <div className="text-gray-600 font-medium">Mental Health Support</div>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-800 bg-clip-text text-transparent mb-2">Free</div>
              <div className="text-gray-600 font-medium">Basic Features</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to prioritize your mental health?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Join thousands of users who are taking control of their mental wellness journey with our comprehensive tools.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Sparkles className="w-6 h-6 mr-3" />
              Get Started Today
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">MentalHealth</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Supporting your mental wellness journey with compassion and cutting-edge technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Features</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors duration-300">Journal Entries</li>
                <li className="hover:text-white transition-colors duration-300">Mood Tracking</li>
                <li className="hover:text-white transition-colors duration-300">AI Chatbot</li>
                <li className="hover:text-white transition-colors duration-300">Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors duration-300">Help Center</li>
                <li className="hover:text-white transition-colors duration-300">Contact Us</li>
                <li className="hover:text-white transition-colors duration-300">Privacy Policy</li>
                <li className="hover:text-white transition-colors duration-300">Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Emergency</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors duration-300">988 - Suicide Prevention</li>
                <li className="hover:text-white transition-colors duration-300">911 - Emergency</li>
                <li className="hover:text-white transition-colors duration-300">Crisis Text Line</li>
                <li className="hover:text-white transition-colors duration-300">Mental Health Resources</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MentalHealth. All rights reserved.</p>
            <p className="mt-3 text-sm leading-relaxed">
              This app is for educational and support purposes only. 
              It is not a replacement for professional mental health care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
