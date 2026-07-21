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

// Map the original category and keywords
const mapCategory = (originalCategory: string, title: string): string => {
  const cat = (originalCategory || '').trim();
  const text = (title + ' ' + cat).toLowerCase();
  
  if (
    text.includes('ประเมิน') || 
    text.includes('สอบถาม') || 
    text.includes('ฟอร์ม') || 
    text.includes('ข้อคิดเห็น')
  ) {
    return 'แบบประเมินและข้อคิดเห็น';
  }
  
  if (
    text.includes('กายภาพ') || 
    text.includes('ฟื้นฟู') || 
    text.includes('bell')
  ) {
    return 'การฟื้นฟูและกายภาพบำบัด';
  }
  
  return 'คู่มือการดูแลผู้ป่วยที่บ้าน';
};

// Clean titles from suffixes
const cleanTitle = (title: string, link: string, category: string): string => {
  let cleaned = (title || '').trim();
  
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

// Smart Description generator for the 8 home care items
const generateDescription = (title: string): string => {
  const t = title.toLowerCase();
  
  if (t.includes('อาหาร') || t.includes('สายยาง')) {
    return 'ขั้นตอนการให้อาหารและน้ำทางสายยางอย่างปลอดภัยเพื่อป้องกันการสำลัก';
  }
  if (t.includes('สัญญาณชีพ') || t.includes('วัด')) {
    return 'แนะนำขั้นตอนการวัดอุณหภูมิ ความดันโลหิต ชีพจร และการหายใจอย่างถูกวิธี';
  }
  if (t.includes('เช็ดตัว') || t.includes('พลิกตัว')) {
    return 'แนะนำขั้นตอนการเช็ดตัวผู้ป่วยและจัดท่าทางพลิกตัวเพื่อป้องกันแผลกดทับ';
  }
  if (t.includes('เตียง') || t.includes('ที่นอนลม')) {
    return 'วิธีการปรับระดับเตียงและการใช้งานที่นอนลมอย่างถูกต้องเพื่อลดแรงกดทับ';
  }
  if (t.includes('ออกซิเจน')) {
    return 'ข้อควรระวังและวิธีให้สายออกซิเจนแก่ผู้ป่วยอย่างปลอดภัยและถูกสุขลักษณะ';
  }
  if (t.includes('ดูดเสมหะ') || t.includes('เสมหะ')) {
    return 'วิธีดูแลและขั้นตอนการดูดเสมหะอย่างถูกวิธีเพื่อความปลอดภัยของผู้ป่วย';
  }
  if (t.includes('หลอดลม') || t.includes('คอ')) {
    return 'วิธีดูแลทำความสะอาดท่อหลอดลมคออย่างปลอดเชื้อและป้องกันการติดเชื้อ';
  }
  if (t.includes('ปัสสาวะ') || t.includes('สายสวน')) {
    return 'แนวทางการดูแลทำความสะอาดสายสวนปัสสาวะและถุงเก็บปัสสาวะอย่างถูกสุขอนามัย';
  }
  
  return 'คู่มือแนะนำวิธีปฏิบัติจริงและขั้นตอนการดูแลผู้ป่วยระยะพักฟื้นที่บ้านอย่างใกล้ชิด';
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
      const description = generateDescription(title);
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
