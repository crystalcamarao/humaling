#!/usr/bin/env node

const path = require('path');
const os = require('os');
const WordPressImporter = require('./wordpress-import');

// Configuration
const xmlPath = path.join(os.homedir(), 'Documents', 'Humaling', 'export.xml');
const outputDir = path.join(__dirname, '..', 'content', 'imported');

console.log('🚀 WordPress Import Tool');
console.log('========================');
console.log(`📄 XML File: ${xmlPath}`);
console.log(`📁 Output: ${outputDir}`);
console.log('');

// Check if XML file exists
const fs = require('fs');
if (!fs.existsSync(xmlPath)) {
  console.error(`❌ XML file not found at: ${xmlPath}`);
  console.log('Please make sure your WordPress export file is at: ~/Documents/Humaling/export.xml');
  process.exit(1);
}

// Run the import
const importer = new WordPressImporter(xmlPath, outputDir);
importer.import()
  .then(() => {
    console.log('\n✅ Import completed!');
    console.log('\nNext steps:');
    console.log('1. Review the imported content in content/imported/');
    console.log('2. Copy the blog posts to content/blog/');
    console.log('3. Copy the images to public/images/uploads/');
    console.log('4. Update the DecapCMS config if needed');
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }); 