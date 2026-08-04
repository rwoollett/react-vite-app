import React, { useEffect } from 'react'
import { WebSocketProvider } from "./context/websocket";
import RootComponent from './RootComponent'
import { store } from './store/reducers/store'
import { ipApi } from './store/api/ipApi';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const theme = createTheme({
  colors: {
    navy: [
      '#0a1a2f', // 0
      '#0d223f', // 1
      '#102a4f', // 2
      '#13335f', // 3
      '#163b6f', // 4
      '#19437f', // 5
      '#1c4b8f', // 6
      '#1f539f', // 7
      '#225caf', // 8
      '#2564bf', // 9
    ],
    gray: [
      '#f8f9fa',
      '#f1f3f5',
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#868e96',
      '#495057',
      '#343a40',
      '#212529',
    ],
    blue: [
      '#e7f0ff',
      '#d0e1ff',
      '#b8d2ff',
      '#9fc3ff',
      '#86b4ff',
      '#6ea5ff',
      '#5596ff',
      '#3d87ff',
      '#2478ff',
      '#0b69ff',
    ],
    purple: [
      '#f3e8ff',
      '#e6d0ff',
      '#d9b8ff',
      '#cc9fff',
      '#bf86ff',
      '#b26eff',
      '#a555ff',
      '#983dff',
      '#8b24ff',
      '#7e0bff',
    ],
    black: [
      '#f2f2f2',
      '#d9d9d9',
      '#bfbfbf',
      '#a6a6a6',
      '#8c8c8c',
      '#737373',
      '#595959',
      '#404040',
      '#262626',
      '#0d0d0d',
    ],
  }
});

const App: React.FC = () => {

  useEffect(() => {
    store.dispatch(ipApi.endpoints.geolocation.initiate());
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <WebSocketProvider>
        <RootComponent/>
      </WebSocketProvider>
    </MantineProvider>
  )
}

export default App
