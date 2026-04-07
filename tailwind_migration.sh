#!/bin/bash

# Target files
FILES=$(find ./src -type f \( -name "*.tsx" -o -name "*.ts" \))

for file in $FILES; do
  # Colors
  # bg/text/border/etc -primary-[1-9]00 -> nyayak-slate/dark/orange
  
  # Backgrounds
  sed -i 's/bg-primary-[5-9]0/bg-nyayak-snow/g' "$file"
  sed -i 's/bg-primary-100/bg-nyayak-mute/g' "$file"
  sed -i 's/bg-primary-200/bg-nyayak-mute/g' "$file"
  sed -i 's/bg-primary-300/bg-nyayak-slate/g' "$file"
  sed -i 's/bg-primary-400/bg-nyayak-slate/g' "$file"
  sed -i 's/bg-primary-[5-7]00/bg-nyayak-slate/g' "$file"
  sed -i 's/bg-primary-[8-9]00/bg-nyayak-dark/g' "$file"
  
  # Texts
  sed -i 's/text-primary-[5-9]0/text-nyayak-white/g' "$file"
  sed -i 's/text-primary-100/text-nyayak-white/g' "$file"
  sed -i 's/text-primary-200/text-nyayak-mute/g' "$file"
  sed -i 's/text-primary-300/text-nyayak-mute/g' "$file"
  sed -i 's/text-primary-400/text-nyayak-slate/g' "$file"
  sed -i 's/text-primary-[5-7]00/text-nyayak-slate/g' "$file"
  sed -i 's/text-primary-[8-9]00/text-nyayak-dark/g' "$file"

  # Borders
  sed -i 's/border-primary-[5-9]0/border-nyayak-snow/g' "$file"
  sed -i 's/border-primary-100/border-nyayak-mute/g' "$file"
  sed -i 's/border-primary-200/border-nyayak-mute/g' "$file"
  sed -i 's/border-primary-300/border-nyayak-slate/g' "$file"
  sed -i 's/border-primary-400/border-nyayak-slate/g' "$file"
  sed -i 's/border-primary-[5-7]00/border-nyayak-slate/g' "$file"
  sed -i 's/border-primary-[8-9]00/border-nyayak-dark/g' "$file"

  # Accents
  sed -i 's/bg-accent-[0-9]00/bg-nyayak-orange/g' "$file"
  sed -i 's/text-accent-[0-9]00/text-nyayak-orange/g' "$file"
  sed -i 's/border-accent-[0-9]00/border-nyayak-orange/g' "$file"

  # Rings
  sed -i 's/ring-primary-[0-9]00/ring-nyayak-slate/g' "$file"
  sed -i 's/ring-accent-[0-9]00/ring-nyayak-orange/g' "$file"
  
  # Hex color replacements in styles
  sed -i 's/#F5F3F0/#FFFFFF/g' "$file"
  sed -i 's/#D4CBBD/#E5E7EB/g' "$file"
  sed -i 's/#1A1109/#222222/g' "$file"
  
done
