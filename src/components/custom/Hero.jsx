import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#f9fafb] to-[#e5e7eb] py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center gap-8 max-w-4xl"
      >
        <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f56551] to-[#e53e3e]">
            Discover Your Next Adventure with AI:
          </span>{' '}
          <br />
          <span className="text-gray-900">Personalized Itineraries at Your Fingertips</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>
        <Link to={'/create-trip'}>
          <Button
            className="bg-gradient-to-r from-[#f56551] to-[#e53e3e] text-white font-semibold py-3 px-6 rounded-full hover:from-[#e53e3e] hover:to-[#f56551] transition-all shadow-lg hover:shadow-xl"
          >
            Get Started, It's Free
          </Button>
        </Link>
        <motion.img
          src="/landing.png"
          alt="Travel Illustration"
          className="mt-10 w-full max-w-4xl rounded-lg shadow-2xl border-2 border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.div>
    </div>
  );
}

export default Hero;