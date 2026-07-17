import React from 'react';
import { ExternalLink, BookOpen, Activity, Home, ClipboardList, Video } from 'lucide-react';
import type { StrokeLink } from '../utils/parseExcel';

interface ContentCardProps {
  item: StrokeLink;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'ความรู้โรคหลอดเลือดสมอง':
      return <BookOpen className="h-4 w-4 text-blue-600" />;
    case 'คู่มือการดูแลผู้ป่วยที่บ้าน':
      return <Home className="h-4 w-4 text-emerald-600" />;
    case 'การฟื้นฟูและกายภาพบำบัด':
      return <Activity className="h-4 w-4 text-violet-600" />;
    case 'แบบประเมินและข้อคิดเห็น':
      return <ClipboardList className="h-4 w-4 text-amber-600" />;
    default:
      return <BookOpen className="h-4 w-4 text-slate-600" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'ความรู้โรคหลอดเลือดสมอง':
      return 'bg-blue-50 text-blue-800 border-blue-100/80';
    case 'คู่มือการดูแลผู้ป่วยที่บ้าน':
      return 'bg-emerald-50 text-emerald-800 border-emerald-100/80';
    case 'การฟื้นฟูและกายภาพบำบัด':
      return 'bg-violet-50 text-violet-800 border-violet-100/80';
    case 'แบบประเมินและข้อคิดเห็น':
      return 'bg-amber-50 text-amber-800 border-amber-100/80';
    default:
      return 'bg-slate-50 text-slate-800 border-slate-100';
  }
};

const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-slate-100/80 hover:-translate-y-1 group relative overflow-hidden">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-2xl text-xs font-semibold border ${getCategoryColor(
              item.Category
            )}`}
          >
            {getCategoryIcon(item.Category)}
            {item.Category}
          </span>
          
          {item.IsVideo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-2xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 animate-pulse">
              <Video className="h-3.5 w-3.5" />
              วิดีโอ
            </span>
          )}
        </div>
        
        <h3 className="text-base font-bold text-slate-800 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
          {item.Title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">
          {item.Description}
        </p>
      </div>

      <div className="px-6 pb-6 mt-auto">
        <a
          href={item.Link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 touch-manipulation"
          style={{ minHeight: '48px' }}
        >
          <span>เปิดดูข้อมูล / ชมคลิป</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default ContentCard;
