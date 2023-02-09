import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import persistStore from "redux-persist/es/persistStore";
import {PersistGate} from "redux-persist/integration/react";

import App from "./App";
import store from "./store";

const persistedStore = persistStore(store);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistedStore}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);
