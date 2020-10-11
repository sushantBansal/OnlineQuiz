import { createBrowserHistory } from "history";
import * as localforage from "localforage";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const persistConfig = {
    key: "root",
    version: 1,
    storage: localforage,
    blacklist: [],
};

const history = createBrowserHistory();

const logger = createLogger();

const dev = process.env.NODE_ENV === "development";

let middleware = dev ? applyMiddleware(thunk, logger) : applyMiddleware(thunk);

if (dev) {
    middleware = composeWithDevTools(middleware);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, {}, middleware);

const state = store.subscribe(() => {
    return store.getState()
})

export { store, persistStore, state };
