import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-background-dark font-display text-white overflow-x-hidden min-h-screen relative flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')]">
        <div className="absolute inset-0 bg-[#111418]/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
      </div>

      <main className="relative z-10 w-full max-w-5xl bg-card-bg border border-[#283039] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        <div className="flex-1 p-8 sm:p-12 lg:p-14 border-b md:border-b-0 md:border-r border-[#283039]">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">grid_view</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none">TechRetail</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">Management System</span>
            </div>
          </div>
          
          {children}

          <div className="mt-12 flex flex-col gap-1 text-xs text-[#586474] text-center md:text-left">
            <p className="font-medium flex items-center justify-center md:justify-start gap-1.5">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Internal Access Only
            </p>
            <p>© 2026 TechRetail Systems. v4.2.0</p>
          </div>
        </div>

        <div className="flex-1 bg-[#161c24] p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')]"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs font-medium text-white/90">System Operational</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Secure Enterprise Portal</h2>
              <p className="text-lg text-slate-400 font-normal leading-relaxed max-w-sm">
                Access inventory management, sales tracking, and component logistics securely from anywhere.
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="material-symbols-outlined text-primary mb-2">inventory_2</span>
                  <p className="text-sm font-semibold text-white">Inventory</p>
                  <p className="text-xs text-slate-500">Real-time tracking</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="material-symbols-outlined text-primary mb-2">analytics</span>
                  <p className="text-sm font-semibold text-white">Analytics</p>
                  <p className="text-xs text-slate-500">Sales performance</p>
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;