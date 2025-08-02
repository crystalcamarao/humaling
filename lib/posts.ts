import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  excerpt?: string;
  content: string;
  body?: string;
  thumbnail?: string;
  draft?: boolean;
}

// Function to generate excerpt from content
function generateExcerpt(content: string): string {
  // Remove HTML tags and clean the content
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/\r\n/g, '\n') // Normalize line breaks
    .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
    .trim();

  // Get first 100 characters
  const excerpt = cleanContent.substring(0, 100);
  
  // Add ellipsis if content is longer than 100 characters
  return cleanContent.length > 100 ? excerpt + '...' : excerpt;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

export function getAllPosts(): Post[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }
    
    // Get file names under /content/blog
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        try {
          // Remove ".md" from file name to get id
          const id = fileName.replace(/\.md$/, '');

          // Read markdown file as string
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');

          // Use gray-matter to parse the post metadata section
          const matterResult = matter(fileContents);

          // Combine the data with the id
          const postContent = matterResult.data.body || matterResult.content;
          return {
            id,
            slug: id,
            ...matterResult.data,
            content: postContent, // Use body field if available, fallback to content
            excerpt: generateExcerpt(postContent) // Generate excerpt from content
          } as Post;
        } catch (error) {
          console.warn(`Error reading post ${fileName}:`, error);
          return null;
        }
      })
      .filter((post): post is Post => post !== null) // Remove null entries
      .sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        } else {
          return -1;
        }
      });

    return allPostsData;
  } catch (error) {
    console.warn('Error reading posts directory:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    console.log('Matter result data:', matterResult.data);
    console.log('Matter result content:', matterResult.content);
    console.log('Body field:', matterResult.data.body);

    const postContent = matterResult.data.body || matterResult.content;
    const result = {
      slug,
      ...matterResult.data,
      content: postContent, // Use body field if available, fallback to content
      excerpt: generateExcerpt(postContent) // Generate excerpt from content
    } as Post;
    
    console.log('Final result:', result);
    
    return result;
  } catch (error) {
    console.warn(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getPostsByCategory(category: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.categories && post.categories.includes(category)
  );
}

export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.tags && post.tags.includes(tag)
  );
}

export function getPostsByAuthor(author: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post => 
    post.author === author
  );
} 