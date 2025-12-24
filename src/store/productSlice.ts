import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('/products');
  if (!response.ok) throw new Error('Error during data loading');
  return (await response.json()) as Product[];
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: number) => {
  await fetch(`/products/${id}`, { method: 'DELETE' });
  return id;
});

export const addProduct = createAsyncThunk('products/addProduct', async (newProduct: Omit<Product, 'id'>) => {
  const response = await fetch('http://localhost:3001/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct),
  });
  if (!response.ok) throw new Error('Failed to add product');
  return (await response.json()) as Product;
});

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (product: Product) => {
    const response = await fetch(`http://localhost:3001/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return (await response.json()) as Product;
  }
);

interface ProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })

      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;