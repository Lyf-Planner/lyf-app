import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware, push } from "react-router-redux";
import thunkMiddleware from "redux-thunk";

import { userStateReducer } from "../reducers/userState";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    maps: mapsReducer,
    userState: userStateReducer,
    offlineEvseForm: offlineEvseFormReducer,
    locationOCPIInfoForm: locationOCPIInfoFormReducer,
    tenancyStyling: tenantThemeReducer,
    devicePresets: devicePresetFormReducer,
    updateMetadata: updateMetadataFormReducer,
    adminSignupAuth: adminSignupAuthReducer,
  })
);

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));

export var store = createStore(persistedReducer, {}, composedEnhancer);
export var persistor = persistStore(store);
