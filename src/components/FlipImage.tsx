import { useEffect, useState } from "react";
import type { ImageData } from "../types/imageData";
import style from "./FlipImage.module.css";
import { Paper, Text, Group, Button, Box, Stack } from "@mantine/core";
import { useColorMap } from "../theme/colorMap";

function FlipImage({ image }: { image?: ImageData }) {
  const [flipItem, setFlipItem] = useState<{ index: number; dir: string }>();
  const { surfaceBg, surfaceText } = useColorMap();

  const width = 250;
  const height = 250;

  const handleFlip = (i: number, direction: string) => {
    setFlipItem({ index: i, dir: direction });
  };

  useEffect(() => {
    if (!flipItem) return;
    const timer = setTimeout(() => setFlipItem(undefined), 800);
    return () => clearTimeout(timer);
  }, [flipItem]);

  if (!image) {
    return (
      <Paper p="lg" radius="md" shadow="sm" bg={surfaceBg} c={surfaceText}>
        <Text>Select an image!</Text>
      </Paper>
    );
  }

  const imageAs2x2 = Array(4).fill({
    src: `${image.urls.raw}&fit=crop&w=${width}&h=${height}`,
    alt: image.alt_description,
  });

  const matrix2x2 = imageAs2x2.map(({ src, alt }, i) => {
    let flipDir = "";
    let flipDirBack = "leftFlipBack";
    let mirror = "imageMirrorX";

    if (flipItem && flipItem.index === i) {
      flipDir = `${flipItem.dir}Flip`;
      flipDirBack = `${flipItem.dir}FlipBack`;
      mirror =
        flipItem.dir === "left" || flipItem.dir === "right"
          ? "imageMirrorX"
          : "imageMirrorY";
    }

    return (
      <Box key={i} className={style.flipTools}>
        <Box className={style.flipBox}>
          <Box className={`${style.flipBoxInner} ${flipDir && style[flipDir]}`}>
            <Box className={style.flipBoxFront}>
              <img className={style.imgShow} src={src} alt={alt} />
            </Box>

            <Box className={`${style.flipBoxBack} ${style[flipDirBack]}`}>
              <img
                className={`${style.imgShow} ${style[mirror]}`}
                src={src}
                alt={alt}
              />
            </Box>
          </Box>
        </Box>

        {/* Flip buttons */}
        <Group justify="center" mt="xs">
          <Button
            size="xs"
            variant="light"
            onClick={() => handleFlip(i, "down")}
          >
            ↓
          </Button>
          <Button
            size="xs"
            variant="light"
            onClick={() => handleFlip(i, "up")}
          >
            ↑
          </Button>
          <Button
            size="xs"
            variant="light"
            onClick={() => handleFlip(i, "left")}
          >
            ←
          </Button>
          <Button
            size="xs"
            variant="light"
            onClick={() => handleFlip(i, "right")}
          >
            →
          </Button>
        </Group>
      </Box>
    );
  });

  return (
    <Stack>
      <Paper p="lg" radius="md" shadow="sm" bg={surfaceBg} c={surfaceText}>
        <div className={style.flipImage}>
          {matrix2x2}
        </div>
      </Paper>

      <Paper p="md" radius="md" shadow="xs" bg={surfaceBg} c={surfaceText}>
        <Text size="sm">
          Image description: {image.alt_description || "Flip an Image"}
        </Text>
      </Paper>
    </Stack>
  );
}

export default FlipImage;
