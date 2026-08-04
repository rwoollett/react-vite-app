import React, { useCallback, useState } from "react";
import { Container, Stack, Paper } from "@mantine/core";
import type { ImageData } from "../types/imageData";
import ImageList from "../components/ImageList";
import FlipImage from "../components/FlipImage";
import { useColorMap } from "../theme/colorMap";
import searchImages from "../utility/searchImage";
import SearchBar from "../components/SearchBar";

const FlipImagePage: React.FC = () => {
  const allowSearch = false;
  const [images, setImages] = useState<ImageData[]>([{
    "id": "w_iTb6LN1Bg",
    "urls": {
      "raw": "https://images.unsplash.com/photo-1623088003997-accbc3d66244?ixid=M3wzOTQ3ODR8MHwxfHNlYXJjaHwyfHwzNTB6fGVufDB8fHx8MTc4NTgyOTgxNXww&ixlib=rb-4.1.0",
    },
    "alt_description": "black porsche 911 on road during daytime",
  }, {
    "id": "V63oM8OPJSo",
    "urls": {
      "raw": "https://images.unsplash.com/photo-1421284621639-884f4129b61d?ixid=M3wzOTQ3ODR8MHwxfHNlYXJjaHw1fHxwYWxtJTIwdHJlZXxlbnwwfHx8fDE3ODU4MzI5Mjl8MA&ixlib=rb-4.1.0",
    },
    "alt_description": "coconut trees under cloudy sky during daytime",
  }, {
    "id": "F_ilCik66Hg",
    "urls": {
      "raw": "https://images.unsplash.com/photo-1515778767554-42d4b373f2b3?ixid=M3wzOTQ3ODR8MHwxfHNlYXJjaHw5fHxncmFwZXN8ZW58MHx8fHwxNzg1ODMyOTkzfDA&ixlib=rb-4.1.0",
    },
    "alt_description": "grapes",
  }]);
  const [selected, setSelected] = useState<ImageData | undefined>();
  const { surfaceBg, surfaceText } = useColorMap();

  const handleSubmit = async (term: string): Promise<void> => {
    const result = await searchImages(term);
    setSelected(undefined);
    setImages(result);
  };
  console.log(JSON.stringify(selected, null, 2));

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Flip Image Section */}
        <Paper p="lg" radius="md" shadow="sm" bg={surfaceBg} c={surfaceText}>
          <FlipImage image={selected} />
        </Paper>

        {/* Search Section */}
        {allowSearch && <Paper p="lg" radius="md" shadow="sm" bg={surfaceBg} c={surfaceText}>
          <SearchBar onSubmit={handleSubmit} />
        </Paper>}

        {/* Image List Section */}
        <Paper p="lg" radius="md" shadow="sm" bg={surfaceBg} c={surfaceText}>
          <ImageList
            images={images}
            onSelect={useCallback((image: ImageData) => setSelected(image), [])}
          />
        </Paper>
      </Stack>
    </Container>
  );
};

export default FlipImagePage;
