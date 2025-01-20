import { webVitals } from 'web-vitals';

export const metrics = {
  marks: new Map(),
  measures: new Map(),
};

export function trackMetric(name, value) {
  if (window.performance && window.performance.mark) {
    performance.mark(name);
    metrics.marks.set(name, Date.now());
    
    if (value) {
      performance.measure(name, value);
      metrics.measures.set(name, value);
    }
  }
}

export function reportWebVitals() {
  webVitals.getCLS(metric => console.log('CLS:', metric.value));
  webVitals.getFID(metric => console.log('FID:', metric.value));
  webVitals.getLCP(metric => console.log('LCP:', metric.value));
  webVitals.getFCP(metric => console.log('FCP:', metric.value));
  webVitals.getTTFB(metric => console.log('TTFB:', metric.value));
} 