import { ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

export default function SectionHeading({ title, subtitle, className = '', children }: SectionHeadingProps) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-serif text-botanical-green-800 mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-botanical-green-700 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}

