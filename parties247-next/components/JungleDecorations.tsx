import React from 'react';

const JungleDecorations: React.FC = () => {
  return (
    <>
      {/* Top-left hanging vines */}
      <img
        src="https://pngimg.com/uploads/jungle/jungle_PNG33.png"
        alt=""
        aria-hidden="true"
        className="block fixed top-0 left-0 w-1/3 sm:w-1/4 max-w-[180px] sm:max-w-xs -translate-x-1/4 -translate-y-1/3 pointer-events-none z-0 opacity-50"
        loading="lazy"
        decoding="async"
        width="240"
        height="260"
      />
      {/* Bottom-right Tiger */}
      <img
        src="https://static.vecteezy.com/system/resources/previews/055/444/760/non_2x/tiger-pose-in-motion-captured-with-bold-painting-techniques-free-png.png"
        alt=""
        aria-hidden="true"
        className="block fixed bottom-6 sm:bottom-10 right-[-30%] sm:right-[-15%] w-2/3 sm:w-1/2 max-w-[320px] sm:max-w-[500px] pointer-events-none z-0 opacity-70"
        loading="lazy"
        decoding="async"
        width="560"
        height="360"
      />
    </>
  );
};

export default JungleDecorations;