import { useEffect, useState } from 'react';
import type { ImageData } from '../types/imageData';
import style from './FlipImage.module.scss';
import Button from './Button';
//import { GoChevronDown, GoChevronUp, GoChevronLeft, GoChevronRight } from 'react-icons/go';

function FlipImage({ image }: { image?: ImageData | undefined }) {

  const [flipItem, setFlipItem] = useState<{
    index: number;
    dir: string;
  } | undefined>();
  const width = 250;
  const height = 250;

  const handleFlip = (i: number, direction: string) => {
    setFlipItem({ index: i, dir: direction });

  };
  
  useEffect(() => {
    setTimeout(() => setFlipItem(undefined), 800);
  },[flipItem]);

  if (!image) {
    return <div>Select an image!</div>;
  }
  const imageAs2x2 = Array(4).fill({
    src: `${image.urls.raw}&fit=crop&w=${width}&h=${height}`,
    alt: image.alt_description
  });


  const matrix2x2 = imageAs2x2.map(({ src, alt }, i) => {
    let flipDir = '';
    let flipDirBack = 'leftFlipBack';
    let mirror = 'imageMirrorX';
    if (flipItem) {
      const { index, dir } = flipItem;
      if (index == i) {
        flipDir = `${dir}Flip`;
        flipDirBack = `${dir}FlipBack`;
        if (dir === 'left' || dir === 'right') {
          mirror = 'imageMirrorX';
        } else {
          mirror = 'imageMirrorY'
        }
      }
    }
    return (
      <div key={i} className={style.flipTools}>
        <div className={
          `${style.flipBox}`
        }>
          <div className={
            `${style.flipBoxInner} ${flipDir && style[flipDir]}`
          }>

            <div className={style.flipBoxFront}>
              {image && <img className={style.imgShow}
                src={src}
                alt={alt} /> || <p>Flipper</p>}
            </div>

            <div className={
              `${style.flipBoxBack} ${flipDirBack && style[flipDirBack]}`
            }>

              {image && <img className={
                `${style.imgShow} ${mirror && style[mirror]}`
              }
                src={src}
                alt={alt} /> || <p>Amazing</p>}
            </div>
          </div>
        </div>
        <div className={style.buttons}>
          <Button onClick={() => handleFlip(i, 'down')} className={style.button} >v</Button>
          <Button onClick={() => handleFlip(i, 'up')} className={style.button} >^</Button>
          <Button onClick={() => handleFlip(i, 'left')} className={style.button} >&lt;</Button>
          <Button onClick={() => handleFlip(i, 'right')} className={style.button} >&gt;</Button>
          {/* <GoChevronDown onClick={() => handleFlip(i, 'down')} className={style.button} />
          <GoChevronUp onClick={() => handleFlip(i, 'up')} className={style.button} />
          <GoChevronLeft onClick={() => handleFlip(i, 'left')} className={style.button} />
          <GoChevronRight onClick={() => handleFlip(i, 'right')} className={style.button} /> */}
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className={style.flipImage}>
        {matrix2x2}
      </div>
      <div>
        <div>Image description: {image && image.alt_description || 'Flip an Image'}</div>
      </div>
    </div>
  )
}

export default FlipImage;