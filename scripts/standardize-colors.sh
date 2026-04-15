#!/bin/bash

# Color Standardization Automation Script
# This script replaces all hardcoded colors with Tailwind design system tokens

# Colors to replace
declare -A color_map=(
    ['#0D9488']='brand-primary'
    ['#0A7A70']='brand-primary-dark'
    ['#086860']='brand-primary-very-dark'
    ['#14B8A6']='brand-primary-light'
    ['#0E2C28']='brand-bg-dark'
    ['#0F2724']='brand-bg-hover'
    ['#E2FAF7']='brand-text-light'
    ['#7ABFB9']='brand-text-muted'
    ['#4A8C85']='brand-text-muted-dark'
    ['#F59E0B']='brand-accent-warning'
    ['#061A18']='brand-bg-darker'
)

# Color patterns to replace in gradients and opacities
declare -A pattern_map=(
    ['from-\[#0D9488\]']='from-brand-primary'
    ['to-\[#0D9488\]']='to-brand-primary'
    ['text-\[#0D9488\]']='text-brand-primary'
    ['bg-\[#0D9488\]']='bg-brand-primary'
    ['border-\[#0D9488\]']='border-brand-primary'
    
    ['from-\[#0E2C28\]']='from-brand-bg-dark'
    ['to-\[#0E2C28\]']='to-brand-bg-dark'
    ['bg-\[#0E2C28\]']='bg-brand-bg-dark'
    
    ['from-\[#0F2724\]']='from-brand-bg-hover'
    ['to-\[#0F2724\]']='to-brand-bg-hover'
    
    ['text-\[#E2FAF7\]']='text-brand-text-light'
    ['text-\[#7ABFB9\]']='text-brand-text-muted'
    
    ['bg-\[#061A18\]']='bg-brand-bg-darker'
    ['from-\[#061A18\]']='from-brand-bg-darker'
)

echo "🎨 Color Standardization Script"
echo "================================="

# Check if file argument provided
if [ -z "$1" ]; then
    echo "Usage: ./standardize-colors.sh <file.jsx> [files...]"
    echo "Example: ./standardize-colors.sh resources/js/Pages/Home.jsx"
    echo "Example: ./standardize-colors.sh resources/js/Pages/**/*.jsx"
    exit 1
fi

# Process each file
for file in "$@"; do
    if [ ! -f "$file" ]; then
        echo "❌ File not found: $file"
        continue
    fi
    
    echo "✅ Processing: $file"
    
    # Create backup
    cp "$file" "$file.bak"
    echo "   📦 Backup created: $file.bak"
    
    # Replace patterns
    for pattern in "${!pattern_map[@]}"; do
        replacement="${pattern_map[$pattern]}"
        # Use sed to replace (handles regex properly)
        sed -i "s/${pattern}/${replacement}/g" "$file"
    done
    
    # Replace basic hex colors (last resort for missed patterns)
    for hex_color in "${!color_map[@]}"; do
        brand_token="${color_map[$hex_color]}"
        # Replace [#XXXXX] with [brand-token]
        sed -i "s/\[${hex_color}\]/[${brand_token}]/g" "$file"
    done
    
    # Now convert [brand-xxx] bracket format to proper token format for common CSS properties
    sed -i 's/text-\[brand-\([^]]*\)\]/text-brand-\1/g' "$file"
    sed -i 's/bg-\[brand-\([^]]*\)\]/bg-brand-\1/g' "$file"
    sed -i 's/border-\[brand-\([^]]*\)\]/border-brand-\1/g' "$file"
    sed -i 's/from-\[brand-\([^]]*\)\]/from-brand-\1/g' "$file"
    sed -i 's/to-\[brand-\([^]]*\)\]/to-brand-\1/g' "$file"
    
    echo "   ✨ Color replacements completed"
done

echo ""
echo "✅ Done! Review changes and test the application."
echo "⚠️  Remember to run: npm run build"
echo ""
echo "To revert changes, run: ./revert-colors.sh"
