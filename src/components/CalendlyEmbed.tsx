import { useEffect, useRef } from 'react';

interface CalendlyEmbedProps {
  url: string;
  height?: string;
}

export function CalendlyEmbed({ url, height = '700px' }: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Calendly script if not already loaded
    const scriptId = 'calendly-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }

    // Initialize Calendly inline widget
    if ((window as any).Calendly) {
      (window as any).Calendly.initInlineWidget({
        url: url,
        parentElement: containerRef.current,
      });
    } else {
      // Wait for script to load
      const checkCalendly = setInterval(() => {
        if ((window as any).Calendly) {
          (window as any).Calendly.initInlineWidget({
            url: url,
            parentElement: containerRef.current,
          });
          clearInterval(checkCalendly);
        }
      }, 100);

      return () => clearInterval(checkCalendly);
    }
  }, [url]);

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget"
      style={{ minWidth: '320px', height }}
    />
  );
}

