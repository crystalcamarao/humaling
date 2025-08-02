const fs = require('fs');
const path = require('path');

function updateEmbedsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update Instagram iframes
  content = content.replace(
    /<iframe src="https:\/\/www\.instagram\.com\/p\/([^\/]+)\/embed"[^>]*><\/iframe>/g,
    '<div class="embed-container" data-type="instagram"><iframe src="https://www.instagram.com/p/$1/embed" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>'
  );
  
  // Update YouTube iframes
  content = content.replace(
    /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/([^"]+)"[^>]*><\/iframe>/g,
    '<div class="embed-container" data-type="youtube"><iframe src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
  );
  
  // Update Vimeo iframes
  content = content.replace(
    /<iframe[^>]*src="https:\/\/player\.vimeo\.com\/video\/([^"]+)"[^>]*><\/iframe>/g,
    '<div class="embed-container" data-type="vimeo"><iframe src="https://player.vimeo.com/video/$1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated embeds in: ${path.basename(filePath)}`);
}

function updateAllBlogPosts() {
  const blogDir = path.join(__dirname, '..', 'content', 'blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  console.log('🔄 Updating embeds in blog posts...');
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    updateEmbedsInFile(filePath);
  });
  
  console.log('✅ All blog posts updated!');
}

updateAllBlogPosts(); 