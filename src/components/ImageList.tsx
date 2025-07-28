import { useEffect, useState } from 'react';
import ImageIcon from './ImageIcon';
import type { ImageData } from '../types/imageData';
import style from './ImageList.module.scss';

function ImageList({ images, onSelect }: {
  images: ImageData[];
  onSelect: (image: ImageData) => void;
}) {
  const [selected, setSelected] = useState<ImageData | undefined>();

  const handleSelect = (image: ImageData) => {
    setSelected(image);
  };

  const renderedImages = images.map((image) => {
    return <ImageIcon onSelect={handleSelect} key={image.id} image={image} />
  });

  useEffect(() => {
    if (selected) {
      onSelect(selected);
    }
  }, [selected, onSelect]);

  return (
    <div
      onWheel={(e) => {
        const strength = Math.abs(e.deltaY);
        if (e.deltaY === 0) return;
        const el = e.currentTarget;
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: strength > 70 ? "auto" : "smooth",
        });
      }
      } className={`${style.imageScrolls}`}>{renderedImages}</div>
  );
}

export default ImageList;
