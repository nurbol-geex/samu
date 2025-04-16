import {createSlice} from '@reduxjs/toolkit';
import {CartInitialSate} from './initialState';
import {
  ProductAddToCartRequestReducer,
  ProductAddToCartSuccessReducer,
  ProductAddToCartFailureReducer,
  ProductGetCartRequestReducer,
  ProductGetCartSuccessReducer,
  ProductGetCartFailureReducer,
  ProductUpdateCartRequestReducer,
  ProductUpdateCartSuccessReducer,
  ProductUpdateCartFailureReducer,
  updateCartAddressRequestReducer,
  updateCartAddressSuccessReducer,
  updateCartAddressFailureReducer,
  saveLocalCartRequestReducer,
  clearCartRequest,
} from './reducers';
import {CART} from './constants';

export const cartSlice = createSlice({
  name: CART,
  initialState: CartInitialSate,
  reducers: {
    ProductAddToCartRequest: ProductAddToCartRequestReducer,
    ProductAddToCartSuccess: ProductAddToCartSuccessReducer,
    ProductAddToCartFailure: ProductAddToCartFailureReducer,

    ProductUpdateCartRequest: ProductUpdateCartRequestReducer,
    ProductUpdateCartSuccess: ProductUpdateCartSuccessReducer,
    ProductUpdateCartFailure: ProductUpdateCartFailureReducer,

    ProductGetCartRequest: ProductGetCartRequestReducer,
    ProductGetCartSuccess: ProductGetCartSuccessReducer,
    ProductGetCartFailure: ProductGetCartFailureReducer,

    updateCartAddressRequest: updateCartAddressRequestReducer,
    updateCartAddressSuccess: updateCartAddressSuccessReducer,
    updateCartAddressFailure: updateCartAddressFailureReducer,

    saveLocalCartRequest: saveLocalCartRequestReducer,
    clearCart: clearCartRequest,
  },
});

export const {
  ProductAddToCartRequest,
  ProductAddToCartSuccess,
  ProductAddToCartFailure,

  ProductGetCartRequest,
  ProductGetCartSuccess,
  ProductGetCartFailure,

  ProductUpdateCartRequest,
  ProductUpdateCartSuccess,
  ProductUpdateCartFailure,

  updateCartAddressRequest,
  updateCartAddressSuccess,
  updateCartAddressFailure,

  saveLocalCartRequest,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
