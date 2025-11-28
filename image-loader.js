'use client';
 
export default function myImageLoader({ src, width, quality }) {
  if (src.startsWith('https://images.unsplash.com')) {
    return src;
  }
  return `https://jurikiin.com/pitchline/${src}?w=${width}&q=${quality || 75}`
}
