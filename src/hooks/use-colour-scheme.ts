import { useAppSelector } from '../store/reducers/store';

export function useColorScheme() {
  const colorScheme = useAppSelector(state => state.theme.colorScheme);
  const isDark = colorScheme === 'dark';
  return { colorScheme, isDark };
}
