import React, { useState } from 'react';
import Image from 'next/image';

interface ImageMagnifierProps {
  imgUrl: string;
}

function ImageMagnifier({ imgUrl }: ImageMagnifierProps) {
  const [isMagnified, setIsMagnified] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setIsMagnified(true);
  };

  const handleMouseLeave = () => {
    setIsMagnified(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMagnified) {
      const target = e.currentTarget;
      const boundingBox = target.getBoundingClientRect();
      const x = e.nativeEvent.clientX - boundingBox.left;
      const y = e.nativeEvent.clientY - boundingBox.top;
      setPosition({ x, y });
    }
  };

  return (
    <div
      className="image-magnifier relative overflow-hidden w-64 h-64"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={imgUrl}
        alt="Magnified"
        width={170}
        height={250}
        Object-cover
        className="w-full"
      />
      {isMagnified && (
        <div
          className="image-magnifier__zoomed absolute"
          style={{
            backgroundImage: `url(${imgUrl})`,
            backgroundPosition: `-${position.x}px -${position.y}px`,
          }}
        ></div>
      )}
    </div>
  );
}

export default ImageMagnifier;
