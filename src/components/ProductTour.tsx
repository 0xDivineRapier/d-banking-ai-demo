import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Sparkles, Play } from 'lucide-react';

export interface TourStep {
  /** CSS selector for the target element to highlight */
  target: string;
  /** Title of the step */
  title: string;
  /** Description text */
  content: string;
  /** Optional: which side to place the tooltip */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  /** Optional: navigate to this route before showing the step */
  route?: string;
  /** Optional: custom action before showing step (e.g. expand sidebar) */
  beforeShow?: () => void | Promise<void>;
}

interface TourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  navigate?: (path: string) => void;
}

const PADDING = 8;
const TOOLTIP_GAP = 16;

function getTargetRect(selector: string): DOMRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  return el.getBoundingClientRect();
}

function calcPlacement(
  targetRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  preferred: TourStep['placement']
): { top: number; left: number; arrow: 'top' | 'bottom' | 'left' | 'right' } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const placements = {
    bottom: {
      top: targetRect.bottom + TOOLTIP_GAP,
      left: Math.max(16, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, vw - tooltipWidth - 16)),
      arrow: 'top' as const,
      fits: targetRect.bottom + TOOLTIP_GAP + tooltipHeight < vh - 16,
    },
    top: {
      top: targetRect.top - TOOLTIP_GAP - tooltipHeight,
      left: Math.max(16, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, vw - tooltipWidth - 16)),
      arrow: 'bottom' as const,
      fits: targetRect.top - TOOLTIP_GAP - tooltipHeight > 16,
    },
    right: {
      top: Math.max(16, Math.min(targetRect.top + targetRect.height / 2 - tooltipHeight / 2, vh - tooltipHeight - 16)),
      left: targetRect.right + TOOLTIP_GAP,
      arrow: 'left' as const,
      fits: targetRect.right + TOOLTIP_GAP + tooltipWidth < vw - 16,
    },
    left: {
      top: Math.max(16, Math.min(targetRect.top + targetRect.height / 2 - tooltipHeight / 2, vh - tooltipHeight - 16)),
      left: targetRect.left - TOOLTIP_GAP - tooltipWidth,
      arrow: 'right' as const,
      fits: targetRect.left - TOOLTIP_GAP - tooltipWidth > 16,
    },
  };

  if (preferred && preferred !== 'auto' && placements[preferred].fits) {
    const p = placements[preferred];
    return { top: p.top, left: p.left, arrow: p.arrow };
  }

  for (const dir of ['bottom', 'right', 'top', 'left'] as const) {
    if (placements[dir].fits) {
      const p = placements[dir];
      return { top: p.top, left: p.left, arrow: p.arrow };
    }
  }

  const fallback = placements.bottom;
  return { top: fallback.top, left: fallback.left, arrow: fallback.arrow };
}

export function ProductTour({ steps, isOpen, onClose, onComplete, navigate }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; arrow: 'top' | 'bottom' | 'left' | 'right' }>({ top: 0, left: 0, arrow: 'top' });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];

  const updatePosition = useCallback(() => {
    if (!step) return;
    const rect = getTargetRect(step.target);
    setTargetRect(rect);

    if (rect && tooltipRef.current) {
      const tw = tooltipRef.current.offsetWidth;
      const th = tooltipRef.current.offsetHeight;
      const pos = calcPlacement(rect, tw, th, step.placement);
      setTooltipPos(pos);
    }
  }, [step]);

  // Navigate and run beforeShow, then position
  useEffect(() => {
    if (!isOpen || !step) return;
    setIsAnimating(true);
    setIsVisible(false);

    const run = async () => {
      if (step.route && navigate) {
        navigate(step.route);
        // Wait for navigation + render
        await new Promise(r => setTimeout(r, 400));
      }
      if (step.beforeShow) {
        await step.beforeShow();
        await new Promise(r => setTimeout(r, 200));
      }

      // Scroll target into view
      const el = document.querySelector(step.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(r => setTimeout(r, 300));
      }

      updatePosition();
      setIsAnimating(false);
      setIsVisible(true);
    };

    run();
  }, [currentStep, isOpen, step]);

  // Reposition on resize/scroll
  useEffect(() => {
    if (!isOpen || !isVisible) return;
    const handler = () => updatePosition();
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [isOpen, isVisible, updatePosition]);

  // Reset on open
  useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSkip = () => {
    onClose();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return createPortal(
    <div className="fixed inset-0 z-[9999]" aria-modal="true" role="dialog">
      {/* Overlay with spotlight cutout via SVG */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && isVisible && (
              <rect
                x={targetRect.left - PADDING}
                y={targetRect.top - PADDING}
                width={targetRect.width + PADDING * 2}
                height={targetRect.height + PADDING * 2}
                rx="12"
                fill="black"
                className="transition-all duration-500 ease-out"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#tour-mask)"
          style={{ pointerEvents: 'auto' }}
          onClick={handleSkip}
        />
      </svg>

      {/* Spotlight ring */}
      {targetRect && isVisible && (
        <div
          className="absolute rounded-xl border-2 border-primary/60 transition-all duration-500 ease-out pointer-events-none"
          style={{
            top: targetRect.top - PADDING,
            left: targetRect.left - PADDING,
            width: targetRect.width + PADDING * 2,
            height: targetRect.height + PADDING * 2,
            boxShadow: '0 0 0 4px hsl(var(--primary) / 0.15), 0 0 30px -5px hsl(var(--primary) / 0.25)',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`absolute z-10 w-[360px] transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          pointerEvents: 'auto',
        }}
      >
        <div className="bg-card rounded-2xl border border-border shadow-2xl shadow-black/20 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <div
              className="h-full dozn-gradient-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg dozn-gradient-accent flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{step?.title}</h3>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-5">
              {step?.content}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip tour
              </button>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-foreground bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <ChevronLeft size={13} />
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-[11px] font-semibold text-primary-foreground dozn-gradient-accent hover:opacity-90 transition-opacity shadow-md"
                >
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < steps.length - 1 && <ChevronRight size={13} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- Tour trigger button ---
export function TourTriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 transition-all"
      title="Take a guided tour"
    >
      <Play size={12} className="fill-primary" />
      <span className="hidden sm:inline">AI Tour</span>
    </button>
  );
}
