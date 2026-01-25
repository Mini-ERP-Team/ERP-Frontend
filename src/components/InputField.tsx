import React, { useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, icon, type = "text", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="flex flex-col gap-2">
      <span className="text-white text-sm font-medium">{label}</span>
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-4 text-text-secondary">
          {icon}
        </span>
        <input
          className="flex w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border-none bg-input-bg focus:border-primary h-14 placeholder:text-text-secondary pl-12 pr-12 text-base transition-all"
          type={isPassword ? (showPassword ? "text" : "password") : type}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-text-secondary hover:text-white transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        )}
      </div>
    </label>
  );
};

export default InputField;