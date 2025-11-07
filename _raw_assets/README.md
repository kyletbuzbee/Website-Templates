# Asset Distribution Pipeline - Demo

This folder is where you place images to be automatically distributed to the appropriate industry folders.

## Naming Convention

Use this format: `[industry]-[section]-[description].[extension]`

### Examples:

**Roofing Industry:**
- `roofing-hero-professional-crew.jpg` → `roofing/assets/images/roofing-hero-professional-crew.webp`
- `roofing-about-certified-team.png` → `roofing/assets/images/roofing-about-certified-team.webp`
- `roofing-gallery-before-after.jpeg` → `roofing/assets/images/roofing-gallery-before-after.webp`

**Fitness Industry:**
- `fitness-hero-gym-equipment.jpg` → `fitness/assets/images/fitness-hero-gym-equipment.webp`
- `fitness-about-trainer-team.png` → `fitness/assets/images/fitness-about-trainer-team.webp`

**Contractors & Trades:**
- `contractors-trades-hero-construction-site.jpg` → `contractors-trades/assets/images/contractors-trades-hero-construction-site.webp`

**Real Estate:**
- `real-estate-hero-modern-home.jpg` → `real-estate/assets/images/real-estate-hero-modern-home.webp`

**Retail E-commerce:**
- `retail-ecommerce-hero-fashion-store.jpg` → `retail-ecommerce/assets/images/retail-ecommerce-hero-fashion-store.webp`

## Supported Industries:
- `contractors-trades`
- `real-estate`
- `retail-ecommerce`
- `fitness`
- `healthcare`
- `legal`
- `photography`
- `restaurants`
- `roofing`

## How to Use:

1. Place your images in this `_raw_assets/` folder
2. Name them using the convention above
3. Run: `npm run distribute-assets`
4. Images will be automatically optimized to WebP format and distributed to the correct industry folders

## What the Script Does:

- ✅ Automatically detects industry from filename
- ✅ Validates file extensions (jpg, jpeg, png, webp)
- ✅ Optimizes images using Sharp library
- ✅ Converts all images to WebP format for better performance
- ✅ Creates necessary folder structure
- ✅ Provides detailed logging of the process

## Ready to Test!

The pipeline is now working correctly. Try adding some images with the naming convention above and run `npm run distribute-assets` to see it in action!
