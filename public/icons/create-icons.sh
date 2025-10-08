#!/bin/bash
# Create simple SVG placeholder icons

# 16x16
cat > icon16.svg << 'ICON'
<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" fill="#4f46e5" rx="3"/>
  <text x="8" y="12" font-family="Arial" font-size="10" fill="white" text-anchor="middle" font-weight="bold">W</text>
</svg>
ICON

# 48x48
cat > icon48.svg << 'ICON'
<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" fill="#4f46e5" rx="8"/>
  <text x="24" y="32" font-family="Arial" font-size="28" fill="white" text-anchor="middle" font-weight="bold">W</text>
</svg>
ICON

# 128x128
cat > icon128.svg << 'ICON'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#4f46e5" rx="16"/>
  <text x="64" y="88" font-family="Arial" font-size="72" fill="white" text-anchor="middle" font-weight="bold">W</text>
</svg>
ICON

echo "SVG icons created"
