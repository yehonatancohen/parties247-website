import React from 'react';

const JungleDecorations: React.FC = () => {
  return (
    <>
      {/* Top-left hanging vines */}
      <img
        src="https://pngimg.com/uploads/jungle/jungle_PNG33.png"
        alt=""
        aria-hidden="true"
        className="hidden lg:block fixed top-0 left-0 w-1/4 max-w-xs -translate-x-1/4 -translate-y-1/3 pointer-events-none z-0 opacity-50"
      />
      {/* Bottom-right Tiger */}
      <img
        src="https://static.vecteezy.com/system/resources/previews/024/705/112/original/tiger-face-clipart-transparent-background-free-png.png"
        alt=""
        aria-hidden="true"
        className="hidden md:block fixed bottom-0 right-0 w-1/5 max-w-[200px] translate-x-1/4 translate-y-1/4 pointer-events-none z-0 opacity-60"
      />
      {/* Bottom-left Monstera leaves */}
      <img
        src="https://purepng.com/public/uploads/large/purepng.com-monstera-leafmonstera-deliciosaplant-leaf-green-evergreen-981524673295ulv5c.png"
        alt=""
        aria-hidden="true"
        className="hidden sm:block fixed bottom-0 left-0 w-1/6 max-w-[250px] -translate-x-1/3 translate-y-1/4 transform -scale-x-100 pointer-events-none z-0 opacity-40"
      />
    </>
  );
};

export default JungleDecorations;