import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ORIGINALS_DIR = path.join(__dirname, '../data/originals');
const MASTER_DIR = path.join(__dirname, '../data/master');
const ARCHIVE_DIR = path.join(__dirname, '../data/master/archive');
const LOGS_DIR = path.join(__dirname, '../data/logs');
const MASTER_FILE = path.join(MASTER_DIR, 'recipes_master.csv');

// Ensure directories exist
[ORIGINALS_DIR, MASTER_DIR, ARCHIVE_DIR, LOGS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Field mapping configuration
const FIELD_MAPPING = {
  'title': ['title', 'name', 'recipe_name'],
  'category': ['category', 'type', 'meal_type'],
  'tags': ['tags', 'tag', 'keywords'],
  'cookTime': ['cookTime', 'cook_time', 'time', 'duration', 'cooking_time'],
  'ingredients': ['ingredients', 'ingredient', 'ingredient_list'],
  'instructions': ['instructions', 'instruction', 'steps', 'directions', 'method'],
  'notes': ['notes', 'note', 'comments', 'description'],
  'rating': ['rating', 'score', 'stars'],
  'image': ['image', 'photo', 'picture', 'img']
};

// Category mapping
const CATEGORY_MAPPING = {
  'Meals - Breakfast': 'Breakfast',
  'Meals - Lunch/Dinner': 'Lunch/Dinner',
  'Appetizers & Sides': 'Appetizers',
  'Appetizers': 'Appetizers',
  'Drinks': 'Drinks',
  'Desserts': 'Desserts',
  'Archived': 'Other'
};

// Statistics tracking
let stats = {
  processed: 0,
  added: 0,
  duplicates: 0,
  errors: 0,
  touchedFiles: [],
  startTime: new Date()
};

// Error and duplicate tracking
const errors = [];
const duplicates = [];

// New comprehensive logging arrays
const flaggedRecipes = []; // Recipes with issues that need manual review
const duplicateRecipes = []; // Duplicate recipes that were added anyway
const placeholderRecipes = []; // Recipes with placeholder instructions

/**
 * Generate canonical ID from title, ingredients, and instructions
 */
function generateId(title, ingredients, instructions) {
  const normalizedTitle = title.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
  const content = `${ingredients}|${instructions}`;
  const hash = crypto.createHash('sha1').update(content).digest('hex').substring(0, 8);
  return `${normalizedTitle}-${hash}`;
}

/**
 * Parse time string to minutes
 */
function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  
  const time = timeStr.toLowerCase().trim();
  let totalMinutes = 0;
  
  // Match hours
  const hourMatch = time.match(/(\d+)\s*(?:hour|hr|h)\s*/);
  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1]) * 60;
  }
  
  // Match minutes
  const minMatch = time.match(/(\d+)\s*(?:min|minute|m)\s*/);
  if (minMatch) {
    totalMinutes += parseInt(minMatch[1]);
  }
  
  // If no specific units, assume minutes
  if (totalMinutes === 0) {
    const numMatch = time.match(/(\d+)/);
    if (numMatch) {
      totalMinutes = parseInt(numMatch[1]);
    }
  }
  
  return totalMinutes > 0 ? totalMinutes : null;
}

/**
 * Normalize and clean tags
 */
function normalizeTags(tagsStr) {
  if (!tagsStr) return '';
  
  return tagsStr
    .split(/[,;|\n]/)
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0)
    .join(',');
}

/**
 * Map category to standardized value
 */
function mapCategory(category) {
  if (!category) return 'Other';
  
  const normalized = category.trim();
  return CATEGORY_MAPPING[normalized] || 'Other';
}

/**
 * Parse CSV content with proper handling of quoted multi-line fields
 */
function parseCSVContent(content) {
  const lines = [];
  let currentLine = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentLine += '"';
        i += 2; // Skip both quotes
        continue;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === '\n' && !inQuotes) {
      // End of line
      lines.push(currentLine);
      currentLine = '';
      i++;
      continue;
    } else if (char === '\r' && nextChar === '\n' && !inQuotes) {
      // Windows line ending
      lines.push(currentLine);
      currentLine = '';
      i += 2;
      continue;
    }
    
    currentLine += char;
    i++;
  }
  
  // Add the last line if it doesn't end with newline
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  return lines.filter(line => line.trim().length > 0);
}

/**
 * Parse a single CSV line into fields
 */
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  fields.push(current.trim());
  return fields;
}

/**
 * Map CSV row to standardized fields
 */
function mapRowToStandardFields(headers, values, sourceFile, sourceRow) {
  const mapped = {};
  const rawPayload = {};
  
  // Map each field
  headers.forEach((header, index) => {
    const value = values[index] || '';
    rawPayload[header] = value;
    
    // Find matching standard field
    for (const [standardField, possibleHeaders] of Object.entries(FIELD_MAPPING)) {
      if (possibleHeaders.some(h => h.toLowerCase() === header.toLowerCase())) {
        mapped[standardField] = value;
        break;
      }
    }
  });
  
  // Normalize and clean the data
  const title = mapped.title || '';
  const ingredients = mapped.ingredients || '';
  const instructions = mapped.instructions || '';
  const category = mapCategory(mapped.category);
  const tags = normalizeTags(mapped.tags);
  const cookTimeMinutes = parseTimeToMinutes(mapped.cookTime);
  const rating = mapped.rating ? parseFloat(mapped.rating) : null;
  
  return {
    id: generateId(title, ingredients, instructions),
    title: title.trim(),
    ingredients: ingredients.replace(/\n/g, '\\n'),
    instructions: instructions.replace(/\n/g, '\\n'),
    sections_json: '',
    cookTimeMinutes: cookTimeMinutes || '',
    notes: (mapped.notes || '').trim(),
    tags: tags,
    category: category,
    image: (mapped.image || '').trim(),
    rating: rating || '',
    sourceFile: path.relative(ORIGINALS_DIR, sourceFile),
    sourceRow: sourceRow,
    importedAt: new Date().toISOString(),
    raw_payload_json: JSON.stringify(rawPayload)
  };
}

/**
 * Check if row is valid and add placeholder instructions if needed
 */
function validateAndFixRow(mappedRow) {
  const issues = [];
  
  // Check for missing title
  if (!mappedRow.title || mappedRow.title.trim() === '') {
    issues.push('MISSING_TITLE');
    return { valid: false, issues, mappedRow };
  }
  
  // Check for missing instructions and add placeholder
  if (!mappedRow.instructions || mappedRow.instructions.trim() === '') {
    if (mappedRow.ingredients && mappedRow.ingredients.trim() !== '') {
      mappedRow.instructions = 'See ingredients for preparation details.';
      issues.push('MISSING_INSTRUCTIONS_PLACEHOLDER_ADDED');
    } else {
      mappedRow.instructions = 'Instructions not provided.';
      issues.push('MISSING_INSTRUCTIONS_NO_INGREDIENTS');
    }
  }
  
  return { valid: true, issues, mappedRow };
}

/**
 * Check for duplicates and return duplicate info
 */
function checkForDuplicate(mappedRow, existingRows) {
  const key = `${mappedRow.title.toLowerCase().trim()}|${mappedRow.category}`;
  const duplicate = existingRows.find(row => 
    `${row.title.toLowerCase().trim()}|${row.category}` === key
  );
  
  if (duplicate) {
    return {
      isDuplicate: true,
      duplicateId: duplicate.id,
      duplicateSource: duplicate.sourceFile
    };
  }
  
  return { isDuplicate: false };
}

/**
 * Load existing master file
 */
function loadMasterFile() {
  if (!fs.existsSync(MASTER_FILE)) {
    return [];
  }
  
  const content = fs.readFileSync(MASTER_FILE, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length <= 1) return []; // No data rows
  
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      rows.push(row);
    }
  }
  
  return rows;
}

/**
 * Save master file
 */
function saveMasterFile(rows) {
  if (rows.length === 0) return;
  
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  fs.writeFileSync(MASTER_FILE, csvContent);
}

/**
 * Create archive copy
 */
function createArchive() {
  if (!fs.existsSync(MASTER_FILE)) return;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const archiveFile = path.join(ARCHIVE_DIR, `recipes_master_${timestamp}.csv`);
  
  fs.copyFileSync(MASTER_FILE, archiveFile);
  return archiveFile;
}

/**
 * Write error report
 */
function writeErrorReport() {
  if (errors.length === 0) return;
  
  const errorFile = path.join(LOGS_DIR, 'import_errors.csv');
  const errorContent = [
    'reason,sourceFile,sourceRow,raw_payload_json',
    ...errors.map(error => `"${error.reason}","${error.sourceFile}",${error.sourceRow},"${error.rawPayload}"`)
  ].join('\n');
  
  fs.writeFileSync(errorFile, errorContent);
}

/**
 * Write duplicate report
 */
function writeDuplicateReport() {
  if (duplicates.length === 0) return;
  
  const duplicateFile = path.join(LOGS_DIR, 'import_duplicates.csv');
  const duplicateContent = [
    'title,category,sourceFile,sourceRow,duplicateOfId',
    ...duplicates.map(dup => `"${dup.title}","${dup.category}","${dup.sourceFile}",${dup.sourceRow},"${dup.duplicateOfId}"`)
  ].join('\n');
  
  fs.writeFileSync(duplicateFile, duplicateContent);
}

/**
 * Write import summary
 */
function writeImportSummary(archivePath) {
  const summary = {
    processed: stats.processed,
    added: stats.added,
    duplicates: stats.duplicates,
    errors: stats.errors,
    touchedFiles: stats.touchedFiles,
    archivePath: archivePath,
    duration: new Date() - stats.startTime,
    timestamp: new Date().toISOString()
  };
  
  const summaryFile = path.join(LOGS_DIR, 'import_summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
}

/**
 * Write flagged recipes report (recipes with issues for manual review)
 */
function writeFlaggedRecipesReport() {
  if (flaggedRecipes.length === 0) return;
  
  const flaggedFile = path.join(LOGS_DIR, 'flagged_recipes_for_review.csv');
  const flaggedContent = [
    'title,category,sourceFile,sourceRow,id,issues',
    ...flaggedRecipes.map(recipe => 
      `"${recipe.title}","${recipe.category}","${recipe.sourceFile}",${recipe.sourceRow},"${recipe.id}","${recipe.issues.join('; ')}"`
    )
  ].join('\n');
  
  fs.writeFileSync(flaggedFile, flaggedContent);
}

/**
 * Write duplicate recipes report (duplicates that were added anyway)
 */
function writeDuplicateRecipesReport() {
  if (duplicateRecipes.length === 0) return;
  
  const duplicateFile = path.join(LOGS_DIR, 'duplicate_recipes_added.csv');
  const duplicateContent = [
    'title,category,sourceFile,sourceRow,newId,duplicateOfId,duplicateSource',
    ...duplicateRecipes.map(recipe => 
      `"${recipe.title}","${recipe.category}","${recipe.sourceFile}",${recipe.sourceRow},"${recipe.newId}","${recipe.duplicateOfId}","${recipe.duplicateSource}"`
    )
  ].join('\n');
  
  fs.writeFileSync(duplicateFile, duplicateContent);
}

/**
 * Write placeholder recipes report (recipes with placeholder instructions)
 */
function writePlaceholderRecipesReport() {
  if (placeholderRecipes.length === 0) return;
  
  const placeholderFile = path.join(LOGS_DIR, 'placeholder_instructions_recipes.csv');
  const placeholderContent = [
    'title,category,sourceFile,sourceRow,id',
    ...placeholderRecipes.map(recipe => 
      `"${recipe.title}","${recipe.category}","${recipe.sourceFile}",${recipe.sourceRow},"${recipe.id}"`
    )
  ].join('\n');
  
  fs.writeFileSync(placeholderFile, placeholderContent);
}

/**
 * Process a single CSV file
 */
function processCSVFile(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = parseCSVContent(content);
    
    if (lines.length < 2) {
      console.log(`  ⚠️  No data found`);
      return;
    }
    
    const headers = parseCSVLine(lines[0]);
    const existingRows = loadMasterFile();
    
    let fileProcessed = 0;
    let fileAdded = 0;
    let fileDuplicates = 0;
    let fileErrors = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        
        if (values.length !== headers.length) {
          errors.push({
            reason: 'Column count mismatch',
            sourceFile: path.relative(ORIGINALS_DIR, filePath),
            sourceRow: i + 1,
            rawPayload: JSON.stringify({ headers, values })
          });
          fileErrors++;
          continue;
        }
        
        const mappedRow = mapRowToStandardFields(headers, values, filePath, i + 1);
        fileProcessed++;
        
        // Validate and fix the row (add placeholders for missing instructions)
        const validation = validateAndFixRow(mappedRow);
        
        if (!validation.valid) {
          errors.push({
            reason: validation.issues.join(', '),
            sourceFile: path.relative(ORIGINALS_DIR, filePath),
            sourceRow: i + 1,
            rawPayload: mappedRow.raw_payload_json
          });
          fileErrors++;
          continue;
        }
        
        // Check for duplicates but allow them to be added
        const duplicateCheck = checkForDuplicate(validation.mappedRow, existingRows);
        
        if (duplicateCheck.isDuplicate) {
          // Add duplicate info to logging
          duplicateRecipes.push({
            title: validation.mappedRow.title,
            category: validation.mappedRow.category,
            sourceFile: validation.mappedRow.sourceFile,
            sourceRow: validation.mappedRow.sourceRow,
            duplicateOfId: duplicateCheck.duplicateId,
            duplicateSource: duplicateCheck.duplicateSource,
            newId: validation.mappedRow.id
          });
          fileDuplicates++;
        }
        
        // Log any issues for manual review
        if (validation.issues.length > 0) {
          flaggedRecipes.push({
            title: validation.mappedRow.title,
            category: validation.mappedRow.category,
            sourceFile: validation.mappedRow.sourceFile,
            sourceRow: validation.mappedRow.sourceRow,
            issues: validation.issues,
            id: validation.mappedRow.id
          });
          
          // Track placeholder instructions
          if (validation.issues.includes('MISSING_INSTRUCTIONS_PLACEHOLDER_ADDED') || 
              validation.issues.includes('MISSING_INSTRUCTIONS_NO_INGREDIENTS')) {
            placeholderRecipes.push({
              title: validation.mappedRow.title,
              category: validation.mappedRow.category,
              sourceFile: validation.mappedRow.sourceFile,
              sourceRow: validation.mappedRow.sourceRow,
              id: validation.mappedRow.id
            });
          }
        }
        
        // Add the recipe (including duplicates and those with issues)
        existingRows.push(validation.mappedRow);
        fileAdded++;
        
      } catch (error) {
        errors.push({
          reason: `Parse error: ${error.message}`,
          sourceFile: path.relative(ORIGINALS_DIR, filePath),
          sourceRow: i + 1,
          rawPayload: JSON.stringify({ line: lines[i] })
        });
        fileErrors++;
      }
    }
    
    // Save updated master file
    saveMasterFile(existingRows);
    
    console.log(`  ✅ Processed: ${fileProcessed}, Added: ${fileAdded}, Duplicates: ${fileDuplicates}, Errors: ${fileErrors}`);
    
    stats.processed += fileProcessed;
    stats.added += fileAdded;
    stats.duplicates += fileDuplicates;
    stats.errors += fileErrors;
    stats.touchedFiles.push(path.basename(filePath));
    
  } catch (error) {
    console.error(`  ❌ Error processing file: ${error.message}`);
    stats.errors++;
  }
}

/**
 * Main import function
 */
function importRecipes(targetFiles = null) {
  console.log('🍳 Starting Recipe Import Process...\n');
  
  // Get list of CSV files to process
  const csvFiles = targetFiles || 
    fs.readdirSync(ORIGINALS_DIR)
      .filter(file => file.endsWith('.csv'))
      .map(file => path.join(ORIGINALS_DIR, file));
  
  if (csvFiles.length === 0) {
    console.log('❌ No CSV files found to process');
    return;
  }
  
  console.log(`📁 Found ${csvFiles.length} CSV files to process\n`);
  
  // Process each file
  csvFiles.forEach(processCSVFile);
  
  // Create archive
  const archivePath = createArchive();
  
  // Write reports
  writeErrorReport();
  writeDuplicateReport();
  writeFlaggedRecipesReport();
  writeDuplicateRecipesReport();
  writePlaceholderRecipesReport();
  writeImportSummary(archivePath);
  
  // Print summary
  console.log('\n🎉 Import Complete!');
  console.log('═══════════════════════════════════════');
  console.log(`📊 Total processed: ${stats.processed}`);
  console.log(`✅ Added to master: ${stats.added}`);
  console.log(`🔄 Duplicates added: ${duplicateRecipes.length}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`📁 Files processed: ${stats.touchedFiles.length}`);
  console.log(`📋 Master file: ${MASTER_FILE}`);
  console.log(`📦 Archive: ${archivePath}`);
  
  if (errors.length > 0) {
    console.log(`📝 Error report: ${path.join(LOGS_DIR, 'import_errors.csv')}`);
  }
  if (duplicateRecipes.length > 0) {
    console.log(`📝 Duplicate recipes added: ${path.join(LOGS_DIR, 'duplicate_recipes_added.csv')}`);
  }
  if (flaggedRecipes.length > 0) {
    console.log(`🚩 Flagged recipes for review: ${path.join(LOGS_DIR, 'flagged_recipes_for_review.csv')}`);
  }
  if (placeholderRecipes.length > 0) {
    console.log(`📝 Placeholder instructions: ${path.join(LOGS_DIR, 'placeholder_instructions_recipes.csv')}`);
  }
}

// Handle CLI arguments
const args = process.argv.slice(2);
const targetFiles = args.length > 0 ? args.map(file => path.resolve(file)) : null;

// Run import
importRecipes(targetFiles);
