import React, { useMemo } from 'react';
import { GeneratedGlyph } from '../types';

interface TextPreviewProps {
  text: string;
  glyphs: GeneratedGlyph[];
}

export const TextPreview: React.FC<TextPreviewProps> = ({ text, glyphs }) => {
  const glyphMap = useMemo(() => {
    const map = new Map<string, GeneratedGlyph>();
    glyphs.forEach(g => map.set(g.char, g));
    return map;
  }, [glyphs]);

  // Font metrics assumptions matching the generator
  const lineHeight = 1200; // 1000 units em + gap
  const margin = 100;
  const baselineY = 800; 
  
  let cursorX = margin;
  let cursorY = baselineY + margin; 
  let maxWidth = 0;

  const renderedPaths: React.ReactNode[] = [];

  // Iterate over text to build SVG paths
  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '\n') {
      maxWidth = Math.max(maxWidth, cursorX);
      cursorX = margin;
      cursorY += lineHeight;
      continue;
    }

    let glyph = glyphMap.get(char);
    
    // Fallback for space if 'Space' or 'space' key exists but char is ' '
    if (char === ' ' && !glyph) {
        glyph = glyphMap.get('Space') || glyphMap.get('space');
    }

    if (glyph) {
      renderedPaths.push(
        <g key={`${i}-${char}`} transform={`translate(${cursorX}, ${cursorY}) scale(1, -1)`}>
           <path d={glyph.path} />
        </g>
      );
      cursorX += (glyph.width || 600);
    } else if (char === ' ') {
       // If space glyph missing entirely from map, add default spacing
       cursorX += 300;
    } else {
      // Placeholder for missing glyphs
      cursorX += 400;
      renderedPaths.push(
        <g key={`${i}-missing`} transform={`translate(${cursorX - 400}, ${cursorY}) scale(1, -1)`}>
           <rect x="50" y="0" width="300" height="700" stroke="currentColor" strokeWidth="20" fill="none" opacity="0.2" rx="50" />
        </g>
      );
    }
  }
  
  maxWidth = Math.max(maxWidth, cursorX);
  const totalHeight = cursorY + 400; // Add bottom padding (descender area)

  return (
    <div className="w-full overflow-hidden bg-slate-900/50 rounded-xl border border-slate-800 p-6 min-h-[160px] flex items-center justify-center relative">
       <div className="absolute top-3 right-3 text-xs text-slate-600 font-mono uppercase tracking-widest">Preview</div>
       {text.length === 0 ? (
         <span className="text-slate-600 italic">Type below to preview...</span>
       ) : (
         <div className="w-full overflow-x-auto custom-scrollbar">
            <svg 
                viewBox={`0 0 ${maxWidth + margin} ${totalHeight}`}
                className="h-auto max-h-[250px] min-w-full w-auto text-indigo-400 fill-current"
                preserveAspectRatio="xMinYMid meet"
            >
                {renderedPaths}
            </svg>
         </div>
       )}
    </div>
  );
};
