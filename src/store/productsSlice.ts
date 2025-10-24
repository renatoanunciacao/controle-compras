import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Product {
    name: string;
    price: number;
    quantity: number;
}
interface ProductsState {
    items: Product[];
}

const initialState: ProductsState = {
  items: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.name !== action.payload);
    },
    clearProducts: (state) => {
      state.items = [];
    },
  },
});

export const { addProduct, removeProduct, clearProducts } = productsSlice.actions;
export default productsSlice.reducer;