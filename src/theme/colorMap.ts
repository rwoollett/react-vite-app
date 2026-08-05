import { useComputedColorScheme, useMantineTheme } from '@mantine/core';

export function useColorMap() {
  const theme = useMantineTheme();
  const computed = useComputedColorScheme();
  const isDark = computed === 'dark';

  const GAME_COLORS_LIGHT: string[] = [
    'rgb(255, 255, 255)', // White for dead cells
    'rgb(0, 0, 0)',       // 1 Black
    'rgb(0, 255, 0)',     // 2 Green  
    'rgb(255, 255, 0)',   // 3 Lemon
    'rgb(255, 82, 4)',    // 3 Orange
    'rgb(201, 208, 181)', // 4 Pear
    'rgb(0, 255, 0)',     // 5 Lime
    'rgb(167, 12, 28)',   // 6 Strawberry
    'rgb(175, 195, 102)', // 7 Grape
    'rgb(255, 136, 5)',   // 8 Manderine
    'rgb(255, 5, 5)'      // 9 Apple
  ];

  const GAME_COLORS_DARK: string[] = [
    'rgb(40, 40, 40)',     // Dark grey instead of white
    'rgb(230, 230, 230)',  // Light grey instead of black
    'rgb(0, 180, 0)',      // Deep green
    'rgb(200, 200, 0)',    // Soft lemon
    'rgb(255, 120, 40)',   // Warm orange
    'rgb(160, 170, 140)',  // Pear muted
    'rgb(0, 200, 0)',      // Lime muted
    'rgb(200, 40, 60)',    // Strawberry deep
    'rgb(150, 170, 90)',   // Grape muted
    'rgb(255, 110, 20)',   // Mandarin warm
    'rgb(220, 40, 40)'     // Apple deep
  ];


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


    GAME_COLORS: isDark ? GAME_COLORS_DARK : GAME_COLORS_LIGHT
  };
}
