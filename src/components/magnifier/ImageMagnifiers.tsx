import React, { useRef, useState } from 'react';
import Image from 'next/image';

interface ImageMagnifierProps {
  imgSrc: string;
  zoom: number;
}

const ImageMagnifier: React.FC<ImageMagnifierProps> = ({ imgSrc, zoom }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [glassStyle, setGlassStyle] = useState<React.CSSProperties>({});
  const glassSize = {
    width: imgRef.current?.width ? imgRef.current.width * zoom : 0,
    height: imgRef.current?.height ? imgRef.current.height * zoom : 0,
  };

  const createMagnifierGlass = () => {
    setGlassStyle({
      backgroundImage: `url('${imgSrc}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${glassSize.width}px ${glassSize.height}px`,
    });
  };

  const moveMagnifier = (e: React.MouseEvent) => {
    e.preventDefault();
    const pos = getCursorPos(e);
    let x = pos.x;
    let y = pos.y;

    x = Math.min(
      glassSize.width / zoom,
      Math.max(imgRef.current?.width! - glassSize.width / zoom, x)
    );
    y = Math.min(
      glassSize.height / zoom,
      Math.max(imgRef.current?.height! - glassSize.height / zoom, y)
    );

    setGlassStyle({
      ...glassStyle,
      left: `${x - glassSize.width / 2}px`,
      top: `${y - glassSize.height / 2}px`,
      backgroundPosition: `-${x * zoom - glassSize.width / 2}px -${
        y * zoom - glassSize.height / 2
      }px`,
    });
  };

  const getCursorPos = (e: React.MouseEvent) => {
    if (!imgRef.current) {
      return { x: 0, y: 0 };
    }

    const a = imgRef.current.getBoundingClientRect();
    const x = e.pageX - a.left - window.pageXOffset;
    const y = e.pageY - a.top - window.pageYOffset;
    return { x, y };
  };

  return (
    <div
      className="img-magnifier-container"
      onMouseEnter={createMagnifierGlass}
      onMouseMove={moveMagnifier}
      onMouseLeave={() => setGlassStyle({})}
    >
      <Image
        ref={imgRef}
        src={imgSrc}
        width={170}
        height={250}
        Object-cover
        alt=""
        className="w-full"
      />
      {Object.keys(glassStyle).length > 0 && (
        <div
          className="img-magnifier-glass"
          style={{
            ...glassStyle,
            width: `${glassSize.width}px`,
            height: `${glassSize.height}px`,
          }}
        ></div>
      )}
    </div>
  );
};

export default ImageMagnifier;
