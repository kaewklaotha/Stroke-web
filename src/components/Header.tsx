import React from 'react';
import { HeartPulse } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="glass-effect border-b border-slate-100 shadow-sm sticky top-[72px] md:top-[60px] z-40 w-full transition-all">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-orange-500 to-blue-600 p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/15">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 leading-tight tracking-wide">
              คำแนะนำและคู่มือการดูแลผู้ป่วย Stroke
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              ศูนย์รวมคู่มือการเรียนรู้และการดูแลผู้ป่วยโรคหลอดเลือดสมองอย่างถูกวิธี
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
