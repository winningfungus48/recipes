# Data Import System

## Overview

The recipe app uses a master CSV file as the single source of truth for all recipe data. This system allows importing from multiple CSV files while maintaining data integrity and providing comprehensive audit trails.

## Master Schema

The master CSV file (`data/master/recipes_master.csv`) contains the following standardized fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Canonical ID built as `slug(title)-sha1(ingredients+instructions)` |
| `title` | String | Recipe title (required) |
| `ingredients` | String | Newline-joined ingredient list |
| `instructions` | String | Newline-joined cooking instructions |
| `sections_json` | String | JSON string for sub-recipe sections (future use) |
| `cookTimeMinutes` | Integer | Cooking time in minutes |
| `notes` | String | Additional notes or comments |
| `tags` | String | Comma-separated tags (lowercased, trimmed) |
| `category` | String | Standardized category (Breakfast, Lunch/Dinner, Desserts, Appetizers, Drinks, Other) |
| `image` | String | Image URL or path |
| `rating` | Float | Rating from 0-5 (optional) |
| `sourceFile` | String | Relative path to original CSV file |
| `sourceRow` | Integer | 1-based row index in source file |
| `importedAt` | String | ISO timestamp of import |
| `raw_payload_json` | String | JSON of the exact original row for auditability |

## Duplicate Policy

Duplicates are detected using the key `normalizedTitle|normalizedCategory` (trimmed, case-folded). When a duplicate is found:

- **Action**: Skip the duplicate row
- **Logging**: Record in `data/logs/import_duplicates.csv`
- **Master File**: No changes made to existing entries

## Data Validation

### Required Fields
- `title`: Must be present and non-empty
- `instructions` OR `sections_json`: At least one must be present

### Data Cleaning
- **Time Parsing**: Flexible parsing of time strings (e.g., "1 hr 15 min" → 75 minutes)
- **Tags**: Normalized to lowercase, comma-separated, trimmed
- **Categories**: Mapped to standardized values, defaults to "Other"
- **Text Fields**: Trimmed whitespace, newlines escaped for CSV

### Error Handling
Invalid rows are:
- **Skipped**: Not added to master file
- **Logged**: Recorded in `data/logs/import_errors.csv` with reason and raw data
- **Reported**: Included in import summary

## File Structure

```
data/
├── originals/           # Original CSV files (untouched)
├── master/
│   ├── recipes_master.csv    # Master file (single source of truth)
│   └── archive/              # Timestamped snapshots after each import
└── logs/
    ├── import_errors.csv     # Invalid rows
    ├── import_duplicates.csv # Duplicate rows
    └── import_summary.json   # Import statistics
```

## Usage

### Import All CSV Files
```bash
npm run import:recipes
```

### Import Specific Files
```bash
node scripts/import-recipes.js path/to/file1.csv path/to/file2.csv
```

### Import from Originals Directory
```bash
# Copy CSV files to data/originals/ first
npm run import:recipes
```

## Import Process

1. **Scan**: Find CSV files in `data/originals/` or specified paths
2. **Parse**: Process each CSV with robust parsing for quoted fields
3. **Map**: Convert to standardized schema using field mapping
4. **Validate**: Check required fields and data quality
5. **Deduplicate**: Skip rows that already exist in master
6. **Append**: Add valid new rows to master file
7. **Archive**: Create timestamped backup of master file
8. **Report**: Generate error, duplicate, and summary reports

## Field Mapping

The system automatically maps common field names to standardized columns:

| Standard Field | Possible Source Fields |
|----------------|------------------------|
| `title` | title, name, recipe_name |
| `category` | category, type, meal_type |
| `tags` | tags, tag, keywords |
| `cookTime` | cookTime, cook_time, time, duration, cooking_time |
| `ingredients` | ingredients, ingredient, ingredient_list |
| `instructions` | instructions, instruction, steps, directions, method |
| `notes` | notes, note, comments, description |
| `rating` | rating, score, stars |
| `image` | image, photo, picture, img |

## Category Mapping

Source categories are mapped to standardized values:

| Source Category | Standard Category |
|-----------------|-------------------|
| Meals - Breakfast | Breakfast |
| Meals - Lunch/Dinner | Lunch/Dinner |
| Appetizers & Sides | Appetizers |
| Appetizers | Appetizers |
| Drinks | Drinks |
| Desserts | Desserts |
| Archived | Other |
| (unmatched) | Other |

## Reports

### Import Summary (`import_summary.json`)
```json
{
  "processed": 150,
  "added": 120,
  "duplicates": 20,
  "errors": 10,
  "touchedFiles": ["file1.csv", "file2.csv"],
  "archivePath": "data/master/archive/recipes_master_2025-09-15_01-30-00.csv",
  "duration": 2500,
  "timestamp": "2025-09-15T01:30:00.000Z"
}
```

### Error Report (`import_errors.csv`)
Columns: `reason`, `sourceFile`, `sourceRow`, `raw_payload_json`

### Duplicate Report (`import_duplicates.csv`)
Columns: `title`, `category`, `sourceFile`, `sourceRow`, `duplicateOfId`

## Best Practices

1. **Backup**: Always backup the master file before major imports
2. **Review**: Check error and duplicate reports after each import
3. **Clean Data**: Clean source CSV files before importing when possible
4. **Incremental**: Import files incrementally to catch issues early
5. **Audit**: Use `raw_payload_json` to trace data back to original sources

## Troubleshooting

### Common Issues
- **Column Mismatch**: Check CSV formatting and quoted fields
- **Missing Fields**: Ensure required fields are present in source data
- **Time Parsing**: Use standard time formats (e.g., "1 hr 30 min")
- **Category Mapping**: Add new categories to `CATEGORY_MAPPING` if needed

### Debug Mode
Add `console.log` statements in the import script to debug specific issues.

## Future Enhancements

- **Sections Support**: Full support for `sections_json` with sub-recipe sections
- **Image Processing**: Automatic image optimization and storage
- **Data Validation**: More sophisticated validation rules
- **Import Scheduling**: Automated import scheduling
- **Data Transformation**: Advanced data cleaning and transformation
