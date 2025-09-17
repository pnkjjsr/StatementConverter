
'use client';

import { motion, type MotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedSection({ children, className, ...props }: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}
