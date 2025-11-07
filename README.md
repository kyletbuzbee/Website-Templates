# Production Ready Templates

A collection of professional website templates with automated asset distribution pipeline.

## 🚀 Automated Asset Distribution Pipeline

### Zero-Touch Asset Workflow

This project includes an automated pipeline that processes and distributes images based on filename conventions.

### Step 1: Golden Rule of Naming

Name your source images using this exact format:
```
[industry]-[section]-[description].[extension]
```

**Examples:**
- `legal-hero-courtroom.jpg` → goes to `industries/legal/assets/images/`
- `medical-about-team.png` → goes to `industries/medical/assets/images/`
- `fitness-service-yoga.webp` → goes to `industries/fitness/assets/images/`

### Step 2: Using the Pipeline

1. **Drop Zone**: Place images in the `_raw_assets/` folder
2. **Run Pipeline**: Execute `npm run distribute-assets`
3. **Automatic Processing**:
   - Parses filenames to determine destination
   - Optimizes images using Sharp
   - Converts to WebP format for performance
   - Distributes to correct industry folders

### Step 3: Command Usage

```bash
# Install dependencies (if needed)
npm install

# Run asset distribution
npm run distribute-assets

# Or run directly
node scripts/distribute-assets.js
```

### 🛡️ Safety Features

- **Validation**: Only processes images matching the naming convention
- **Industry Check**: Verifies target industry folder exists before processing
- **Error Handling**: Continues processing other images if one fails
- **No Overwrites**: Safe file operations prevent accidental data loss

### 📁 Project Structure

```
├── industries/                 # Industry-specific templates
│   ├── [industry]/
│   │   ├── [variant]/
│   │   │   ├── index.html
│   │   │   ├── style.css
│   │   │   ├── script.js
│   │   │   └── assets/
├── scripts/                    # Utility scripts
│   └── distribute-assets.js    # Asset distribution pipeline
├── _raw_assets/               # Drop zone for source images
└── package.json
```

### 🔧 Dependencies

- `sharp`: High-performance image processing
- `fs-extra`: Enhanced file system operations
- `glob`: Pattern matching for files

### 📊 Pipeline Benefits

- **Standardization**: Enforces consistent naming across teams
- **Performance**: Automatic WebP conversion and optimization
- **Scalability**: Process thousands of images in seconds
- **Safety**: Validates operations before execution
- **Automation**: Zero-touch processing once files are named correctly
