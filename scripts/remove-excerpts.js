const fs = require('fs');
const path = require('path');

function removeExcerptsFromBlogPosts() {
  const blogDir = path.join(__dirname, '..', 'content', 'blog');
  const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

  console.log('🔄 Removing excerpt fields from blog posts...');

  files.forEach(file => {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd === -1) {
      console.log(`⚠️  Skipped ${file}: No frontmatter found`);
      return;
    }

    const frontmatter = content.substring(0, frontmatterEnd + 3);
    const postContent = content.substring(frontmatterEnd + 3).trim();

    // Remove excerpt line from frontmatter
    const updatedFrontmatter = frontmatter
      .split('\n')
      .filter(line => !line.trim().startsWith('excerpt:'))
      .join('\n');

    const updatedContent = updatedFrontmatter + '\n\n' + postContent;
    fs.writeFileSync(filePath, updatedContent);
    
    console.log(`✅ Removed excerpt from: ${file}`);
  });

  console.log('✅ Excerpt removal completed!');
}

removeExcerptsFromBlogPosts(); 