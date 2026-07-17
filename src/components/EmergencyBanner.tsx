import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmergencyBanner: React.FC = () => {
  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md border-b border-orange-400/20">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex justify-center items-center gap-3 text-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg animate-pulse shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm md:text-base tracking-wide leading-tight">
              สัญญาณเตือนโรคหลอดเลือดสมอง F.A.S.T (หน้าเบี้ยว แขนขาอ่อนแรง พูดไม่ชัด)
            </p>
            <p className="text-xs text-orange-50 font-light mt-0.5">
              หากพบอาการข้อใดข้อหนึ่ง ให้รีบนำส่งโรงพยาบาลโดยเร็วที่สุด
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
