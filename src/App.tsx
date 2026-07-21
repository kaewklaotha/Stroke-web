import React, { useEffect, useState, useMemo } from 'react';
import { fetchAndParseExcel, type StrokeLink } from './utils/parseExcel';
import EmergencyBanner from './components/EmergencyBanner';
import Header from './components/Header';
import SearchFilterBar from './components/SearchFilterBar';
import ContentCard from './components/ContentCard';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [links, setLinks] = useState<StrokeLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchAndParseExcel();
      setLinks(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(links.map((link) => link.Category).filter(Boolean)));
    return ['ทั้งหมด', ...cats];
  }, [links]);

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesCategory = selectedCategory === 'ทั้งหมด' || link.Category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        link.Title?.toLowerCase().includes(query) ||
        link.Description?.toLowerCase().includes(query) ||
        link.Category?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [links, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 relative pb-12 flex flex-col font-prompt">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-orange-400/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40vh] left-0 -ml-20 w-80 h-80 rounded-full bg-blue-400/5 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 -mr-10 w-96 h-96 rounded-full bg-orange-400/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 flex-1 flex flex-col">
        <EmergencyBanner />
        <Header />
        
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-orange-500" />
              <p className="text-sm font-medium">กำลังโหลดข้อมูลระบบ...</p>
            </div>
          ) : (
            <>
              {/* Item Counter */}
              <div className="text-sm font-semibold text-slate-500 mb-4 px-1.5 flex justify-between items-center">
                <span>แสดงผล {filteredLinks.length} จาก {links.length} รายการ</span>
                {selectedCategory !== 'ทั้งหมด' && (
                  <span className="bg-orange-50 text-orange-700 px-2.5 py-0.5 rounded-full text-xs border border-orange-100">
                    กรองตาม: {selectedCategory}
                  </span>
                )}
              </div>

              {filteredLinks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredLinks.map((item, index) => (
                    <ContentCard key={index} item={item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto px-6">
                  <p className="text-slate-400 text-lg font-medium">ไม่พบข้อมูลที่ค้นหา</p>
                  <p className="text-slate-400 text-xs mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ทั้งหมด');
                    }}
                    className="mt-5 px-6 py-2.5 bg-slate-50 border border-slate-200/80 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 hover:border-orange-100 hover:text-orange-700 transition-colors active:scale-95 text-sm"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
