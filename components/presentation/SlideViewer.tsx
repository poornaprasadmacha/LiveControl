'use client';

import React, { useState } from 'react';
import { SlideContent, getSlidesByTitle } from '@/lib/samplePresentation';
import { 
  Sparkles, Brain, Cpu, CheckCircle2, Award, BookOpen, 
  ChevronDown, ChevronUp
} from 'lucide-react';

interface SlideViewerProps {
  currentSlide: number; // 1-indexed
  isBlank?: boolean;
  className?: string;
  presentationTitle?: string;
  slides?: SlideContent[];
}

export const SlideViewer: React.FC<SlideViewerProps> = ({ 
  currentSlide, 
  isBlank,
  className = '',
  presentationTitle,
  slides: customSlides
}) => {
  const [isScriptureCollapsed, setIsScriptureCollapsed] = useState(false);
  const slides = customSlides || getSlidesByTitle(presentationTitle);
  const totalSlides = slides.length;
  const slideIndex = Math.max(1, Math.min(currentSlide, totalSlides)) - 1;
  const slide: SlideContent = slides[slideIndex] || slides[0];
  const progressPercent = Math.round(((slideIndex + 1) / totalSlides) * 100);

  if (isBlank) {
    return (
      <div className={`w-full h-full min-h-[560px] bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-800 transition-all duration-300 ${className}`}>
        <div className="w-14 h-14 rounded-2xl border border-slate-700 bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <BookOpen className="w-7 h-7" />
        </div>
        <span className="text-sm font-bold tracking-widest uppercase text-slate-300">Screen Blanked by Host</span>
        <p className="text-xs text-slate-400 mt-2 font-medium">Presentation will resume shortly</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[560px] bg-white text-slate-900 rounded-2xl border border-slate-200 p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 font-sans ${className}`}>
      
      {/* Top Slide Meta Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
            LC
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide text-slate-700 uppercase truncate max-w-[200px] sm:max-w-xs">
            {presentationTitle || 'Priority Bible Study'}
          </span>
        </div>

        {slide.badge && (
          <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
            {slide.badge}
          </span>
        )}
      </div>

      {/* Main Slide Content Area */}
      <div className="my-auto py-3.5 z-10 flex flex-col justify-start overflow-y-auto max-h-full space-y-4 pr-1">
        
        {/* Constant Slide 1 (James 4:13-15) Reference Pinned at Top for Slides 2 through 15 */}
        {slide.pinnedScripture && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 sm:p-4 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>{slide.pinnedScripture.ref}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsScriptureCollapsed(!isScriptureCollapsed)}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold px-2 py-1 rounded-md hover:bg-slate-200/70 transition-colors"
              >
                <span>{isScriptureCollapsed ? 'Show Full Text' : 'Hide Text'}</span>
                {isScriptureCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!isScriptureCollapsed && (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {slide.pinnedScripture.verses.map((v) => (
                  <div key={v.verseNum} className="space-y-1 border-t border-slate-200/60 pt-2 first:border-t-0 first:pt-0">
                    <p className="text-slate-900 font-bold text-xs sm:text-sm leading-relaxed">
                      <span className="text-blue-900 mr-1.5 font-extrabold">{v.verseNum}.</span>
                      {v.telugu}
                    </p>
                    <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed italic">
                      <span className="text-slate-500 mr-1.5">{v.verseNum}.</span>
                      {v.english}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Slide Title & Subtitle */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="text-sm sm:text-base text-emerald-800 font-bold">
              {slide.subtitle}
            </p>
          )}
        </div>

        {/* Bilingual Question Card with Extra Size */}
        {(slide.englishText || slide.teluguText) && (
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
            {slide.englishText && (
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  English
                </span>
                <p className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                  {slide.englishText}
                </p>
              </div>
            )}

            {slide.teluguText && (
              <div className="space-y-1 pt-2.5 border-t border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  తెలుగు
                </span>
                <p className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                  {slide.teluguText}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Expected Answer Card with Extra Size */}
        {slide.expectedAnswer && (
          <div className="p-4 sm:p-5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Expected Answer</span>
            </span>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 leading-relaxed">
              {slide.expectedAnswer}
            </p>
          </div>
        )}

        {/* Image Display */}
        {slide.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-60 sm:max-h-72 flex items-center justify-center">
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              loading="lazy"
              className="w-full h-full object-cover max-h-60 sm:max-h-72"
            />
          </div>
        )}

        {/* Content Paragraphs / Verses with Extra Size */}
        {slide.content && (
          <div className="space-y-2.5">
            {Array.isArray(slide.content) ? (
              slide.content.map((item, idx) => (
                <div 
                  key={idx} 
                  className="text-sm sm:text-base md:text-lg font-medium text-slate-800 leading-relaxed bg-slate-50 p-4 sm:p-4.5 rounded-xl border border-slate-200"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="text-sm sm:text-base md:text-lg font-medium text-slate-800 leading-relaxed bg-slate-50 p-4 sm:p-4.5 rounded-xl border border-slate-200">
                {slide.content}
              </div>
            )}
          </div>
        )}

        {/* Two-Column Stacked Cards with Extra Size */}
        {slide.type === 'two-column' && (
          <div className="space-y-3 pt-1">
            {slide.leftColumn && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-blue-900 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-800" />
                  <span>{slide.leftColumn.title}</span>
                </h3>
                <ul className="space-y-1.5 pl-1">
                  {slide.leftColumn.items.map((item, i) => (
                    <li key={i} className="text-sm sm:text-base text-slate-700 flex items-start gap-2 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-blue-900 shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {slide.rightColumn && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-emerald-800 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-700" />
                  <span>{slide.rightColumn.title}</span>
                </h3>
                <ul className="space-y-1.5 pl-1">
                  {slide.rightColumn.items.map((item, i) => (
                    <li key={i} className="text-sm sm:text-base text-slate-700 flex items-start gap-2 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide Bottom Bar with Progress */}
      <div className="pt-3 border-t border-slate-100 z-10 shrink-0 space-y-2">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-900 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-bold">
          <span>Slide {slideIndex + 1} of {totalSlides}</span>
          <span className="font-mono text-blue-900">{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
};
