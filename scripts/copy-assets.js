const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist', 'ngx-retoast');

const filesToCopy = ['README.md', 'LICENSE'];

filesToCopy.forEach((file) => {
  const source = path.join(__dirname, '..', file);
  const dest = path.join(distPath, file);
  
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`Successfully copied ${file} to dist/ngx-retoast/`);
    } else {
      console.warn(`Warning: ${file} not found at root.`);
    }
  } catch (error) {
    console.error(`Error copying ${file}:`, error);
    process.exit(1);
  }
});
