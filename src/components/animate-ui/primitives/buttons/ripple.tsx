import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  hoverScale?: number;
  tapScale?: number;
  children: React.ReactNode;
}

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, children, hoverScale = 1.02, tapScale = 0.95, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<RippleEffect[]>();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleIdRef = useRef(0);

    const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple: RippleEffect = {
        id: rippleIdRef.current++,
        x,
        y,
      };

      setRipples(prev => [...(prev || []), newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev?.filter(ripple => ripple.id !== newRipple.id) || []);
      }, 600);
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      onClick?.(event);
    };

    return (
      <button
        ref={buttonRef}
        className={cn(
          'relative overflow-hidden transition-transform duration-150 ease-out',
          'hover:scale-[var(--hover-scale)] active:scale-[var(--tap-scale)]',
          className
        )}
        style={{
          '--hover-scale': hoverScale,
          '--tap-scale': tapScale,
        } as React.CSSProperties}
        onClick={handleClick}
        {...props}
      >
        {children}
        <RippleButtonRipples ripples={ripples} />
      </button>
    );
  }
);

RippleButton.displayName = 'RippleButton';

interface RippleButtonRipplesProps {
  ripples?: RippleEffect[];
}

export const RippleButtonRipples = ({ ripples }: RippleButtonRipplesProps) => {
  if (!ripples || ripples.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            backgroundColor: 'var(--ripple-button-ripple-color, rgba(255, 255, 255, 0.6))',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s linear',
          }}
        />
      ))}
    </div>
  );
};
