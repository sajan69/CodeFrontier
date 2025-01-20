import { useState, useEffect, useCallback } from 'react';

export function useVirtualized(items, options = {}) {
  const {
    itemHeight = 50,
    overscan = 3,
    windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800,
  } = options;

  const [visibleItems, setVisibleItems] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);

  const updateVisibleItems = useCallback(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + windowHeight) / itemHeight) + overscan
    );

    setVisibleItems(items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      virtualIndex: startIndex + index,
      offsetY: (startIndex + index) * itemHeight,
    })));
  }, [items, itemHeight, overscan, scrollTop, windowHeight]);

  useEffect(() => {
    updateVisibleItems();
  }, [updateVisibleItems]);

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    handleScroll,
  };
} 