import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface Product {
  id: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
}

interface ProductsState {
  items: Product[];
  cart: Product[];
  filteredItems: Product[];
  searchTerm: string;
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

    addProductToCatalog: (state, action: PayloadAction<Omit<Product, "id">>) => {
      const newProduct: Product = { id: uuidv4(), ...action.payload };
      state.items.push(newProduct);
      state.filteredItems = filterItems(state.items, state.searchTerm);
      localStorage.setItem("products", JSON.stringify(state.items));
    },

    addProductAndAddToCart: (state, action: PayloadAction<Omit<Product, "id">>) => {
      const newProduct: Product = { id: uuidv4(), ...action.payload };
      console.log('new', newProduct)
      state.items.push(newProduct);
      console.log("CART:", state.cart);

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

export const {
  setSearchTerm,
  addProductToCatalog,
  addProductAndAddToCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  deleteProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
