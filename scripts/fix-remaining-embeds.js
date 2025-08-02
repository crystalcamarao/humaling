const fs = require('fs');
const path = require('path');

function fixRemainingEmbedsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Convert remaining plain Instagram URLs to embeds
  content = content.replace(
    /https:\/\/www\.instagram\.com\/p\/([^\/\s\?]+)(?:\?[^\)]*)?/g,
    (match, postId) => {
      // Only convert if it's not already in an iframe
      if (!content.includes(`instagram.com/p/${postId}/embed`)) {
        return `\n\n<div class="embed-container" data-type="instagram"><iframe src="https://www.instagram.com/p/${postId}/embed" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>\n\n`;
      }
      return match;
    }
  );
  
  // Convert remaining plain YouTube URLs to embeds
  content = content.replace(
    /https:\/\/www\.youtube\.com\/watch\?v=([^&\s\)]+)/g,
    (match, videoId) => {
      // Only convert if it's not already in an iframe
      if (!content.includes(`youtube.com/embed/${videoId}`)) {
        return `\n\n<div class="embed-container" data-type="youtube"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
      }
      return match;
    }
  );
  
  // Convert remaining plain Vimeo URLs to embeds
  content = content.replace(
    /https:\/\/vimeo\.com\/([0-9]+)/g,
    (match, videoId) => {
      // Only convert if it's not already in an iframe
      if (!content.includes(`vimeo.com/video/${videoId}`)) {
        return `\n\n<div class="embed-container" data-type="vimeo"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
      }
      return match;
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
  console.log(`Fixed remaining embeds in: ${path.basename(filePath)}`);
}

function fixAllBlogPosts() {
  const blogDir = path.join(__dirname, '..', 'content', 'blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  
  console.log('🔄 Fixing remaining embed issues in blog posts...');
  
  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    fixRemainingEmbedsInFile(filePath);
  });
  
  console.log('✅ All remaining embed issues fixed!');
}

fixAllBlogPosts(); 