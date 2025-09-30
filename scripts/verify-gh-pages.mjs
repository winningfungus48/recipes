#!/usr/bin/env node

/**
 * GitHub Pages Deployment Verification Script
 * 
 * This script verifies that all asset URLs referenced in the deployed index.html
 * are accessible and return HTTP 200 status codes.
 * 
 * Usage: node scripts/verify-gh-pages.mjs [SITE_URL]
 * 
 * Environment Variables:
 * - SITE_URL: The base URL of the deployed site (default: https://winningfungus48.github.io/recipes/)
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DEFAULT_SITE_URL = 'https://winningfungus48.github.io/recipes/';
const SITE_URL = process.env.SITE_URL || DEFAULT_SITE_URL;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Extract asset URLs from HTML content
 */
function extractAssetUrls(htmlContent) {
  const assetUrls = [];
  
  // Match script tags with src attributes
  const scriptMatches = htmlContent.match(/<script[^>]+src="([^"]+)"[^>]*>/g) || [];
  scriptMatches.forEach(match => {
    const srcMatch = match.match(/src="([^"]+)"/);
    if (srcMatch) {
      assetUrls.push(srcMatch[1]);
    }
  });
  
  // Match link tags with href attributes (CSS, preload, etc.)
  const linkMatches = htmlContent.match(/<link[^>]+href="([^"]+)"[^>]*>/g) || [];
  linkMatches.forEach(match => {
    const hrefMatch = match.match(/href="([^"]+)"/);
    if (hrefMatch) {
      assetUrls.push(hrefMatch[1]);
    }
  });
  
  return assetUrls;
}

/**
 * Check if a URL is accessible
 */
async function checkUrl(url) {
  try {
    const response = await fetch(url);
    return {
      url,
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    };
  } catch (error) {
    return {
      url,
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

/**
 * Main verification function
 */
async function verifyDeployment() {
  log(`\n${colors.bright}🔍 Verifying GitHub Pages Deployment${colors.reset}\n`);
  logInfo(`Site URL: ${SITE_URL}`);
  
  try {
    // Fetch the deployed index.html
    logInfo('Fetching deployed index.html...');
    const response = await fetch(SITE_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch index.html: ${response.status} ${response.statusText}`);
    }
    
    const htmlContent = await response.text();
    logSuccess('Successfully fetched index.html');
    
    // Extract asset URLs
    const assetUrls = extractAssetUrls(htmlContent);
    logInfo(`Found ${assetUrls.length} asset URLs to verify`);
    
    if (assetUrls.length === 0) {
      logWarning('No asset URLs found in index.html');
      return;
    }
    
    // Check each asset URL
    logInfo('\nVerifying asset URLs...');
    const results = [];
    
    for (const assetUrl of assetUrls) {
      // Skip Google Fonts preconnect URLs (they're expected to return 404)
      if (assetUrl.includes('fonts.googleapis.com') || assetUrl.includes('fonts.gstatic.com')) {
        logInfo(`Skipping preconnect URL: ${assetUrl}`);
        continue;
      }
      // Handle both absolute and relative URLs
      let fullUrl;
      if (assetUrl.startsWith('http')) {
        fullUrl = assetUrl;
      } else if (assetUrl.startsWith('/')) {
        // Absolute path - construct from base domain
        const baseDomain = SITE_URL.replace(/\/recipes\/?$/, '');
        fullUrl = `${baseDomain}${assetUrl}`;
      } else {
        // Relative path - append to site URL
        fullUrl = `${SITE_URL.replace(/\/$/, '')}/${assetUrl}`;
      }
      const result = await checkUrl(fullUrl);
      results.push(result);
      
      if (result.ok) {
        logSuccess(`${result.url} - ${result.status} ${result.statusText}`);
      } else {
        logError(`${result.url} - ${result.status} ${result.statusText || result.error}`);
      }
    }
    
    // Summary
    const successCount = results.filter(r => r.ok).length;
    const failureCount = results.filter(r => !r.ok).length;
    
    log(`\n${colors.bright}📊 Verification Summary${colors.reset}`);
    logSuccess(`✅ Successful: ${successCount}/${results.length}`);
    
    if (failureCount > 0) {
      logError(`❌ Failed: ${failureCount}/${results.length}`);
      logError('\nFailed URLs:');
      results.filter(r => !r.ok).forEach(result => {
        logError(`  - ${result.url} (${result.status} ${result.statusText || result.error})`);
      });
      process.exit(1);
    } else {
      logSuccess('\n🎉 All assets are accessible! Deployment verification passed.');
    }
    
  } catch (error) {
    logError(`Verification failed: ${error.message}`);
    process.exit(1);
  }
}

// Run verification
verifyDeployment();
