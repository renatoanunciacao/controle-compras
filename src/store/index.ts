import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";

// Carrega o estado do localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("productsState");
    if (!serializedState) return undefined;
    const parsed = JSON.parse(serializedState);

    // Garantir que todas as propriedades existam
    return {
      items: parsed.items || [],
      cart: parsed.cart || [],
      filteredItems: parsed.filteredItems || [],
      searchTerm: parsed.searchTerm || "",
    };
  } catch {
    return undefined;
  }
};

// Salva estado no localStorage
const saveState = (state: any) => {
  try {
    localStorage.setItem("productsState", JSON.stringify(state.products));
  } catch {}
};

const preloadedState = {
  products: loadState() || {
    items: [],
    cart: [],
    filteredItems: [],
    searchTerm: "",
  },
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
