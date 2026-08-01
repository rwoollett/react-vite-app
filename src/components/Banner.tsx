import { Box, Title, Text, Stack, useMantineTheme } from '@mantine/core';
import DateDisplay from './DateDisplay';
import { useAppSelector } from '../store/reducers/store'

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
      style={{
        backgroundImage: `
          linear-gradient(${overlay}),
          url(/styles/coastalDream.jpg)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      py="8vh"
      px="md"
      c={isDark ? theme.white : theme.black}
    >
      <Stack gap="xs">
        <Title order={1} size="3rem" c="white">
          {title}
        </Title>

        <Text size="lg" c="white">
          {desc}
        </Text>

        <Box
          bg={isDark ? theme.colors.dark[4] : 'white'}
          c={isDark ? theme.white : theme.black}
          px="sm"
          py={4}
          w="fit-content"
          style={{ borderRadius: 4 }}
        >
          <DateDisplay />
        </Box>
      </Stack>
    </Box>
  );
}

export default Banner;
