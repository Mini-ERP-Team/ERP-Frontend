import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submit clicked");
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[380px] mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-white tracking-tight text-3xl font-bold leading-tight pb-2">Welcome Back!</h1>
          <p className="text-text-secondary text-base font-normal">Please log in to your account.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <InputField 
            label="Email Address or Username" 
            placeholder="admin@techstore.com" 
            icon="person"
          />
          
          <InputField 
            label="Password" 
            placeholder="••••••••" 
            type="password"
            icon="lock"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="rounded border-text-secondary bg-input-bg text-primary focus:ring-offset-[#111418] focus:ring-primary w-4 h-4"
              />
              <span className="text-text-secondary text-sm font-medium group-hover:text-white transition-colors">Remember me</span>
            </label>
            <a className="text-sm font-medium text-primary hover:text-blue-400 transition-colors" href="#">Forgot Password?</a>
          </div>

          <Button type="submit">Sign In</Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;