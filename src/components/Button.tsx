import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  target,
  rel,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-md';
  
  const variantStyles = {
    primary: 'bg-botanical-green-600 text-botanical-cream-50 hover:bg-botanical-green-700',
    secondary: 'bg-botanical-cream-500 text-botanical-green-900 hover:bg-botanical-cream-600',
    outline: 'border-2 border-botanical-green-600 text-botanical-green-700 hover:bg-botanical-green-50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

