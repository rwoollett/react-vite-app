import { Box, Title, Text, Stack, useMantineTheme } from '@mantine/core';
import DateDisplay from './DateDisplay';
import { useAppSelector } from '../store/reducers/store';

interface BannerProps {
  title: string;
  desc: string;
}

export function Banner({ title, desc }: BannerProps) {
  const colorScheme = useAppSelector(state => state.theme.colorScheme);
  const theme = useMantineTheme();
  const isDark = colorScheme === 'dark';

  const lightOverlay = 'rgba(12, 200, 198, 0.45), rgba(212, 204, 198, 0.45)';
  const darkOverlay = 'rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)';
  const overlay = isDark ? darkOverlay : lightOverlay;

  return (
    <Box
      pos="relative"
      w="100%"
      h={250}               // FIXED HEIGHT (mobile + desktop)
      style={{
        backgroundImage: `
          linear-gradient(${overlay}),
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
          bg={isDark ? theme.colors.dark[4] : 'white'}
          c={isDark ? theme.white : theme.black}
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
