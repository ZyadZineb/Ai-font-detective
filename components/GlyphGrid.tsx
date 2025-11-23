import React from 'react';
import { GeneratedGlyph } from '../types';

interface GlyphGridProps {
  glyphs: GeneratedGlyph[];
  fontStyle: string;
}

export const GlyphGrid: React.FC<GlyphGridProps> = ({ glyphs }) => {
  if (!glyphs.length) return null;

  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
      {glyphs.map((g) => (
        <div key={g.char} className="aspect-square flex flex-col items-center justify-center bg-slate-900 rounded-lg border border-slate-800 relative group overflow-hidden">
            {/* We must flip the SVG vertically because font coordinates are Y-up, but SVG is Y-down */}
            <svg 
                viewBox="0 0 1000 1000" 
                className="w-full h-full text-indigo-400 fill-current p-1 transition-transform duration-300 group-hover:scale-110"
            >
                {/* Apply transform to flip coordinate system if needed. 
                    If the AI follows "Font Coordinates", Y is up. 
                    SVG defaults Y down. 
                    So we usually need scale(1, -1) and translate(0, -1000) to map 0..1000 Y-up to 0..1000 Y-down visually? 
                    Actually, typically font design tools show baseline at y=0. 
                    If we want to display it in an SVG where (0,0) is top-left:
                    We want font(0,0) -> svg(0, 1000) approx (bottom-left).
                    So: scale(1, -1) puts Y+ going down. Then we need to move the origin.
                */}
                <g transform="translate(0, 800) scale(1, -1)">
                    <path d={g.path} />
                </g>
            </svg>
            <span className="absolute bottom-1 right-1 text-[10px] text-slate-500 font-mono">{g.char}</span>
        </div>
      ))}
    </div>
  );
};
