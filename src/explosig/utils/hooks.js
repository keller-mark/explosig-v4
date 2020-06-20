import { useRef, useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

/**
 * Custom hook, subscribes to GRID_RESIZE and window resize events.
 * @returns {array} `[width, height, containerRef]` where width and height
 * are numbers and containerRef is a React ref.
 */
export function useColumnSize() {
    const containerRef = useRef();
  
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();
  
    useEffect(() => {
      function onResize() {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        setHeight(containerRect.height);
        setWidth(containerRect.width);
      }
      const onResizeDebounced = debounce(onResize, 100, { trailing: true });
      window.addEventListener('resize', onResizeDebounced);
      onResize();
      return () => {
        window.removeEventListener('resize', onResizeDebounced);
      };
    }, []);
  
    return [width, height, containerRef];
  }