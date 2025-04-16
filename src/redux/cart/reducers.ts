import type {CaseReducer, PayloadAction} from '@reduxjs/toolkit';
import {CartState} from './initialState';

//  add to cart
export const ProductAddToCartRequestReducer: CaseReducer<
  CartState,
  PayloadAction<undefined>
> = state => {
  state.isProductAddToCartLoading = true;
};

export const ProductAddToCartSuccessReducer: CaseReducer<
  CartState,
  PayloadAction<any>
> = (state: CartState, {payload}) => {
  state.isProductAddToCartLoading = false;
  state.productAddToCartData = payload.productAddToCartData;
};

export const ProductAddToCartFailureReducer: CaseReducer<
  CartState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isProductAddToCartLoading = false;
  state.productAddToCartError = payload;
};

// get cart
export const ProductGetCartRequestReducer: CaseReducer<
  CartState,
  PayloadAction<undefined>
> = state => {
  state.isProductGetCartLoading = true;
};

export const ProductGetCartSuccessReducer: CaseReducer<
  CartState,
  PayloadAction<any>
> = (state: CartState, {payload}) => {
  state.isProductGetCartLoading = false;
  state.productGetCartData = payload?.productGetCartData;
};

export const ProductGetCartFailureReducer: CaseReducer<
  CartState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isProductGetCartLoading = false;
  state.productGetCartError = payload;
};

//  update cart
export const ProductUpdateCartRequestReducer: CaseReducer<
  CartState,
  PayloadAction<undefined>
> = state => {
  state.isProductUpdateCartLoading = true;
};

export const ProductUpdateCartSuccessReducer: CaseReducer<
  CartState,
  PayloadAction<any>
> = (state: CartState, {payload}) => {
  state.isProductUpdateCartLoading = false;
  state.productUpdateCartData = payload.productUpdateCartData;
};

export const ProductUpdateCartFailureReducer: CaseReducer<
  CartState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isProductUpdateCartLoading = false;
  state.productUpdateCartError = payload;
};

//  update cart address
export const updateCartAddressRequestReducer: CaseReducer<
  CartState,
  PayloadAction<undefined>
> = state => {
  state.isUpdateCartAddressLoading = true;
};

export const updateCartAddressSuccessReducer: CaseReducer<
  CartState,
  PayloadAction<any>
> = (state: CartState, {payload}) => {
  state.isUpdateCartAddressLoading = false;
  state.updateCartAddressData = payload.updateCartAddressData;
};

export const updateCartAddressFailureReducer: CaseReducer<
  CartState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isUpdateCartAddressLoading = false;
  state.updateCartAddressError = payload;
};

export const saveLocalCartRequestReducer: CaseReducer<
  CartState,
  PayloadAction<any | Error>
> = (state, action) => {
  const {
    storeId,
    productId,
    quantity,
    price,
    name,
    image,
    productOptionValueIds,
    cartProductItemId,
    cartId,
    productExtraOptions,
    deliveryAddress,
    storeName,
    storeAddress,
    deliveryTime,
  } = action.payload;
  const existingItem = state.items.find(item => item.productId === productId);
  if (existingItem) {
    state.totalPrice -= existingItem.quantity * existingItem.price;
    existingItem.quantity = quantity;
    existingItem.productOptionValueIds = productOptionValueIds;

    if (existingItem.quantity === 0) {
      state.items = state.items.filter(item => item.productId !== productId);
    } else {
      state.totalPrice += existingItem.quantity * existingItem.price;
    }
  } else {
    state.items.push({
      productId,
      quantity,
      price,
      name,
      image,
      productOptionValueIds,
      cartProductItemId,
      cartId,
      productExtraOptions,
      storeId,
      deliveryAddress,
      storeName,
      storeAddress,
      deliveryTime
    });
    state.totalPrice += quantity * price;
  }
  state.totalPrice = Math.max(0, state.totalPrice);
};

export const clearCartRequest: CaseReducer<
  CartState,
  PayloadAction<any | Error>
> = (state, action) => {
  state.items = [];
  state.totalPrice = 0;
};
