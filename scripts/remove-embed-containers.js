const fs = require('fs');
const path = require('path');

function removeEmbedContainersInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove embed-container divs and keep only the iframes
  content = content.replace(
    /<div class="embed-container" data-type="[^"]*"><iframe([^>]*)><\/iframe><\/div>/g,
    '<iframe$1></iframe>'
  );

  fs.writeFileSync(filePath, content);
  console.log(`Removed embed containers in: ${path.basename(filePath)}`);
}

function removeAllEmbedContainers() {
  const blogDir = path.join(__dirname, '..', 'content', 'blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

  console.log('🔄 Removing embed containers from blog posts...');

  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    removeEmbedContainersInFile(filePath);
  });

  console.log('✅ Embed containers removed!');
}

removeAllEmbedContainers(); 