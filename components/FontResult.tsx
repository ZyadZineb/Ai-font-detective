import React from 'react';
import { IdentificationResult } from '../types';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';

interface FontResultProps {
  result: IdentificationResult;
}

export const FontResult: React.FC<FontResultProps> = ({ result }) => {
  return (
    <div className="w-full space-y-6 animate-fade-in">
        
        {/* Main Result Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <div className="bg-indigo-500/20 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Font Analysis</h2>
            </div>

            <div className="prose prose-invert prose-indigo max-w-none leading-relaxed text-slate-300">
                <ReactMarkdown>{result.analysisText}</ReactMarkdown>
            </div>
        </div>

        {/* Download Sources */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Found Sources
            </h3>
            
            {result.sources.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                    {result.sources.map((source, idx) => (
                        <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 p-4 bg-slate-800/30 hover:bg-slate-800 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all group"
                        >
                            <div className="mt-1 p-1.5 bg-slate-900 rounded-lg text-slate-400 group-hover:text-indigo-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-indigo-300 truncate group-hover:text-indigo-200">{source.title}</h4>
                                <p className="text-xs text-slate-500 truncate mt-1">{new URL(source.uri).hostname}</p>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200/80 text-sm">
                    No direct links were automatically found in the search results. Please try searching manually based on the analysis name.
                </div>
            )}
        </div>

    </div>
  );
};
