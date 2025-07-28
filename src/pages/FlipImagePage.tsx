import React, { useCallback, useState } from 'react'
import SearchBar from '../components/SearchBar'
import searchImages from '../utility/searchImage';
import type { ImageData } from '../types/imageData';
import ImageList from '../components/ImageList';
import FlipImage from '../components/FlipImage';

const HomePage: React.FC = () => {

  const [images, setImages] = useState<ImageData[]>([]);
  const [selected, setSelected] = useState<ImageData | undefined>();

  const handleSubmit = async (term: string): Promise<void> => {
    const result = await searchImages(term);
    //console.log(result);
    setSelected(undefined);
    setImages(result);
  };

  return (
    <>
      <section className='section'>
        <div className="container">
          <FlipImage image={selected} />
        </div>
      </section>
      <section className='section'>
        <div className="container">
          <SearchBar onSubmit={handleSubmit} />
        </div>
      </section>
      <section className='section'>
        <div className="container">
          <ImageList images={images}
            onSelect={
              useCallback(
                (image: ImageData) => setSelected(image),
                []
              )
            } />
        </div>
      </section>
    </>

  )
}

export default HomePage

