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
            });
    },
});

export default productSlice.reducer;