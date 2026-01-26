import React from "react";

type ErrorAlertProps = {
  message: string;
  className?: string;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, className = "" }) => {
  return (
    <div
      className={`flex items-center gap-3 mt-2 mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg ${className}`}
      role="alert"
      aria-live="polite"
    >
      <span className="material-symbols-outlined text-red-500 text-[20px]">
        error
      </span>
      <p className="text-red-500 text-sm font-medium leading-normal">{message}</p>
    </div>
  );
};

export default ErrorAlert;
