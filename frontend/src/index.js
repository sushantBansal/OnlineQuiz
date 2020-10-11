import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, state, persistStore } from "./store";
import { IntlProvider } from 'react-intl';
import { LOCALES } from './i18n/locale';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/hi_IN';
import EN from './i18n/messges/en-us.json';
import HI from './i18n/messges/hi-in.json';
import locale from './reducers/locale';
import * as localforage from "localforage";
const persistor = persistStore(store);
const message = {
  [LOCALES.ENGLISH]: EN,
  [LOCALES.HINDI]: HI
}




ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={<h1>Loading...</h1>}
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </Provider>

  </React.StrictMode >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
