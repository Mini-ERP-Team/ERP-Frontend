import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`mt-4 flex w-full items-center justify-center rounded-lg bg-primary hover:bg-blue-600 active:bg-blue-700 h-12 px-6 text-white text-base font-bold tracking-wide transition-all shadow-lg shadow-primary/20 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;