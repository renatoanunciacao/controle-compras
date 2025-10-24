import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";

// Carrega os dados do localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("productsState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch {
    return undefined;
  }
};

// Salva os dados no localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state.products);
    localStorage.setItem("productsState", serializedState);
  } catch {}
};

const preloadedState = {
  products: loadState() || { items: [] },
};

export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
  preloadedState,
});

store.subscribe(() => saveState(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
