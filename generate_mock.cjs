const xlsx = require('xlsx');
const fs = require('fs');

const data = [
  {
    "Category": "ความรู้โรค",
    "Title": "โรคหลอดเลือดสมองคืออะไร",
    "Description": "ความรู้เบื้องต้นเกี่ยวกับโรคหลอดเลือดสมอง อาการและสาเหตุ",
    "Link": "https://chulabhornchannel.cra.ac.th/health-articles/23771/"
  },
  {
    "Category": "การดูแลที่บ้าน",
    "Title": "การเช็ดตัวผู้ป่วย",
    "Description": "วิธีเช็ดตัวผู้ป่วยติดเตียงอย่างถูกวิธีและปลอดภัย",
    "Link": "https://youtube.com/playlist?list=PLVGq9IQHt11YfUPZPPnnnvq4KgaWRY3ZF"
  },
  {
    "Category": "การดูแลที่บ้าน",
    "Title": "การให้อาหารทางสายยาง",
    "Description": "ข้อควรระวังและขั้นตอนการให้อาหารทางสายยางที่บ้าน",
    "Link": "https://youtube.com/playlist?list=PLVGq9IQHt11Zvao7gpzcZkFKVhLFSNgaT"
  },
  {
    "Category": "กายภาพบำบัด",
    "Title": "กายภาพบำบัดเบื้องต้น",
    "Description": "ท่าบริหารร่างกายสำหรับผู้ป่วยหลอดเลือดสมอง",
    "Link": "https://youtube.com/playlist?list=PLVGq9IQHt11bLanp3R3L8xys9iCyCzH2K"
  },
  {
    "Category": "แบบประเมิน",
    "Title": "แบบประเมิน ADL",
    "Description": "แบบประเมินความสามารถในการดำเนินชีวิตประจำวัน",
    "Link": "https://drive.google.com/file/d/1JdzU-8qLQNBqfkcLclKQp5OOHJpjqp8F/view"
  }
];

const worksheet = xlsx.utils.json_to_sheet(data);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, "Links");

const dir = './public';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

xlsx.writeFile(workbook, './public/stroke_links.xlsx');
console.log('Successfully generated public/stroke_links.xlsx');
