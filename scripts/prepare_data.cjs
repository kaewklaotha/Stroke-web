const fs = require('fs');
const path = require('path');

function getLatestExcel() {
  const rootDir = path.resolve(__dirname, '..');
  const files = fs.readdirSync(rootDir);
  
  // Filter for xlsx files, ignoring temp Excel files
  const xlsxFiles = files
    .filter(file => file.endsWith('.xlsx') && !file.startsWith('~$'))
    .map(file => {
      const filePath = path.join(rootDir, file);
      const stat = fs.statSync(filePath);
      return { file, filePath, mtime: stat.mtime };
    });

  if (xlsxFiles.length === 0) {
    console.error('No Excel (.xlsx) files found in the root directory!');
    process.exit(1);
  }

  // Priority to stroke_links_enriched.xlsx
  const enrichedFile = xlsxFiles.find(f => f.file === 'stroke_links_enriched.xlsx');
  if (enrichedFile) {
    return enrichedFile.filePath;
  }

  // Otherwise, sort by modified time (most recent first)
  xlsxFiles.sort((a, b) => b.mtime - a.mtime);
  return xlsxFiles[0].filePath;
}

try {
  const latestExcel = getLatestExcel();
  const destPath = path.resolve(__dirname, '../public/stroke_links.xlsx');
  
  // Ensure public folder exists
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.copyFileSync(latestExcel, destPath);
  console.log(`Successfully copied latest Excel file [${path.basename(latestExcel)}] to public/stroke_links.xlsx`);
} catch (error) {
  console.error('Error copying excel file:', error);
  process.exit(1);
}
