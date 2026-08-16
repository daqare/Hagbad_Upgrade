import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#D4A017', '#0F3D2E', '#279697', '#E76F51', '#9d4f9f'];

export function Confetti({ count = 60 }) {
  const pieces = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i, x: Math.random() * 100, delay: Math.random() * 0.4,
      dur: 2.4 + Math.random() * 1.6, size: 6 + Math.random() * 6,
      color: COLORS[i % COLORS.length], rot: Math.random() * 360,
    })), [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rot + 360 }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'linear' }}
          style={{ position: 'absolute', width: p.size, height: p.size, background: p.color, borderRadius: 2 }} />
      ))}
    </div>
  );
}
