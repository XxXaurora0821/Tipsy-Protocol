
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center selection:bg-amber-500/30">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-[-1] bg-[#030303]">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-[0.03]"></div>
      </div>
      
      {/* Content Container */}
      <main className="w-full max-w-5xl px-6 py-12 md:py-24 flex-grow flex flex-col items-center justify-center z-10">
        {children}
      </main>

      {/* Elegant Footer */}
      <footer className="w-full py-10 text-center relative z-10">
        <div className="h-[1px] w-24 bg-white/5 mx-auto mb-6"></div>
        <p className="text-[9px] text-gray-700 uppercase tracking-[0.6em] font-medium">
          SOUL SPIRITS &bull; ALGORITHMIC MIXOLOGY LAB &bull; Made by XxXaurora
        </p>
      </footer>
    </div>
  );
};
