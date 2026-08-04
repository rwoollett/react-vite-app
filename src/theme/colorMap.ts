import { useComputedColorScheme, useMantineTheme } from '@mantine/core';

export function useColorMap() {
  const theme = useMantineTheme();
  const computed = useComputedColorScheme();
  const isDark = computed === 'dark';

  return {
    // AppShell backgrounds
    appShellBg: isDark ? theme.colors.dark[4] : theme.white,
    appShellText: isDark ? theme.white : theme.black,

    // Header / Navbar
    headerBg: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
    headerText: isDark ? theme.white : theme.black,

    // Drawer
    drawerBg: isDark ? theme.colors.dark[4] : theme.white,
    drawerHeaderBg: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
    drawerHeaderText: isDark ? theme.white : theme.black,
    drawerCloseColor: isDark ? theme.white : theme.black,
    drawerHoverBg: isDark ? theme.colors.dark[6] : theme.colors.gray[2],

    // Buttons
    buttonText: isDark ? theme.white : theme.black,

    // Banner
    bannerOverlay: isDark
      ? 'rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)'
      : 'rgba(12, 200, 198, 0.45), rgba(212, 204, 198, 0.45)',

    // Generic surfaces
    surfaceBg: isDark ? theme.colors.dark[5] : theme.white,
    surfaceText: isDark ? theme.white : theme.black,

    countdownBg: isDark ? "#2C2E33" : "#F7F7ED",
    countdownItemBg: isDark ? "#3A3C40" : "#E9E3FF",   // purple-ish light
    countdownItemText: isDark ? "#D0BFFF" : "#5A189A", // purple text
  };
}
