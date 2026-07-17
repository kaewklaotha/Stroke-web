import React from 'react';
import { Search } from 'lucide-react';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'ความรู้โรคหลอดเลือดสมอง':
      return '🏥 ';
    case 'คู่มือการดูแลผู้ป่วยที่บ้าน':
      return '🏠 ';
    case 'การฟื้นฟูและกายภาพบำบัด':
      return '🏋️ ';
    case 'แบบประเมินและข้อคิดเห็น':
      return '📝 ';
    default:
      return '';
  }
};

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  return (
    <div className="glass-effect border-b border-slate-100/80 py-4 px-4 sticky top-[144px] md:top-[132px] z-30 shadow-sm transition-all">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border border-slate-200/80 rounded-2xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white sm:text-base transition-all duration-200 shadow-inner"
            placeholder="ค้นหา เช่น 'เช็ดตัว', 'สายยาง', 'กายภาพ'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minHeight: '48px' }}
          />
        </div>

        {/* Scrollable Category Pills */}
        <div className="flex overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-250 active:scale-95 touch-manipulation border ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white border-transparent shadow-lg shadow-orange-500/15'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-800'
              }`}
              style={{ minHeight: '40px' }}
            >
              {category === 'ทั้งหมด' ? '🌐 ทั้งหมด' : `${getCategoryEmoji(category)}${category}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
