import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import RootComponent from './RootComponent'
import { persistor, store } from './store/reducers/store'
import { ipApi } from './store/api/ipApi'

const App: React.FC = () => {
  useEffect(() => {
    store.dispatch(ipApi.endpoints.geolocation.initiate());

  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootComponent />
      </PersistGate>
    </Provider>
  )
}

export default App
