import React from 'react';
import { PhoneCall, AlertTriangle } from 'lucide-react';

const EmergencyBanner: React.FC = () => {
  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md border-b border-red-500/20">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg animate-pulse">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm md:text-base tracking-wide leading-tight">
              สายด่วนฉุกเฉิน 1669 / ติดต่อวอร์ด
            </p>
            <p className="text-xs text-red-100 font-light mt-0.5">
              หน้าเบี้ยว แขนขาอ่อนแรง พูดไม่ชัด รีบติดต่อกู้ชีพทันที
            </p>
          </div>
        </div>
        
        <div className="flex w-full md:w-auto gap-2.5">
          <a
            href="tel:1669"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-red-600 font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-red-900/10 hover:bg-red-50 active:scale-95 transition-all duration-200 touch-manipulation text-sm sm:text-base"
            style={{ minHeight: '48px' }}
          >
            <PhoneCall className="h-4 w-4" />
            โทร 1669
          </a>
          <a
            href="tel:1118"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-5 rounded-xl border border-white/20 active:scale-95 transition-all duration-200 touch-manipulation text-sm sm:text-base"
            style={{ minHeight: '48px' }}
          >
            <PhoneCall className="h-4 w-4" />
            ติดต่อวอร์ด (1118)
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
