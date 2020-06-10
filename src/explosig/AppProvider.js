import React from 'react'
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import rootReducer from './utils/reducer';

const store = configureStore({
  reducer: rootReducer,
});

export default function AppProvider({ children }) {
    return (
        <ReduxProvider store={store}>
            {children}
        </ReduxProvider>
    );
}