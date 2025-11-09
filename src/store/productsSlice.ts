import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface Product {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  weight?: number;
  weightUnit?: "g" | "kg";
  pricePerKilo?: number;
}

interface ProductsState {
  items: Product[];
  cart: Product[];
  filteredItems: Product[];
  searchTerm: string;
  categories: string[];
}

const PREDEFINED_CATEGORIES = ["Produto com Peso"];

function loadCategories(): string[] {
  try {
    const stored = localStorage.getItem("customCategories");

    if (stored) {
      const custom = JSON.parse(stored);
      const merged = [...PREDEFINED_CATEGORIES, ...custom];
      const result = [...new Set(merged)];
      return result;
    }
  } catch (e) {
    console.error("❌ Erro ao carregar categorias:", e);
  }

  return [...PREDEFINED_CATEGORIES];
}

// Função segura para carregar arrays do localStorage
function loadFromLocalStorage(key: string): Product[] {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const initialState: ProductsState = {
  items: loadFromLocalStorage("products"),
  cart: loadFromLocalStorage("cart"),
  filteredItems: [],
  searchTerm: "",
  categories: loadCategories(),
};

// Função auxiliar para filtrar itens
const filterItems = (items: Product[], searchTerm: string) =>
  items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredItems = filterItems(state.items, state.searchTerm);
    },

    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
        const customOnly = state.categories.filter(
          (c) => !PREDEFINED_CATEGORIES.includes(c)
        );
        localStorage.setItem("customCategories", JSON.stringify(customOnly));
      }
    },

    addProductToCatalog: (state, action: PayloadAction<Omit<Product, "id">>) => {
      const newProduct: Product = { id: uuidv4(), ...action.payload };
      state.items.push(newProduct);
      state.filteredItems = filterItems(state.items, state.searchTerm);
      localStorage.setItem("products", JSON.stringify(state.items));
    },

    addProductAndAddToCart: (state, action: PayloadAction<Omit<Product, "id">>) => {
      const newProduct: Product = { id: uuidv4(), ...action.payload };

      if (newProduct.category && !state.categories.includes(newProduct.category)) {
        state.categories.push(newProduct.category);
        const customOnly = state.categories.filter(
          (c) => !PREDEFINED_CATEGORIES.includes(c)
        );
        localStorage.setItem("customCategories", JSON.stringify(customOnly));
      }

      state.items.push(newProduct);
      state.cart.push(newProduct);
      state.filteredItems = filterItems(state.items, state.searchTerm);
      localStorage.setItem("products", JSON.stringify(state.items));
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    addToCart: (state, action: PayloadAction<string>) => {
      const product = state.items.find((item) => item.id === action.payload);
      if (product) {
        state.cart.push(product);
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    updateCartItem: (
      state,
      action: PayloadAction<{ id: string; price?: number; quantity?: number }>
    ) => {
      const item = state.cart.find((p) => p.id === action.payload.id);
      if (item) {
        if (action.payload.price !== undefined) item.price = action.payload.price;
        if (action.payload.quantity !== undefined) item.quantity = action.payload.quantity;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },

    clearCart: (state) => {
      state.cart = [];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    deleteProduct: (state, action: PayloadAction<string>) => {
      // Remove produto do catálogo
      state.items = state.items.filter((p) => p.id !== action.payload);
      // Remove do carrinho se existir
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      localStorage.setItem("products", JSON.stringify(state.items));
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

// Garantir que o estado inicial sempre tenha categorias
if (initialState.categories.length === 0) {
  initialState.categories = [...PREDEFINED_CATEGORIES];
  console.warn("⚠️ Categorias vazias detectadas! Restaurando predefinidas.");
}

export const {
  setSearchTerm,
  addCategory,
  addProductToCatalog,
  addProductAndAddToCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  deleteProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
