const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { parseString } = require('xml2js');
const slugify = require('slugify');

class WordPressImporter {
  constructor(xmlPath, outputDir) {
    this.xmlPath = xmlPath;
    this.outputDir = outputDir;
    this.postsDir = path.join(outputDir, 'blog');
    this.imagesDir = path.join(outputDir, 'images');
    this.authors = new Map();
    this.categories = new Map();
    this.tags = new Map();
    this.attachments = new Map(); // Store attachment ID to URL mapping
    this.thumbnailIds = new Map(); // Store post ID to thumbnail ID mapping
    this.downloadedImages = new Set();
  }

  async init() {
    // Create directories
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true });
    }
    if (!fs.existsSync(this.postsDir)) {
      fs.mkdirSync(this.postsDir, { recursive: true });
    }
  }

  async parseXML() {
    console.log('📖 Parsing WordPress XML export...');
    
    const xmlContent = fs.readFileSync(this.xmlPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      parseString(xmlContent, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  extractAuthors(data) {
    console.log('👥 Extracting authors...');
    
    if (data.rss.channel['wp:author']) {
      const authors = Array.isArray(data.rss.channel['wp:author']) 
        ? data.rss.channel['wp:author'] 
        : [data.rss.channel['wp:author']];
      
      authors.forEach(author => {
        this.authors.set(author['wp:author_id'], {
          id: author['wp:author_id'],
          login: author['wp:author_login'],
          email: author['wp:author_email'],
          displayName: author['wp:author_display_name'],
          firstName: author['wp:author_first_name'],
          lastName: author['wp:author_last_name']
        });
      });
    }
    
    console.log(`Found ${this.authors.size} authors`);
  }

  extractCategories(data) {
    console.log('📂 Extracting categories...');
    
    if (data.rss.channel['wp:category']) {
      const categories = Array.isArray(data.rss.channel['wp:category']) 
        ? data.rss.channel['wp:category'] 
        : [data.rss.channel['wp:category']];
      
      categories.forEach(category => {
        this.categories.set(category['wp:term_id'], {
          id: category['wp:term_id'],
          name: category['wp:cat_name'],
          slug: category['wp:category_nicename'],
          description: category['wp:category_description'] || ''
        });
      });
    }
    
    console.log(`Found ${this.categories.size} categories`);
  }

  extractTags(data) {
    console.log('📋 Extracting tags...');
    
    if (data.rss.channel['wp:tag']) {
      const tags = Array.isArray(data.rss.channel['wp:tag']) 
        ? data.rss.channel['wp:tag'] 
        : [data.rss.channel['wp:tag']];
      
      tags.forEach(tag => {
        if (tag['wp:term_id'] && tag['wp:tag_name']) {
          this.tags.set(tag['wp:term_id'], {
            id: tag['wp:term_id'],
            name: tag['wp:tag_name']
          });
        }
      });
    }
    
    console.log(`✅ Extracted ${this.tags.size} tags`);
  }

  extractAttachments(data) {
    console.log('📎 Extracting attachments...');
    
    const items = data.rss.channel.item;
    const allItems = Array.isArray(items) ? items : [items];
    
    allItems.forEach(item => {
      const postType = item['wp:post_type'];
      if (postType === 'attachment') {
        const attachmentId = item['wp:post_id'];
        const guid = item.guid;
        
        if (attachmentId && guid) {
          // Extract URL from guid
          let url = guid;
          if (typeof guid === 'object' && guid._) {
            url = guid._;
          }
          
          this.attachments.set(attachmentId, url);
        }
      }
    });
    
    console.log(`✅ Extracted ${this.attachments.size} attachments`);
  }

  extractThumbnailIds(data) {
    console.log('🖼️ Extracting thumbnail IDs...');
    
    const items = data.rss.channel.item;
    const allItems = Array.isArray(items) ? items : [items];
    
    allItems.forEach(item => {
      const postType = item['wp:post_type'];
      if (postType === 'post') {
        const postId = item['wp:post_id'];
        
        if (item['wp:postmeta']) {
          const postmeta = Array.isArray(item['wp:postmeta']) 
            ? item['wp:postmeta'] 
            : [item['wp:postmeta']];
          
          postmeta.forEach(meta => {
            if (meta['wp:meta_key'] === '_thumbnail_id' && meta['wp:meta_value']) {
              const thumbnailId = meta['wp:meta_value'];
              this.thumbnailIds.set(postId, thumbnailId);
            }
          });
        }
      }
    });
    
    console.log(`✅ Extracted ${this.thumbnailIds.size} thumbnail IDs`);
  }

  async downloadImage(imageUrl, filename) {
    if (this.downloadedImages.has(imageUrl)) {
      return path.join('images', filename);
    }

    const filePath = path.join(this.imagesDir, filename);
    
    if (fs.existsSync(filePath)) {
      this.downloadedImages.add(imageUrl);
      return path.join('images', filename);
    }

    return new Promise((resolve, reject) => {
      const protocol = imageUrl.startsWith('https:') ? https : http;
      
      protocol.get(imageUrl, (response) => {
        if (response.statusCode !== 200) {
          console.warn(`⚠️ Failed to download ${imageUrl}: ${response.statusCode}`);
          resolve(null);
          return;
        }

        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          this.downloadedImages.add(imageUrl);
          console.log(`✅ Downloaded: ${filename}`);
          resolve(path.join('images', filename));
        });

        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Delete the file if it exists
          console.warn(`⚠️ Error downloading ${imageUrl}: ${err.message}`);
          resolve(null);
        });
      }).on('error', (err) => {
        console.warn(`⚠️ Error downloading ${imageUrl}: ${err.message}`);
        resolve(null);
      });
    });
  }

  extractImagesFromContent(content) {
    const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
    const images = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      images.push(match[1]);
    }

    return images;
  }

  async processImages(content) {
    const images = this.extractImagesFromContent(content);
    let processedContent = content;

    for (const imageUrl of images) {
      try {
        const filename = path.basename(imageUrl);
        const localPath = await this.downloadImage(imageUrl, filename);
        
        if (localPath) {
          processedContent = processedContent.replace(
            new RegExp(imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            `/${localPath}`
          );
        }
      } catch (error) {
        console.warn(`⚠️ Error processing image ${imageUrl}: ${error.message}`);
      }
    }

    return processedContent;
  }

  convertHTMLToMarkdown(html) {
    // Handle Instagram embeds first (WordPress shortcode format)
    html = html.replace(/\[instagram url=([^\]]+)\]/gi, 
      (match, url) => {
        // Clean the URL by removing any extra parameters
        const cleanUrl = url.split('?')[0];
        const postId = cleanUrl.split('/p/')[1];
        return `\n\n<div class="embed-container" data-type="instagram"><iframe src="https://www.instagram.com/p/${postId}/embed" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>\n\n`;
      }
    );

    // Handle plain Instagram URLs (before any HTML processing)
    html = html.replace(/https:\/\/www\.instagram\.com\/p\/[^\/\s]+/gi, 
      (match) => {
        // Clean the URL by removing any extra parameters
        const cleanUrl = match.split('?')[0];
        const postId = cleanUrl.split('/p/')[1];
        return `\n\n<div class="embed-container" data-type="instagram"><iframe src="https://www.instagram.com/p/${postId}/embed" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>\n\n`;
      }
    );

    // Handle Twitter embeds (WordPress shortcode format)
    html = html.replace(/\[twitter url=([^\]]+)\]/gi, 
      (match, url) => {
        // Clean the URL by removing any extra parameters
        const cleanUrl = url.split('?')[0];
        const tweetId = cleanUrl.split('/status/')[1];
        return `\n\n<blockquote class="twitter-tweet" data-theme="light"><a href="${cleanUrl}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n\n`;
      }
    );

    // Handle plain Twitter URLs
    html = html.replace(/https:\/\/twitter\.com\/[^\/]+\/status\/[^\/\s]+/gi, 
      (match) => {
        // Clean the URL by removing any extra parameters
        const cleanUrl = match.split('?')[0];
        return `\n\n<blockquote class="twitter-tweet" data-theme="light"><a href="${cleanUrl}"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n\n`;
      }
    );

    // Handle Vimeo embeds (WordPress shortcode format)
    html = html.replace(/\[vimeo url=([^\]]+)\]/gi, 
      (match, url) => {
        // Clean the URL by removing any extra parameters
        const cleanUrl = url.split('?')[0];
        const videoId = cleanUrl.split('/')[cleanUrl.split('/').length - 1];
        return `\n\n<div class="embed-container" data-type="vimeo"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
      }
    );

    // Handle plain Vimeo URLs
    html = html.replace(/https:\/\/vimeo\.com\/[0-9]+/gi, 
      (match) => {
        // Clean the URL by removing any extra parameters
        const cleanUrl = match.split('?')[0];
        const videoId = cleanUrl.split('/')[cleanUrl.split('/').length - 1];
        return `\n\n<div class="embed-container" data-type="vimeo"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
      }
    );

    // Handle WordPress caption shortcodes
    html = html.replace(/\[caption[^\]]*\]<img[^>]+src="([^"]+)"[^>]*\/>([^\[]*)\[\/caption\]/gi, 
      (match, src, caption) => {
        const cleanCaption = caption.trim();
        // Convert WordPress URL to local path
        const localPath = this.convertWordPressUrlToLocal(src);
        return `![Image](${localPath})\n\n*${cleanCaption}*\n\n`;
      }
    );

    // Handle regular images with alt text
    html = html.replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi, 
      (match, src, alt) => {
        // Convert WordPress URL to local path
        const localPath = this.convertWordPressUrlToLocal(src);
        return `![${alt || 'Image'}](${localPath})\n\n`;
      }
    );

    // Handle YouTube embeds
    html = html.replace(/\[youtube ([^\]]+)\]/gi, 
      (match, params) => {
        const urlMatch = params.match(/https:\/\/www\.youtube\.com\/watch\?v=([^&\s]+)/);
        if (urlMatch) {
          const videoId = urlMatch[1];
          return `\n\n<div class="embed-container" data-type="youtube"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
        }
        return match;
      }
    );

    // Handle plain YouTube URLs
    html = html.replace(/https:\/\/www\.youtube\.com\/watch\?v=[^&\s]+/gi, 
      (match) => {
        const videoId = match.match(/v=([^&\s]+)/)[1];
        return `\n\n<div class="embed-container" data-type="youtube"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
      }
    );

    // Handle WordPress video shortcodes
    html = html.replace(/\[video[^\]]*\]/gi, 
      (match) => {
        // Extract video URL from shortcode
        const urlMatch = match.match(/src="([^"]+)"/);
        if (urlMatch) {
          const videoUrl = urlMatch[1];
          if (videoUrl.includes('youtube.com')) {
            const videoId = videoUrl.match(/v=([^&\s]+)/)?.[1];
            if (videoId) {
              return `\n\n<div class="embed-container" data-type="youtube"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
            }
          } else if (videoUrl.includes('vimeo.com')) {
            const videoId = videoUrl.split('/').pop();
            return `\n\n<div class="embed-container" data-type="vimeo"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
          }
        }
        return match;
      }
    );

    // Handle WordPress embed shortcodes
    html = html.replace(/\[embed[^\]]*\]/gi, 
      (match) => {
        // Extract URL from embed shortcode
        const urlMatch = match.match(/src="([^"]+)"/);
        if (urlMatch) {
          const embedUrl = urlMatch[1];
          if (embedUrl.includes('youtube.com')) {
            const videoId = embedUrl.match(/v=([^&\s]+)/)?.[1];
            if (videoId) {
              return `\n\n<div class="embed-container" data-type="youtube"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
            }
          } else if (embedUrl.includes('vimeo.com')) {
            const videoId = embedUrl.split('/').pop();
            return `\n\n<div class="embed-container" data-type="vimeo"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>\n\n`;
          } else if (embedUrl.includes('instagram.com')) {
            const postId = embedUrl.split('/p/')[1];
            if (postId) {
              return `\n\n<div class="embed-container" data-type="instagram"><iframe src="https://www.instagram.com/p/${postId}/embed" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>\n\n`;
            }
          }
        }
        return match;
      }
    );

    // More conservative HTML to Markdown conversion
    let markdown = html
      // Headers
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
      
      // Bold and italic
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      
      // Links
      .replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      
      // Lists
      .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
      })
      .replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
        let counter = 1;
        return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`) + '\n';
      })
      
      // Paragraphs - be more careful with this
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      
      // Line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      
      // Blockquotes
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n')
      
      // Remove only specific HTML tags, not all of them
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '')
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      
      // Clean up URL fragments that were left behind
      .replace(/\?hl=en&amp;taken-at=\d+/g, '')
      .replace(/\?hl=en&amp;tagged=[^&\s]+/g, '')
      .replace(/\?tagged=[^&\s]+/g, '')
      .replace(/\?taken-by=[^&\s]+/g, '')
      .replace(/\?hl=en&amp;taken-by=[^&\s]+/g, '')
      
      // Clean up standalone forward slashes
      .replace(/\n\/\n/g, '\n\n')
      .replace(/^\//gm, '')
      .replace(/\n\/$/gm, '')
      
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return markdown;
  }

  convertWordPressUrlToLocal(wordpressUrl) {
    // Extract filename from WordPress URL
    const filename = path.basename(wordpressUrl);
    // Return local path
    return `/images/uploads/${filename}`;
  }

  async processPost(item) {
    const postType = item['wp:post_type'];
    
    if (postType !== 'post') {
      return null; // Skip non-post items
    }

    const title = item.title;
    const content = item['content:encoded'] || '';
    const excerpt = item['excerpt:encoded'] || '';
    const postId = item['wp:post_id'];
    
    // Get thumbnail URL
    let thumbnail = '';
    if (postId && this.thumbnailIds.has(postId)) {
      const thumbnailId = this.thumbnailIds.get(postId);
      if (this.attachments.has(thumbnailId)) {
        const originalUrl = this.attachments.get(thumbnailId);
        // Convert to local path
        const filename = path.basename(originalUrl);
        thumbnail = `/images/uploads/${filename}`;
        
        // Download the featured image if it hasn't been downloaded yet
        if (!this.downloadedImages.has(originalUrl)) {
          try {
            await this.downloadImage(originalUrl, filename);
            console.log(`📥 Downloaded featured image: ${filename}`);
          } catch (error) {
            console.warn(`⚠️ Failed to download featured image ${filename}:`, error.message);
          }
        }
      }
    }
    
    // Handle date parsing more robustly
    let pubDate;
    try {
      pubDate = new Date(item.pubDate);
      if (isNaN(pubDate.getTime())) {
        // Fallback to current date if parsing fails
        pubDate = new Date();
        console.warn(`⚠️ Invalid date for post "${title}", using current date`);
      }
    } catch (error) {
      pubDate = new Date();
      console.warn(`⚠️ Date parsing error for post "${title}", using current date`);
    }
    
    const authorId = item['dc:creator'];
    const author = this.authors.get(authorId);
    
    // Extract categories and tags
    const categories = [];
    const tags = [];
    
    if (item['category']) {
      const categoryItems = Array.isArray(item['category']) ? item['category'] : [item['category']];
      
      categoryItems.forEach(cat => {
        try {
          if (cat.$ && cat.$.domain === 'category') {
            categories.push(cat._ || cat);
          } else if (cat.$ && cat.$.domain === 'post_tag') {
            tags.push(cat._ || cat);
          }
        } catch (error) {
          console.warn(`⚠️ Error processing category/tag for post "${title}":`, error.message);
        }
      });
    }

    // Process content and download images
    const processedContent = await this.processImages(content);
    const markdownContent = this.convertHTMLToMarkdown(processedContent);

    // Create slug from title
    const slug = slugify(title, { 
      lower: true, 
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });

    // Create frontmatter
    const frontmatter = {
      title: title,
      date: pubDate.toISOString(),
      author: author ? author.displayName : 'Unknown Author',
      author_email: author ? author.email : '',
      categories: categories,
      tags: tags,
      excerpt: excerpt,
      thumbnail: thumbnail,
      draft: false
    };

    // Create the markdown file
    const markdownFile = `---
title: "${title}"
date: ${pubDate.toISOString()}
author: "${author ? author.displayName : 'Unknown Author'}"
author_email: "${author ? author.email : ''}"
categories: [${categories.map(cat => `"${cat}"`).join(', ')}]
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
excerpt: "${excerpt.replace(/"/g, '\\"')}"
thumbnail: "${thumbnail}"
draft: false
---

${markdownContent}
`;

    const filename = `${pubDate.getFullYear()}-${String(pubDate.getMonth() + 1).padStart(2, '0')}-${String(pubDate.getDate()).padStart(2, '0')}-${slug}.md`;
    const filePath = path.join(this.postsDir, filename);

    fs.writeFileSync(filePath, markdownFile);
    console.log(`✅ Created: ${filename}${thumbnail ? ` (with thumbnail: ${thumbnail})` : ''}`);

    return {
      filename,
      title,
      author: author ? author.displayName : 'Unknown Author',
      categories,
      tags,
      thumbnail,
      date: pubDate
    };
  }

  async import() {
    try {
      await this.init();
      
      console.log('🚀 Starting WordPress import...');
      
      const data = await this.parseXML();
      
      this.extractAuthors(data);
      this.extractCategories(data);
      this.extractTags(data);
      this.extractAttachments(data);
      this.extractThumbnailIds(data);

      const items = data.rss.channel.item;
      const posts = Array.isArray(items) ? items : [items];
      
      console.log(`📝 Processing ${posts.length} items...`);
      
      const processedPosts = [];
      
      for (const item of posts) {
        const post = await this.processPost(item);
        if (post) {
          processedPosts.push(post);
        }
      }

      // Create summary
      const summary = {
        totalPosts: processedPosts.length,
        authors: Array.from(this.authors.values()).map(a => a.displayName),
        categories: Array.from(this.categories.values()).map(c => c.name),
        tags: Array.from(this.tags.values()).map(t => t.name),
        imagesDownloaded: this.downloadedImages.size,
        postsWithThumbnails: processedPosts.filter(p => p.thumbnail).length
      };

      fs.writeFileSync(
        path.join(this.outputDir, 'import-summary.json'), 
        JSON.stringify(summary, null, 2)
      );

      console.log('\n🎉 Import completed successfully!');
      console.log(`📊 Summary:`);
      console.log(`   - Posts: ${summary.totalPosts}`);
      console.log(`   - Authors: ${summary.authors.length}`);
      console.log(`   - Categories: ${summary.categories.length}`);
      console.log(`   - Tags: ${summary.tags.length}`);
      console.log(`   - Images downloaded: ${summary.imagesDownloaded}`);
      console.log(`   - Posts with thumbnails: ${summary.postsWithThumbnails}`);
      console.log(`\n📁 Output directory: ${this.outputDir}`);
      
    } catch (error) {
      console.error('❌ Import failed:', error);
      throw error;
    }
  }
}

// Usage
if (require.main === module) {
  const xmlPath = process.argv[2] || '~/Documents/Humaling/export.xml';
  const outputDir = process.argv[3] || './content/imported';
  
  const importer = new WordPressImporter(xmlPath, outputDir);
  importer.import().catch(console.error);
}

module.exports = WordPressImporter; 