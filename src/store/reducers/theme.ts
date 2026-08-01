import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  colorScheme: 'light' | 'dark';
}

const initialState: ThemeState = {
  colorScheme: 'dark', // default
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setColorScheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.colorScheme = action.payload;
    },
  },
});

export const { setColorScheme } = themeSlice.actions;
export default themeSlice.reducer;
