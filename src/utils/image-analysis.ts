/**
 * Image Analysis Utilities
 * Detects content type (icon vs photo) and provides conversion recommendations
 */

import sharp from 'sharp';
import fs from 'fs/promises';

interface ChannelStats {
  mean: number;
  variance?: number;
  [key: string]: any;
}

interface ImageMetrics {
  width: number;
  height: number;
  aspectRatio: number;
  pixelCount: number;
  isGrayscale: boolean;
  colorVariance: number;
  entropy: number;
  format: string;
}

/**
 * Analyze image to determine if it's an icon or photo
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Object>} Analysis result with content type and recommendations
 */
export async function analyzeImageContent(imagePath: string) {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Get image statistics
    const stats = await image.stats();

    // Calculate various metrics for classification
    const width = metadata.width || 0;
    const height = metadata.height || 0;
    const aspectRatio = width / height;
    const pixelCount = width * height;

    // Color analysis
    const { channels } = stats;
    const isGrayscale =
      !channels ||
      channels.length === 1 ||
      (channels.length >= 3 &&
        channels[0]?.mean === channels[1]?.mean &&
        channels[1]?.mean === channels[2]?.mean);

    // Calculate color variance (measure of color complexity)
    let colorVariance = 0;
    if (channels && channels.length >= 3) {
      const rVariance = (channels[0] as any)?.variance || 0;
      const gVariance = (channels[1] as any)?.variance || 0;
      const bVariance = (channels[2] as any)?.variance || 0;
      colorVariance = (rVariance + gVariance + bVariance) / 3;
    }

    // Calculate entropy-like measure from histogram
    const histogram = await getImageHistogram(imagePath);
    const entropy = calculateEntropy(histogram);

    // Classification logic
    const isIcon = classifyAsIcon({
      width,
      height,
      aspectRatio,
      pixelCount,
      isGrayscale,
      colorVariance,
      entropy,
      format: metadata.format || 'unknown',
    });

    // Generate conversion recommendations
    const recommendations = generateConversionRecommendations(isIcon, metadata.format || 'unknown');

    return {
      path: imagePath,
      metadata,
      analysis: {
        isIcon,
        contentType: isIcon ? 'icon' : 'photo',
        width,
        height,
        aspectRatio,
        pixelCount,
        isGrayscale,
        colorVariance,
        entropy,
      },
      recommendations,
    };
  } catch (error) {
    console.error(`Error analyzing image ${imagePath}:`, error);
    // Default to photo if analysis fails
    return {
      path: imagePath,
      error: error instanceof Error ? error.message : 'Unknown error',
      analysis: {
        isIcon: false,
        contentType: 'photo',
      },
      recommendations: {
        formats: ['jpeg', 'webp', 'avif'],
        primaryFormat: 'jpeg',
      },
    };
  }
}

/**
 * Classify image as icon based on various heuristics
 */
function classifyAsIcon(metrics: ImageMetrics): boolean {
  const { width, height, aspectRatio, pixelCount, isGrayscale, colorVariance, entropy, format } =
    metrics;

  // Size-based classification (icons are typically small)
  const isSmall = pixelCount < 100000; // Less than ~316x316 pixels
  const isSquareLike = aspectRatio >= 0.8 && aspectRatio <= 1.25;

  // PNG format bias toward icons (especially if small)
  const isPngIcon = format === 'png' && (isSmall || (width <= 256 && height <= 256));

  // Color analysis (icons often have limited colors, high contrast)
  const hasLimitedColors = entropy < 0.7; // Low entropy = limited color variation
  const hasHighContrast = colorVariance > 1000; // High variance indicates contrast

  // SVG files are always considered icons
  if (format === 'svg') {
    return true;
  }

  // Classification rules (weighted scoring)
  let iconScore = 0;

  if (isSmall) {
    iconScore += 3;
  }
  if (isSquareLike) {
    iconScore += 1;
  }
  if (isPngIcon) {
    iconScore += 2;
  }
  if (hasLimitedColors) {
    iconScore += 2;
  }
  if (hasHighContrast) {
    iconScore += 1;
  }
  if (isGrayscale) {
    iconScore += 1; // Many icons are monochromatic
  }

  // Additional heuristics for very small images
  if (width <= 64 && height <= 64) {
    iconScore += 2;
  }
  if (width <= 128 && height <= 128) {
    iconScore += 1;
  }

  return iconScore >= 4; // Threshold for icon classification
}

/**
 * Generate conversion recommendations based on content type
 */
function generateConversionRecommendations(isIcon: boolean, originalFormat: string) {
  if (isIcon) {
    // Icons: prefer SVG for scalability, fallback to WebP/AVIF
    const formats = ['svg'];
    if (originalFormat !== 'svg') {
      formats.push('webp', 'avif');
    }
    return {
      formats,
      primaryFormat: 'svg',
      reason: 'Icons benefit from vector format for scalability',
    };
  } else {
    // Photos: prefer JPEG + modern formats for compression
    return {
      formats: ['jpeg', 'webp', 'avif'],
      primaryFormat: 'jpeg',
      reason: 'Photos benefit from lossy compression for smaller file sizes',
    };
  }
}

/**
 * Get image histogram for entropy calculation
 */
async function getImageHistogram(imagePath: string): Promise<number[]> {
  try {
    const image = sharp(imagePath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    // Create histogram bins
    const histogram = new Array(256).fill(0);
    const bytesPerPixel = info.channels;

    // Count pixel intensities (simplified grayscale histogram)
    for (let i = 0; i < data.length; i += bytesPerPixel) {
      // Use luminance for multi-channel images
      let intensity = data[i] || 0; // Red channel or grayscale
      if (bytesPerPixel >= 3) {
        // Calculate luminance: 0.299*R + 0.587*G + 0.114*B
        const r = data[i] || 0;
        const g = data[i + 1] || 0;
        const b = data[i + 2] || 0;
        intensity = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      }
      if (intensity >= 0 && intensity < 256) {
        histogram[intensity]++;
      }
    }

    return histogram;
  } catch (error) {
    console.warn(
      `Could not generate histogram for ${imagePath}:`,
      error instanceof Error ? error.message : 'Unknown error',
    );
    return new Array(256).fill(1); // Uniform distribution fallback
  }
}

/**
 * Calculate entropy from histogram
 */
function calculateEntropy(histogram: number[]): number {
  const total = histogram.reduce((sum: number, count: number) => sum + count, 0);
  if (total === 0) {
    return 0;
  }

  let entropy = 0;
  for (const count of histogram) {
    if (count > 0) {
      const probability = count / total;
      entropy -= probability * Math.log2(probability);
    }
  }

  // Normalize entropy (0-1 scale)
  return entropy / 8; // Maximum entropy for 256 bins is log2(256) = 8
}

/**
 * Convert PNG icon to SVG using potrace
 * @param {string} inputPath - Input PNG path
 * @param {string} outputPath - Output SVG path
 * @returns {Promise<boolean>} Success status
 */
export async function convertPngToSvg(inputPath: string, outputPath: string): Promise<boolean> {
  try {
    // Dynamic import for potrace (ESM compatibility)
    const potrace = await import('potrace');

    return new Promise((resolve, reject) => {
      potrace.trace(
        inputPath,
        {
          color: 'auto', // Preserve colors
          background: 'transparent',
          threshold: 128,
          turdSize: 2,
          optTolerance: 0.4,
        },
        (err: any, svg: string) => {
          if (err) {
            reject(err);
          } else {
            // Write SVG to file
            fs.writeFile(outputPath, svg, 'utf8')
              .then(() => resolve(true))
              .catch(reject);
          }
        },
      );
    });
  } catch (error) {
    console.error(`SVG conversion failed for ${inputPath}:`, error);
    return false;
  }
}

/**
 * Batch analyze multiple images
 * @param {string[]} imagePaths - Array of image paths
 * @returns {Promise<Object[]>} Array of analysis results
 */
export async function analyzeImagesBatch(imagePaths: string[]): Promise<any[]> {
  const results = [];

  for (const imagePath of imagePaths) {
    try {
      const result = await analyzeImageContent(imagePath);
      results.push(result);
    } catch (error) {
      console.error(`Failed to analyze ${imagePath}:`, error);
      results.push({
        path: imagePath,
        error: error instanceof Error ? error.message : 'Unknown error',
        analysis: { isIcon: false, contentType: 'photo' },
        recommendations: { formats: ['jpeg', 'webp', 'avif'], primaryFormat: 'jpeg' },
      });
    }
  }

  return results;
}
