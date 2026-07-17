import * as xlsx from 'xlsx';

export interface RawStrokeLink {
  Source_Image: string;
  QR_Position_Index: number | string;
  Category: string;
  Fetched_Title: string;
  Link: string;
}

export interface StrokeLink {
  SourceImage: string;
  QRPositionIndex: number;
  Category: string;
  Title: string;
  Description: string;
  Link: string;
  IsVideo: boolean;
}

// Map the original category and keywords to the 4 core categories
const mapCategory = (originalCategory: string, title: string): string => {
  const cat = (originalCategory || '').trim();
  const text = (title + ' ' + cat).toLowerCase();
  
  if (
    text.includes('ประเมิน') || 
    text.includes('สอบถาม') || 
    text.includes('ฟอร์ม') || 
    text.includes('ข้อคิดเห็น') || 
    text.includes('adl') ||
    text.includes('feedback') ||
    text.includes('questionnaire')
  ) {
    return 'แบบประเมินและข้อคิดเห็น';
  }
  
  if (
    text.includes('กายภาพ') || 
    text.includes('ฟื้นฟู') || 
    text.includes('physical') || 
    text.includes('exercise') || 
    text.includes('ออกกำลัง') || 
    text.includes('บริหาร') ||
    text.includes('bell') ||
    text.includes('ปากเบี้ยว') ||
    text.includes('ฝึกพูด') ||
    text.includes('ฝึกกลืน')
  ) {
    return 'การฟื้นฟูและกายภาพบำบัด';
  }
  
  if (
    text.includes('ดูแล') || 
    text.includes('บ้าน') || 
    text.includes('home') || 
    text.includes('เช็ดตัว') || 
    text.includes('พลิกตัว') || 
    text.includes('แผล') || 
    text.includes('กดทับ') || 
    text.includes('สายยาง') || 
    text.includes('หลอดลม') || 
    text.includes('ให้อาหาร') || 
    text.includes('เสมหะ')
  ) {
    return 'คู่มือการดูแลผู้ป่วยที่บ้าน';
  }
  
  return 'ความรู้โรคหลอดเลือดสมอง';
};

// Clean titles from suffixes
const cleanTitle = (title: string, link: string, category: string): string => {
  let cleaned = (title || '').trim();
  
  // If the title is missing, generic, or is a link itself, use a fallback
  if (!cleaned || cleaned === '' || cleaned.toLowerCase().includes('untitled') || cleaned.toLowerCase().startsWith('http')) {
    if (link.includes('youtube.com') || link.includes('youtu.be')) {
      return `คู่มือวิดีโอแนะนำการดูแล (${category})`;
    }
    return `คู่มือแนะนำแนวทางการดูแล (${category})`;
  }
  
  const suffixes = [
    /\s*-\s*YouTube$/i,
    /\s*YouTube$/i,
    /\s*-\s*Google Forms$/i,
    /\s*Google Forms$/i,
    /\s*-\s*Google Form$/i,
    /\s*Google Form$/i,
    /\s*-\s*โรงพยาบาลจุฬาภรณ์$/i,
    /\s*-\s*Chulabhorn Channel$/i,
    /\s*Chulabhorn Channel$/i,
    /\s*\|\s*โรงพยาบาลจุฬาภรณ์$/i,
    /\s*\|\s*Chulabhorn Channel$/i,
  ];
  
  suffixes.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return cleaned.trim();
};

// Smart Description generator based on title and core category
const generateDescription = (title: string, category: string): string => {
  const t = title.toLowerCase();
  
  if (category === 'คู่มือการดูแลผู้ป่วยที่บ้าน') {
    if (t.includes('เช็ดตัว')) return 'แนะนำขั้นตอนการเช็ดตัวผู้ป่วยอย่างถูกวิธีเพื่อรักษาสุขอนามัยและกระตุ้นการไหลเวียนเลือด';
    if (t.includes('พลิกตัว')) return 'แนวทางการจัดท่าทางและพลิกตัวผู้ป่วยติดเตียงเพื่อป้องกันแผลกดทับและข้อยึดติด';
    if (t.includes('แผลกดทับ')) return 'ขั้นตอนการทำความสะอาดและดูแลรักษาผิวหนังบริเวณที่มีการกดทับอย่างเหมาะสม';
    if (t.includes('สายยาง') || t.includes('อาหาร')) return 'วิธีเตรียมอาหารและขั้นตอนการให้อาหารทางสายยางอย่างปลอดภัยและถูกสุขลักษณะ';
    if (t.includes('หลอดลม') || t.includes('เสมหะ') || t.includes('เจาะคอ')) return 'วิธีดูแลท่อหลอดลมคอและการดูดเสมหะเพื่อป้องกันการติดเชื้อในระบบทางเดินหายใจ';
    return 'คู่มือแนะนำวิธีปฏิบัติจริงและขั้นตอนการดูแลผู้ป่วยติดเตียงหรือผู้ป่วยพักฟื้นที่บ้าน';
  }
  
  if (category === 'การฟื้นฟูและกายภาพบำบัด') {
    if (t.includes('bell') || t.includes('ปากเบี้ยว') || t.includes('หน้าเบี้ยว') || t.includes('ใบหน้า')) return 'ท่าบริหารกล้ามเนื้อใบหน้าเพื่อฟื้นฟูจากภาวะกล้ามเนื้อใบหน้าอัมพาตครึ่งซีก';
    if (t.includes('กลืน') || t.includes('ฝึกกลืน')) return 'แบบฝึกหัดและเทคนิคการบริหารกล้ามเนื้อช่วยกลืนเพื่อป้องกันการสำลักอาหาร';
    if (t.includes('พูด') || t.includes('ฝึกพูด') || t.includes('ออกเสียง')) return 'เทคนิคการบริหารช่องปาก ลิ้น และลมหายใจเพื่อฟื้นฟูการสื่อสารและการออกเสียง';
    return 'วิดีโอสาธิตและขั้นตอนการทำกายภาพบำบัดเพื่อกระตุ้นกำลังกล้ามเนื้อและการเคลื่อนไหว';
  }
  
  if (category === 'แบบประเมินและข้อคิดเห็น') {
    if (t.includes('adl') || t.includes('ความสามารถ')) return 'เครื่องมือประเมินความสามารถในการช่วยเหลือตนเองในการทำกิจวัตรประจำวัน';
    return 'แบบประเมินสุขภาพ แบบสอบถามความพึงพอใจ และช่องทางรับฟังความคิดเห็นเพื่อพัฒนาการดูแล';
  }
  
  // Default to ความรู้โรคหลอดเลือดสมอง
  if (t.includes('ตีบ')) return 'เจาะลึกข้อมูลโรคหลอดเลือดสมองตีบ กลไกการเกิด ปัจจัยเสี่ยง และการป้องกันอาการกลับซ้ำ';
  if (t.includes('แตก')) return 'ความรู้เกี่ยวกับโรคหลอดเลือดสมองแตก อาการวิกฤตที่ต้องรีบไปโรงพยาบาล และการรักษา';
  return 'ความรู้เบื้องต้นเกี่ยวกับประเภทของโรคหลอดเลือดสมอง ปัจจัยเสี่ยง อาการเตือนภัย และการป้องกัน';
};

// Check if link points to a video (YouTube)
const checkIsVideo = (link: string): boolean => {
  const l = (link || '').toLowerCase();
  return l.includes('youtube.com') || l.includes('youtu.be');
};

export const fetchAndParseExcel = async (): Promise<StrokeLink[]> => {
  try {
    const response = await fetch('/stroke_links.xlsx');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    
    // Parse workbook
    const workbook = xlsx.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON using type RawStrokeLink
    const rawData = xlsx.utils.sheet_to_json<RawStrokeLink>(worksheet);
    
    // Transform, clean, map, and filter data
    const cleanedData: StrokeLink[] = rawData.map((item) => {
      const originalTitle = item.Fetched_Title || '';
      const originalLink = item.Link || '';
      const originalCategory = item.Category || '';
      
      const category = mapCategory(originalCategory, originalTitle);
      const title = cleanTitle(originalTitle, originalLink, category);
      const description = generateDescription(title, category);
      const isVideo = checkIsVideo(originalLink);
      const qrIndex = typeof item.QR_Position_Index === 'number' 
        ? item.QR_Position_Index 
        : parseInt(item.QR_Position_Index || '0', 10);

      return {
        SourceImage: item.Source_Image || '',
        QRPositionIndex: isNaN(qrIndex) ? 0 : qrIndex,
        Category: category,
        Title: title,
        Description: description,
        Link: originalLink,
        IsVideo: isVideo
      };
    });

    return cleanedData;
  } catch (error) {
    console.error("Error fetching or parsing excel file:", error);
    return [];
  }
};
