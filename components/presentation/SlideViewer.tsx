'use client';

import React from 'react';
import { SAMPLE_SLIDES, SlideContent } from '@/lib/samplePresentation';
import { Sparkles, Brain, Cpu, Database, Lightbulb, CheckCircle2, Quote, Award } from 'lucide-react';

interface SlideViewerProps {
  currentSlide: number; // 1-indexed
  isBlank?: boolean;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({ currentSlide, isBlank }) => {
  const slideIndex = Math.max(1, Math.min(currentSlide, SAMPLE_SLIDES.length)) - 1;
  const slide: SlideContent = SAMPLE_SLIDES[slideIndex];

  if (isBlank) {
    return (
      <div className="w-full h-full min-h-[400px] aspect-[16/9] bg-black text-white flex flex-col items-center justify-center rounded-2xl border border-gray-800 shadow-2xl transition-all duration-300">
        <span className="text-gray-600 text-sm font-medium tracking-widest uppercase">Screen Blanked by Host</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full aspect-[16/9] min-h-[380px] sm:min-h-[480px] bg-gradient-to-br from-white via-blue-50/50 to-sky-100/30 dark:from-brand-darkCard dark:via-brand-darkBg dark:to-brand-darkBorder text-slate-900 dark:text-white rounded-2xl border border-sky-100 dark:border-brand-darkBorder shadow-xl p-6 sm:p-10 md:p-12 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
      
      {/* Decorative top background elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-light/30 dark:bg-brand-secondary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-veryLight/40 dark:bg-brand-primary/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

      {/* Slide Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
            LC
          </div>
          <span className="text-xs font-bold tracking-widest text-brand-primary dark:text-brand-light uppercase">
            LiveControl
          </span>
        </div>

        {slide.badge && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary dark:bg-brand-light/20 dark:text-brand-light border border-brand-primary/20 dark:border-brand-light/30">
            {slide.badge}
          </span>
        )}
      </div>

      {/* Slide Main Content */}
      <div className="my-auto py-4 z-10 flex flex-col justify-center">
        {/* Render Title Slide */}
        {slide.type === 'title' && (
          <div className="text-center space-y-6 max-w-4xl mx-auto py-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-light/50 dark:bg-brand-secondary/20 text-brand-primary dark:text-brand-light font-medium text-sm border border-brand-primary/20">
              <Sparkles className="w-4 h-4 text-brand-secondary animate-pulse" />
              <span>Interactive Presentation Session</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Render Text Slide */}
        {slide.type === 'text' && (
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-sm sm:text-base text-brand-secondary dark:text-brand-light font-medium">
                  {slide.subtitle}
                </p>
              )}
            </div>
            <div className="space-y-4">
              {Array.isArray(slide.content) ? (
                slide.content.map((paragraph, idx) => (
                  <p key={idx} className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed bg-white/60 dark:bg-brand-darkBg/60 p-4 rounded-xl border border-sky-100/80 dark:border-brand-darkBorder">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed bg-white/60 dark:bg-brand-darkBg/60 p-4 rounded-xl border border-sky-100/80 dark:border-brand-darkBorder">
                  {slide.content}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Render Bullet Slide */}
        {slide.type === 'bullet' && (
          <div className="space-y-6 max-w-4xl">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-sm sm:text-base text-brand-secondary dark:text-brand-light font-medium">
                  {slide.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              {Array.isArray(slide.content) &&
                slide.content.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-brand-darkBg/80 border border-sky-100 dark:border-brand-darkBorder shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Render Two Column Slide */}
        {slide.type === 'two-column' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-sm sm:text-base text-brand-secondary dark:text-brand-light font-medium">
                  {slide.subtitle}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slide.leftColumn && (
                <div className="p-5 rounded-xl bg-white/80 dark:bg-brand-darkBg/90 border border-brand-primary/20 dark:border-brand-darkBorder shadow-sm space-y-3">
                  <h3 className="text-lg font-bold text-brand-primary dark:text-brand-light flex items-center gap-2">
                    <Brain className="w-5 h-5 text-brand-primary dark:text-brand-light" />
                    {slide.leftColumn.title}
                  </h3>
                  <ul className="space-y-2">
                    {slide.leftColumn.items.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {slide.rightColumn && (
                <div className="p-5 rounded-xl bg-white/80 dark:bg-brand-darkBg/90 border border-brand-secondary/30 dark:border-brand-darkBorder shadow-sm space-y-3">
                  <h3 className="text-lg font-bold text-brand-secondary dark:text-teal-400 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-brand-secondary dark:text-teal-400" />
                    {slide.rightColumn.title}
                  </h3>
                  <ul className="space-y-2">
                    {slide.rightColumn.items.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Render Section Divider */}
        {slide.type === 'section' && (
          <div className="text-center py-8 space-y-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-brand-primary text-white">
              Section Header
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-lg text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto">
                {slide.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Render Quote Slide */}
        {slide.type === 'quote' && (
          <div className="max-w-3xl mx-auto text-center space-y-6 py-6">
            <Quote className="w-12 h-12 text-brand-secondary mx-auto opacity-75" />
            <blockquote className="text-xl sm:text-2xl font-serif italic text-slate-800 dark:text-slate-100 leading-relaxed">
              "{slide.content}"
            </blockquote>
            {slide.quoteAuthor && (
              <p className="text-sm font-bold text-brand-primary dark:text-brand-light uppercase tracking-widest">
                — {slide.quoteAuthor}
              </p>
            )}
          </div>
        )}

        {/* Render Thank-You Slide */}
        {slide.type === 'thank-you' && (
          <div className="text-center space-y-6 max-w-2xl mx-auto py-6">
            <Award className="w-16 h-16 text-brand-secondary mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {slide.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
              {slide.subtitle}
            </p>
            <div className="pt-4 flex items-center justify-center gap-2">
              <span className="px-4 py-2 rounded-xl bg-brand-primary text-white text-sm font-semibold shadow-md">
                LiveControl Room Active
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Slide Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium border-t border-sky-100 dark:border-brand-darkBorder pt-3 z-10">
        <span>Slide {slideIndex + 1} of {SAMPLE_SLIDES.length}</span>
        <span>Hosted via LiveControl</span>
      </div>
    </div>
  );
};
