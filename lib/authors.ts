import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Author {
  name: string;
  bio?: string;
  avatar?: string;
}

const authorsDirectory = path.join(process.cwd(), 'content/authors');

export function getAuthorByName(name: string): Author | null {
  try {
    if (!fs.existsSync(authorsDirectory)) {
      return null;
    }
    
    const fileNames = fs.readdirSync(authorsDirectory);
    
    for (const fileName of fileNames) {
      if (fileName.endsWith('.md')) {
        const fullPath = path.join(authorsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        
        if (matterResult.data.name === name) {
          return matterResult.data as Author;
        }
      }
    }
  } catch (error) {
    console.warn('Error reading authors directory:', error);
  }
  
  return null;
}

export function getAllAuthors(): Author[] {
  try {
    if (!fs.existsSync(authorsDirectory)) {
      return [];
    }
    
    const fileNames = fs.readdirSync(authorsDirectory);
    
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const fullPath = path.join(authorsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        
        return matterResult.data as Author;
      });
  } catch (error) {
    console.warn('Error reading authors directory:', error);
    return [];
  }
} 