const fs = require('fs');
const path = require('path');

function fixFinalEmbedsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Convert Instagram URLs on their own lines to embeds
  content = content.replace(
    /^https:\/\/www\.instagram\.com\/p\/([^\/\s\?]+)(?:\?[^\)]*)?$/gm,
    (match, postId) => {
      return `\n\n<div class="embed-container" data-type="instagram"><iframe src="https://www.instagram.com/p/${postId}/embed" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>\n\n`;
    }
  );
  
  // Convert YouTube URLs on their own lines to embeds
  content = content.replace(
    /^https:\/\/www\.youtube\.com\/watch\?v=([^&\s\)]+)$/gm,
    (match, videoId) => {
      return `\n\n<div class="embed-container" data-type="youtube"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
    }
  );
  
  // Convert Vimeo URLs on their own lines to embeds
  content = content.replace(
    /^https:\/\/vimeo\.com\/([0-9]+)$/gm,
    (match, videoId) => {
      return `\n\n<div class="embed-container" data-type="vimeo"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
    }
  );
  
  // Clean up any remaining URL fragments
  content = content.replace(/\?taken-at=\d+/g, '');
  content = content.replace(/\?taken-by=[^&\s]+/g, '');
  content = content.replace(/\?tagged=[^&\s]+/g, '');
  content = content.replace(/\?hl=en&amp;taken-at=\d+/g, '');
  content = content.replace(/\?hl=en&amp;taken-by=[^&\s]+/g, '');
  content = content.replace(/\?hl=en&amp;tagged=[^&\s]+/g, '');
  
  // Clean up extra whitespace
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed final embeds in: ${path.basename(filePath)}`);
}

function fixAllBlogPosts() {
  const blogDir = path.join(__dirname, '..', 'content', 'blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  console.log('🔄 Final embed fix for blog posts...');
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    fixFinalEmbedsInFile(filePath);
  });
  
  console.log('✅ Final embed fix completed!');
}

fixAllBlogPosts(); 