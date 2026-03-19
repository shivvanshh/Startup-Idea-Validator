import React, { lazy, Suspense } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

const InteractiveBackground = () => {
  return (
    <div className="fixed inset-0 z-0 spline-bg">
      <Suspense
        fallback={
          <div className="w-full h-full bg-dark-bg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Spline scene="https://prod.spline.design/4qti94KMedxwoWrd/scene.splinecode" />
      </Suspense>
    </div>
  );
};

export default InteractiveBackground;
