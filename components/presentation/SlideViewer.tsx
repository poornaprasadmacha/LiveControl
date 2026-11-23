'use client';

import React, { useState } from 'react';
import { SlideContent, getSlidesByTitle, isWidescreenPresentation } from '@/lib/samplePresentation';
import { 
  Brain, Cpu, CheckCircle2, BookOpen, 
  ChevronDown, ChevronUp
} from 'lucide-react';

interface SlideViewerProps {
  currentSlide: number; // 1-indexed
  isBlank?: boolean;
  className?: string;
  presentationTitle?: string;
  slides?: SlideContent[];
}

interface SlideColorTheme {
  cardBg: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  titleColor: string;
  subtitleColor: string;
  verseBg: string;
  verseBorder: string;
  accentBar: string;
  answerBg: string;
  answerBorder: string;
  answerText: string;
}

// 7 Soft, Eye-Soothing Pastel Themes based on user's reference photo
const SLIDE_THEMES: Record<string, SlideColorTheme> = {
  mint: {
    cardBg: 'bg-[#f4fbf6]',
    borderColor: 'border-[#bbf7d0]',
    badgeBg: 'bg-[#dcfce7]',
    badgeText: 'text-[#166534]',
    titleColor: 'text-[#14532d]',
    subtitleColor: 'text-[#15803d]',
    verseBg: 'bg-white/95',
    verseBorder: 'border-[#bbf7d0]',
    accentBar: 'bg-[#16a34a]',
    answerBg: 'bg-[#dcfce7]',
    answerBorder: 'border-[#86efac]',
    answerText: 'text-[#14532d]',
  },
  sky: {
    cardBg: 'bg-[#f0f9ff]',
    borderColor: 'border-[#bae6fd]',
    badgeBg: 'bg-[#e0f2fe]',
    badgeText: 'text-[#075985]',
    titleColor: 'text-[#0c4a6e]',
    subtitleColor: 'text-[#0284c7]',
    verseBg: 'bg-white/95',
    verseBorder: 'border-[#bae6fd]',
    accentBar: 'bg-[#0284c7]',
    answerBg: 'bg-[#e0f2fe]',
    answerBorder: 'border-[#7dd3fc]',
    answerText: 'text-[#0c4a6e]',
  },
  lavender: {
    cardBg: 'bg-[#faf5ff]',
    borderColor: 'border-[#e9d5ff]',
    badgeBg: 'bg-[#f3e8ff]',
    badgeText: 'text-[#6b21a8]',
    titleColor: 'text-[#581c87]',
    subtitleColor: 'text-[#9333ea]',
    verseBg: 'bg-white/95',
    verseBorder: 'border-[#e9d5ff]',
    accentBar: 'bg-[#9333ea]',
    answerBg: 'bg-[#f3e8ff]',
    answerBorder: 'border-[#d8b4fe]',
    answerText: 'text-[#581c87]',
  },
  amber: {
    cardBg: 'bg-[#fffbeb]',
    borderColor: 'border-[#fed7aa]',
    badgeBg: 'bg-[#fef3c7]',
    badgeText: 'text-[#92400e]',
    titleColor: 'text-[#78350f]',
    subtitleColor: 'text-[#b45309]',
    verseBg: 'bg-white/95',
    verseBorder: 'border-[#fed7aa]',
    accentBar: 'bg-[#d97706]',
    answerBg: 'bg-[#fef3c7]',
    answerBorder: 'border-[#fcd34d]',
    answerText: 'text-[#78350f]',
  },
  indigo: {
    cardBg: 'bg-[#f5f7ff]',
    borderColor: 'border-[#c7d2fe]',
    badgeBg: 'bg-[#e0e7ff]',
    badgeText: 'text-[#3730a3]',
    titleColor: 'text-[#312e81]',
    subtitleColor: 'text-[#4338ca]',
    verseBg: 'bg-white/95',
    verseBorder: 'border-[#c7d2fe]',
    accentBar: 'bg-[#4f46e5]',
    answerBg: 'bg-[#e0e7ff]',
    answerBorder: 'border-[#a5b4fc]',
    answerText: 'text-[#312e81]',
  },
  rose: {
    cardBg: 'bg-[#fff1f2]',
    borderColor: 'border-[#fecdd3]',
    badgeBg: 'bg-[#ffe4e6]',
    badgeText: 'text-[#9f1239]',
    titleColor: 'text-[#881337]',
    subtitleColor: 'text-[#be123c]',
    verseBg: 'bg-white/95',
    verseBorder: 'border-[#fecdd3]',
    accentBar: 'bg-[#e11d48]',
    answerBg: 'bg-[#ffe4e6]',
    answerBorder: 'border-[#fda4af]',
    answerText: 'text-[#881337]',
  },
  teal: {
    cardBg: 'bg-[#f0fdfa]',
    borderColor: 'border-[#99f6e4]',
    badgeBg: 'bg-[#ccfbf1]',
    badgeText: 'text-[#115e59]',
    titleColor: 'text-[#134e4a]',
    subtitleColor: 'text-[#0f766e]',
    verseBg: 'bg-white/95',
    verseBorder: 'border-[#99f6e4]',
    accentBar: 'bg-[#0d9488]',
    answerBg: 'bg-[#ccfbf1]',
    answerBorder: 'border-[#5eead4]',
    answerText: 'text-[#134e4a]',
  },
};

function getThemeForSlide(slideId: number): SlideColorTheme {
  if (slideId >= 1 && slideId <= 3) return SLIDE_THEMES.mint;
  if (slideId >= 4 && slideId <= 9) return SLIDE_THEMES.sky;
  if (slideId >= 10 && slideId <= 14) return SLIDE_THEMES.lavender;
  if (slideId >= 15 && slideId <= 18) return SLIDE_THEMES.amber;
  if (slideId >= 19 && slideId <= 23) return SLIDE_THEMES.indigo;
  if (slideId >= 24 && slideId <= 27) return SLIDE_THEMES.rose;
  return SLIDE_THEMES.teal;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({ 
  currentSlide, 
  isBlank,
  className = '',
  presentationTitle,
  slides: customSlides
}) => {
  const [isScriptureCollapsed, setIsScriptureCollapsed] = useState(false);
  const resolvedSlides = customSlides && customSlides.length > 0 ? customSlides : getSlidesByTitle(presentationTitle);
  const slides = resolvedSlides && resolvedSlides.length > 0 ? resolvedSlides : getSlidesByTitle('Priority Bible Study');
  const totalSlides = Math.max(1, slides.length);
  const safeCurrentSlide = typeof currentSlide === 'number' && !isNaN(currentSlide) ? currentSlide : 1;
  const slideIndex = Math.max(0, Math.min(safeCurrentSlide - 1, totalSlides - 1));
  const slide: SlideContent = slides[slideIndex] || slides[0] || {
    id: 1,
    type: 'text',
    title: presentationTitle || 'Priority Bible Study',
    content: 'Welcome to the presentation.',
  };
  const progressPercent = Math.round(((slideIndex + 1) / totalSlides) * 100);

  const theme = getThemeForSlide(slide.id || 1);

  const isWidescreen = isWidescreenPresentation(presentationTitle, slides);
  const isPureImageSlide = Boolean(slide.imageUrl && !slide.content && !slide.englishText && !slide.teluguText && !slide.expectedAnswer);

  if (isBlank) {
    return (
      <div className={`w-full h-full min-h-[560px] bg-black rounded-3xl transition-all duration-300 ${className}`} />
    );
  }

  // Pure PPT / PDF Widescreen Slide Image Render
  if (isPureImageSlide) {
    return (
      <div className={`w-full h-full ${isWidescreen ? 'sm:aspect-[16/9] bg-white border-slate-200' : `${theme.cardBg} ${theme.borderColor} min-h-[560px]`} border rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 font-sans select-none ${className}`}>
        {/* Full PPT Slide Image */}
        <div className="flex-1 w-full h-full flex items-center justify-center my-auto overflow-hidden">
          <img 
            src={slide.imageUrl} 
            alt={slide.title} 
            loading="eager"
            className="w-full h-full max-h-[82dvh] object-contain rounded-xl select-none"
          />
        </div>

        {/* Minimal Bottom Progress Bar */}
        <div className="pt-2 border-t border-black/5 z-10 shrink-0 space-y-1">
          <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`${theme.accentBar} h-full transition-all duration-300 rounded-full`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Slide {slideIndex + 1} of {totalSlides}</span>
            <span className="font-mono text-slate-700">{progressPercent}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[560px] ${theme.cardBg} ${theme.borderColor} border rounded-3xl p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 font-sans select-none ${className}`}>
      
      {/* 
        Zero Header: 
        No top banner bar or header container. 
        Slide content starts immediately at the top for maximum immersion.
      */}

      {/* Main Slide Content Area (Hidden Scrollbars, Smooth iOS Scrolling) */}
      <div className="my-auto py-2 z-10 flex flex-col justify-start overflow-y-auto max-h-full space-y-4 pr-0.5">
        
        {/* Constant Slide 1 (James 4:13-15) Reference Pinned at Top for Slides 2 through 15 */}
        {slide.pinnedScripture && (
          <div className={`${theme.verseBg} ${theme.verseBorder} border rounded-2xl p-4 space-y-2.5 shrink-0`}>
            <div className="flex items-center justify-between border-b border-black/5 pb-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 text-slate-700" />
                <span>{slide.pinnedScripture.ref}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsScriptureCollapsed(!isScriptureCollapsed)}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold px-2 py-1 rounded-lg bg-black/5 hover:bg-black/10 transition-colors"
              >
                <span>{isScriptureCollapsed ? 'Show Full Text' : 'Hide Text'}</span>
                {isScriptureCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!isScriptureCollapsed && (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {slide.pinnedScripture.verses.map((v) => (
                  <div key={v.verseNum} className="space-y-1 border-t border-black/5 pt-2 first:border-t-0 first:pt-0">
                    <p className="text-slate-900 font-bold text-xs sm:text-sm leading-relaxed">
                      <span className="font-extrabold mr-1.5 text-slate-950">{v.verseNum}.</span>
                      {v.telugu}
                    </p>
                    <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed italic">
                      <span className="mr-1.5 text-slate-500">{v.verseNum}.</span>
                      {v.english}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Slide Title & Subtitle with Extra Size and Inline Badge */}
        <div className="space-y-1.5">
          {slide.badge && (
            <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${theme.badgeBg} ${theme.badgeText} border ${theme.borderColor} mb-1`}>
              {slide.badge}
            </span>
          )}
          <h2 className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${theme.titleColor} leading-tight`}>
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className={`text-sm sm:text-base font-bold ${theme.subtitleColor}`}>
              {slide.subtitle}
            </p>
          )}
        </div>

        {/* Bilingual Question Card with Extra Size */}
        {(slide.englishText || slide.teluguText) && (
          <div className={`${theme.verseBg} ${theme.verseBorder} border p-4 sm:p-5 rounded-2xl space-y-3.5`}>
            {slide.englishText && (
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  English
                </span>
                <p className={`text-base sm:text-lg md:text-xl font-bold ${theme.titleColor} leading-relaxed`}>
                  {slide.englishText}
                </p>
              </div>
            )}

            {slide.teluguText && (
              <div className="space-y-1 pt-2.5 border-t border-black/5">
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

        {/* Answer Card with Extra Size */}
        {slide.expectedAnswer && (
          <div className={`${theme.answerBg} ${theme.answerBorder} border p-4 sm:p-5 rounded-2xl space-y-1.5`}>
            <span className={`text-xs font-extrabold uppercase tracking-wider ${theme.answerText} flex items-center gap-1.5`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Answer</span>
            </span>
            <p className={`text-base sm:text-lg md:text-xl font-bold ${theme.answerText} leading-relaxed`}>
              {slide.expectedAnswer}
            </p>
          </div>
        )}

        {/* Full Image Display for User and Admin (Uncropped with Natural Proportions) */}
        {slide.imageUrl && (
          <div className="w-full rounded-2xl overflow-hidden border border-black/10 bg-black/[0.02] flex items-center justify-center my-2 p-1 transition-all">
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              loading="lazy"
              className={`w-full h-auto ${
                slide.type === 'image' && !slide.content && !slide.englishText
                  ? 'max-h-[64vh] sm:max-h-[70vh]'
                  : 'max-h-[46vh] sm:max-h-[52vh]'
              } object-contain rounded-xl`}
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
                  className={`text-sm sm:text-base md:text-lg font-medium text-slate-800 leading-relaxed ${theme.verseBg} ${theme.verseBorder} border p-4 sm:p-4.5 rounded-2xl`}
                >
                  {item}
                </div>
              ))
            ) : (
              <div className={`text-sm sm:text-base md:text-lg font-medium text-slate-800 leading-relaxed ${theme.verseBg} ${theme.verseBorder} border p-4 sm:p-4.5 rounded-2xl`}>
                {slide.content}
              </div>
            )}
          </div>
        )}

        {/* Two-Column Stacked Cards with Extra Size */}
        {slide.type === 'two-column' && (
          <div className="space-y-3 pt-1">
            {slide.leftColumn && (
              <div className={`${theme.verseBg} ${theme.verseBorder} border p-4 sm:p-5 rounded-2xl space-y-2`}>
                <h3 className={`text-sm sm:text-base font-bold ${theme.titleColor} flex items-center gap-2`}>
                  <Brain className="w-4 h-4" />
                  <span>{slide.leftColumn.title}</span>
                </h3>
                <ul className="space-y-1.5 pl-1">
                  {slide.leftColumn.items.map((item, i) => (
                    <li key={i} className="text-sm sm:text-base text-slate-700 flex items-start gap-2 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {slide.rightColumn && (
              <div className={`${theme.verseBg} ${theme.verseBorder} border p-4 sm:p-5 rounded-2xl space-y-2`}>
                <h3 className={`text-sm sm:text-base font-bold ${theme.subtitleColor} flex items-center gap-2`}>
                  <Cpu className="w-4 h-4" />
                  <span>{slide.rightColumn.title}</span>
                </h3>
                <ul className="space-y-1.5 pl-1">
                  {slide.rightColumn.items.map((item, i) => (
                    <li key={i} className="text-sm sm:text-base text-slate-700 flex items-start gap-2 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide Bottom Bar with iOS Progress Indicator */}
      <div className="pt-3 border-t border-black/5 z-10 shrink-0 space-y-2">
        <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`${theme.accentBar} h-full transition-all duration-300 rounded-full`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 font-bold">
          <span>Slide {slideIndex + 1} of {totalSlides}</span>
          <span className="font-mono text-slate-800">{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
};
