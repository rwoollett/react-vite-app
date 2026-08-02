import { Box, Title, Text, Stack, useMantineTheme } from '@mantine/core';
import DateDisplay from './DateDisplay';
import { useColorMap } from '../theme/colorMap';

interface BannerProps {
  title: string;
  desc: string;
}

export function Banner({ title, desc }: BannerProps) {
  const theme = useMantineTheme();
  const { bannerOverlay, surfaceBg, surfaceText } = useColorMap();

  return (
    <Box
      pos="relative"
      w="100%"
      h={250}               // FIXED HEIGHT (mobile + desktop)
      style={{
        backgroundImage: `
          linear-gradient(${bannerOverlay}),
          url(/styles/coastalDream.jpg)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'left center',   // crop from left side
        borderRadius: theme.radius.md,
        overflow: 'hidden',
      }}
      px="md"
    >
      <Stack
        pos="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        justify="center"
        align="flex-start"
        px="lg"
        style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }}
      >
        <Title
          order={1}
          size="2rem"
          c="white"
          style={{ lineHeight: 1.2 }}
        >
          {title}
        </Title>

        <Text
          size="md"
          c="white"
          maw="90%"          // prevents overflow on mobile
        >
          {desc}
        </Text>

        <Box
          bg={surfaceBg}
          c={surfaceText}
          px="sm"
          py={4}
          style={{ borderRadius: 4 }}
        >
          <DateDisplay />
        </Box>
      </Stack>
    </Box>
  );
}

export default Banner;
