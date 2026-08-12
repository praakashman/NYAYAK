#!/usr/bin/env python3
import os

filepath = "nyayak/src/app/layout.tsx"
with open(filepath, "r") as f:
    content = f.read()

content = content.replace('import { Geist, Geist_Mono } from "next/font/google";', 'import { Space_Grotesk, Geist_Mono } from "next/font/google";')
content = content.replace('''const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});''', '''const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});''')
content = content.replace('${geistSans.variable} ${geistMono.variable} antialiased', '${spaceGrotesk.variable} ${geistMono.variable} font-sans antialiased')

with open(filepath, "w") as f:
    f.write(content)

# Update globals.css to use Space Grotesk as the main font-sans variable mapping
css_filepath = "nyayak/src/app/globals.css"
with open(css_filepath, "r") as f:
    css_content = f.read()

css_content = css_content.replace('font-family: var(--font-geist-sans), Arial, sans-serif;', 'font-family: var(--font-space-grotesk), "Armin Grotesk", Arial, sans-serif;')

with open(css_filepath, "w") as f:
    f.write(css_content)

print("Updated fonts.")
