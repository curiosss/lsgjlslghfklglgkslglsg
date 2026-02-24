import { useState, useEffect } from 'react';

export function useMediaQuery() {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isXL: false,
  });

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)');
    const mqDesktop = window.matchMedia('(min-width: 1200px)');
    const mqXL = window.matchMedia('(min-width: 1400px)');

    const update = () => {
      setState({
        isMobile: mqMobile.matches,
        isTablet: !mqMobile.matches && !mqDesktop.matches,
        isDesktop: mqDesktop.matches,
        isXL: mqXL.matches,
      });
    };

    update();
    mqMobile.addEventListener('change', update);
    mqDesktop.addEventListener('change', update);
    mqXL.addEventListener('change', update);

    return () => {
      mqMobile.removeEventListener('change', update);
      mqDesktop.removeEventListener('change', update);
      mqXL.removeEventListener('change', update);
    };
  }, []);

  return state;
}
