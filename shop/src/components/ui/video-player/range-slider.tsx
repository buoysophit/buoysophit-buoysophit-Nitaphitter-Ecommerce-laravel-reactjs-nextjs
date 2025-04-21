'use client';

import React from 'react';
import Slider from 'rc-slider';
import type { SliderProps } from 'rc-slider';

import 'rc-slider/assets/index.css';
import { cn } from '@lib/cn';

const rangeStyles = {
  base: '[&>.rc-slider-rail]:bg-muted [&>.rc-slider-handle]:opacity-100 [&>.rc-slider-handle-dragging]:!shadow-none [&>.rc-slider-handle-dragging]:ring-4',
  size: {
    sm: '[&>.rc-slider-rail]:h-0.5 [&>.rc-slider-track]:h-0.5 [&>.rc-slider-handle]:h-3 [&>.rc-slider-handle]:w-3 [&>.rc-slider-handle]:border-[3px]',
    md: '[&>.rc-slider-rail]:h-1 [&>.rc-slider-track]:h-1 [&>.rc-slider-handle]:h-4 [&>.rc-slider-handle]:w-4 [&>.rc-slider-handle]:border-4 [&>.rc-slider-handle]:-mt-1.5',
    lg: '[&>.rc-slider-rail]:h-2 [&>.rc-slider-track]:h-2 [&>.rc-slider-handle]:h-5 [&>.rc-slider-handle]:w-5 [&>.rc-slider-handle]:border-[5px] [&>.rc-slider-handle]:-mt-1.5',
    xl: '[&>.rc-slider-rail]:h-3 [&>.rc-slider-track]:h-3 [&>.rc-slider-handle]:h-6 [&>.rc-slider-handle]:w-6 [&>.rc-slider-handle]:border-[6px] [&>.rc-slider-handle]:-mt-1.5',
  },
  color: {
    primary:
      '[&>.rc-slider-track]:bg-primary [&>.rc-slider-handle]:border-primary-dark [&>.rc-slider-handle]:hover:border-primary-dark [&>.rc-slider-handle-dragging]:!border-primary-dark [&>.rc-slider-handle-dragging]:ring-primary/40 [&>.rc-slider-step>.rc-slider-dot-active]:border-primary-dark',
    secondary:
      '[&>.rc-slider-track]:bg-secondary [&>.rc-slider-handle]:border-secondary-dark [&>.rc-slider-handle]:hover:border-secondary-dark [&>.rc-slider-handle-dragging]:!border-secondary-dark [&>.rc-slider-handle-dragging]:ring-secondary/40 [&>.rc-slider-step>.rc-slider-dot-active]:border-secondary-dark',
    danger:
      '[&>.rc-slider-track]:bg-red [&>.rc-slider-handle]:border-red-dark [&>.rc-slider-handle]:hover:border-red-dark [&>.rc-slider-handle-dragging]:!border-red-dark [&>.rc-slider-handle-dragging]:ring-red/40 [&>.rc-slider-step>.rc-slider-dot-active]:border-red-dark',
  },
};

export interface RangeSliderProps extends SliderProps {
  size?: keyof typeof rangeStyles.size;
  color?: keyof typeof rangeStyles.color;
}

export default function RangeSlider({
  size = 'md',
  color = 'primary',
  className,
  ...props
}: RangeSliderProps) {
  return (
    <Slider
      className={cn(
        rangeStyles.base,
        rangeStyles.size[size],
        rangeStyles.color[color],
        className
      )}
      {...props}
    />
  );
}

RangeSlider.displayName = 'RangeSlider';