const fs = require('fs');
const path = require('path');

function fixRemainingEmbedsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Convert plain Instagram URLs to embeds
  content = content.replace(
    /https:\/\/instagram\.com\/p\/([^\/\s\?]+)(?:\?[^\)]*)?/g,
    '<iframe src="https://www.instagram.com/p/$1/embed" frameborder="0" scrolling="no" allowtransparency="true"></iframe>'
  );

  // Convert Vimeo shortcodes to embeds
  content = content.replace(
    /\[vimeo\s+(\d+)(?:\s+w=(\d+)&amp;h=(\d+))?\]/g,
    (match, videoId, width, height) => {
      return `<iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  );

  // Convert any remaining plain YouTube URLs to embeds
  content = content.replace(
    /https:\/\/www\.youtube\.com\/watch\?v=([^&\s\)]+)/g,
    '<iframe src="https://www.youtube.com/embed/$1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  );

  // Convert any remaining plain Vimeo URLs to embeds
  content = content.replace(
    /https:\/\/vimeo\.com\/([0-9]+)/g,
    '<iframe src="https://player.vimeo.com/video/$1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
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

  console.log('🔄 Final embed fix for all blog posts...');

  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    fixRemainingEmbedsInFile(filePath);
  });

  console.log('✅ Final embed fix completed!');
}

fixAllBlogPosts(); 