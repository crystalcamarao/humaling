const fs = require('fs');
const path = require('path');

function generateExcerpt(content) {
  // Remove HTML tags and clean up the content
  let cleanContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/\r\n/g, '\n') // Normalize line breaks
    .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // If content is too short, return a default message
  if (cleanContent.length < 50) {
    return "Read more about this fascinating topic...";
  }

  // Split into sentences and find the first meaningful content
  const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let excerpt = '';
  let wordCount = 0;
  const maxWords = 25; // Target around 25 words for excerpt

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    
    // Skip very short sentences or sentences that are just punctuation
    if (trimmedSentence.length < 10 || /^[^\w]*$/.test(trimmedSentence)) continue;
    
    const words = trimmedSentence.split(/\s+/).length;
    
    if (wordCount + words <= maxWords) {
      excerpt += (excerpt ? ' ' : '') + trimmedSentence;
      wordCount += words;
    } else {
      break;
    }
  }

  // If we couldn't generate a good excerpt, try a different approach
  if (!excerpt || excerpt.length < 20) {
    // Take the first 150 characters and find the last complete sentence
    const firstChunk = cleanContent.substring(0, 150);
    const lastSentenceEnd = firstChunk.lastIndexOf('.');
    
    if (lastSentenceEnd > 50) {
      excerpt = firstChunk.substring(0, lastSentenceEnd + 1).trim();
    } else {
      // Fallback: just take the first 100 characters
      excerpt = cleanContent.substring(0, 100).trim();
    }
  }

  // Add ellipsis if we truncated
  if (excerpt.length < cleanContent.length && !excerpt.endsWith('...')) {
    excerpt += '...';
  }

  return excerpt;
}

function updateBlogPosts() {
  const blogDir = path.join(__dirname, '..', 'content', 'blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

  console.log('🔄 Generating excerpts for blog posts...');

  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      console.log(`⚠️  Skipped ${file}: No frontmatter found`);
      return;
    }

    const frontmatter = content.substring(0, frontmatterEnd + 3);
    const postContent = content.substring(frontmatterEnd + 3).trim();

    // Check if excerpt already exists and is not empty
    if (frontmatter.includes('excerpt: ""') || frontmatter.includes('excerpt: ""')) {
      // Generate excerpt from content
      const excerpt = generateExcerpt(postContent);
      
      // Update frontmatter with new excerpt
      const updatedFrontmatter = frontmatter.replace(
        /excerpt: ""/g,
        `excerpt: "${excerpt.replace(/"/g, '\\"')}"`
      );

      // Write back to file
      const updatedContent = updatedFrontmatter + '\n\n' + postContent;
      fs.writeFileSync(filePath, updatedContent);
      
      console.log(`✅ Generated excerpt for: ${file}`);
      console.log(`   Excerpt: "${excerpt}"`);
    } else {
      console.log(`⏭️  Skipped ${file}: Excerpt already exists`);
    }
  });

  console.log('✅ Excerpt generation completed!');
}

updateBlogPosts(); 