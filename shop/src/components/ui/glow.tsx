import { cn } from '@lib/cn';
import React from 'react';

type GlowProps = {
  className?: string;
};

function Glow({ className }: GlowProps) {
  return (
    <span
      className={cn(
        'absolute opacity-50 bg-[#BDE4DC] blur-3xl aspect-square',
        className,
      )}
    />
  );
}

export default Glow;
