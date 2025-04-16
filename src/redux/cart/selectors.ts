import type {RootState} from '../index';
// product cart
export const selectProductAddToCart = (state: RootState) =>
  state.cart.productAddToCartData;

export const selectProductAddToCartIsLoading = (state: RootState) =>
  state.cart.isProductAddToCartLoading;

export const selectProductAddToCartError = (state: RootState) =>
  state.cart.productAddToCartError;

// get product cart
export const selectProductGetCart = (state: RootState) =>
  state.cart.productGetCartData;

export const selectProductGetCartIsLoading = (state: RootState) =>
  state.cart.isProductGetCartLoading;

export const selectProductGetCartError = (state: RootState) =>
  state.cart.productGetCartError;

// save local cart
export const selectCurrentCartItem = (state: RootState) => state.cart.items;
export const selectCartTotalPrice = (state: RootState) => state.cart.totalPrice;

// product update cart
export const selectProductUpdateCart = (state: RootState) =>
  state.cart.productUpdateCartData;

export const selectProductUpdateCartIsLoading = (state: RootState) =>
  state.cart.isProductUpdateCartLoading;

export const selectProductUpdateCartError = (state: RootState) =>
  state.cart.productUpdateCartError;

// update cart address
export const selectUpdateCartAddressData = (state: RootState) =>
  state.cart.updateCartAddressData;

export const selectIsUpdateCartAddressLoading = (state: RootState) =>
  state.cart.isUpdateCartAddressLoading;

export const selectUpdateCartAddressError = (state: RootState) =>
  state.cart.updateCartAddressError;
