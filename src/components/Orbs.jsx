import React from 'react';
import { motion } from 'framer-motion';

export function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
      <motion.div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 24, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-gold-400/20 blur-3xl"
        animate={{ x: [0, -36, 0], y: [0, 30, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-plum-500/15 blur-3xl"
        animate={{ x: [0, 28, 0], y: [0, -20, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  );
}
