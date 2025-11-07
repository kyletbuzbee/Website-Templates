# Public Assets Directory

This directory contains static assets that are served directly by the web server.

## Required PWA Assets

For the PWA functionality to work properly, add the following files:

- `favicon.ico` - Favicon for browser tabs
- `apple-touch-icon.png` - iOS home screen icon (180x180)
- `pwa-192x192.png` - PWA icon (192x192)
- `pwa-512x512.png` - PWA icon (512x512)
- `masked-icon.svg` - Safari pinned tab icon

## Current Status

These assets are currently missing. The build system will work without them, but PWA features will be limited.

## Adding Assets

1. Create or obtain the required icon files
2. Place them in this `public/` directory
3. The Vite build system will automatically include them in the build output
