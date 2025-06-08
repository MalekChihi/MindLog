// hooks/useBlueLightExposure.ts

import { useState, useEffect } from 'react';

const useBlueLightExposure = () => {
  const [exposureLevel, setExposureLevel] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    // Example: Automatically reduce blue light exposure in the evening
    const hour = new Date().getHours();
    if (hour >= 20 || hour <= 6) {
      setExposureLevel('low');
    } else {
      setExposureLevel('high');
    }
  }, []);

  return {
    exposureLevel,
    reduceExposure: () => setExposureLevel('low'),
    increaseExposure: () => setExposureLevel('high'),
  };
};

export default useBlueLightExposure;
