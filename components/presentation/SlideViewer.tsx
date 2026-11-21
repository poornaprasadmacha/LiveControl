'use client';

import React, { useState } from 'react';
import { SlideContent, getSlidesByTitle } from '@/lib/samplePresentation';
import { 
  Sparkles, Brain, Cpu, CheckCircle2, Quote, Award, BookOpen, 
  HelpCircle, ChevronDown, ChevronUp, Image as ImageIcon 
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
      <div className={`w-full h-full min-h-[520px] bg-slate-950 text-slate-400 flex flex-col items-center justify-center p-8 rounded-2xl border border-slate-800 transition-all duration-300 ${className}`}>
        <div className="w-12 h-12 rounded-xl border border-slate-800 flex items-center justify-center mb-3 text-slate-600">
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">Screen Blanked by Host</span>
        <p className="text-[11px] text-slate-600 mt-1">Presentation will resume shortly</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[520px] bg-white dark:bg-brand-darkCard text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-200/90 dark:border-brand-darkBorder p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${className}`}>
      
      {/* Top Slide Meta Bar */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-primary text-white flex items-center justify-center font-bold text-[10px]">
            LC
          </div>
          <span className="text-[11px] font-bold tracking-wider text-slate-600 dark:text-slate-300 uppercase truncate max-w-[170px] sm:max-w-xs">
            {presentationTitle || 'Priority Bible Study'}
          </span>
        </div>

        {slide.badge && (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
            {slide.badge}
          </span>
        )}
      </div>

      {/* Main Slide Content Area */}
      <div className="my-auto py-3 z-10 flex flex-col justify-start overflow-y-auto max-h-full space-y-3.5 pr-0.5">
        
        {/* Constant Slide 1 (James 4:13-15) Reference Pinned at Top for Slides 2 through 15 */}
        {slide.pinnedScripture && (
          <div className="bg-slate-50/95 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-brand-primary dark:text-slate-200 font-bold text-xs">
                <BookOpen className="w-3.5 h-3.5 text-brand-secondary" />
                <span>{slide.pinnedScripture.ref}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsScriptureCollapsed(!isScriptureCollapsed)}
                className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{isScriptureCollapsed ? 'Expand Text' : 'Compact Text'}</span>
                {isScriptureCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </button>
            </div>

            {!isScriptureCollapsed && (
              <div className="space-y-2 text-[11px] leading-relaxed max-h-40 overflow-y-auto pr-1">
                {slide.pinnedScripture.verses.map((v) => (
                  <div key={v.verseNum} className="space-y-0.5 border-t border-slate-200/60 dark:border-slate-800/80 pt-1.5 first:border-t-0 first:pt-0">
                    <p className="text-slate-900 dark:text-slate-100 font-medium">
                      <strong className="text-brand-primary dark:text-teal-400 mr-1">{v.verseNum}.</strong>
                      {v.telugu}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 italic">
                      <strong className="text-slate-500 mr-1">{v.verseNum}.</strong>
                      {v.english}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Slide Title & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="text-xs text-brand-secondary dark:text-teal-400 font-semibold">
              {slide.subtitle}
            </p>
          )}
        </div>

        {/* Bilingual Question Card */}
        {(slide.englishText || slide.teluguText) && (
          <div className="bg-slate-50 dark:bg-slate-900/70 p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 space-y-2.5">
            {slide.englishText && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">English</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {slide.englishText}
                </p>
              </div>
            )}

            {slide.teluguText && (
              <div className="space-y-0.5 pt-1.5 border-t border-slate-200/70 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">తెలుగు</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {slide.teluguText}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Expected Answer Card */}
        {slide.expectedAnswer && (
          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Expected Answer</span>
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
              {slide.expectedAnswer}
            </p>
          </div>
        )}

        {/* Image Display */}
        {slide.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 max-h-56 sm:max-h-64 flex items-center justify-center">
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              loading="lazy"
              className="w-full h-full object-cover max-h-56 sm:max-h-64"
            />
          </div>
        )}

        {/* Content Paragraphs / Verses */}
        {slide.content && (
          <div className="space-y-2">
            {Array.isArray(slide.content) ? (
              slide.content.map((item, idx) => (
                <div 
                  key={idx} 
                  className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50/80 dark:bg-slate-900/60 p-3 sm:p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50/80 dark:bg-slate-900/60 p-3 sm:p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                {slide.content}
              </div>
            )}
          </div>
        )}

        {/* Two-Column Stacked Cards */}
        {slide.type === 'two-column' && (
          <div className="space-y-2.5 pt-1">
            {slide.leftColumn && (
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                <h3 className="text-xs font-bold text-brand-primary dark:text-slate-200 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-brand-primary dark:text-teal-400" />
                  <span>{slide.leftColumn.title}</span>
                </h3>
                <ul className="space-y-1 pl-1">
                  {slide.leftColumn.items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary dark:bg-teal-400 shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {slide.rightColumn && (
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                <h3 className="text-xs font-bold text-brand-secondary dark:text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-brand-secondary dark:text-teal-400" />
                  <span>{slide.rightColumn.title}</span>
                </h3>
                <ul className="space-y-1 pl-1">
                  {slide.rightColumn.items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary dark:bg-teal-400 shrink-0 mt-1.5" />
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
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 z-10 shrink-0 space-y-1.5">
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-brand-primary dark:bg-teal-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span>Slide {slideIndex + 1} of {totalSlides}</span>
          <span className="font-mono">{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
};
