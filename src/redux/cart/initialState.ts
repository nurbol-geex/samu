export const CartInitialSate: CartState = {
  // product add cart
  productAddToCartData: {},
  isProductAddToCartLoading: false,
  productAddToCartError: null,

  //products get cart
  productGetCartData: {},
  isProductGetCartLoading: false,
  productGetCartError: null,

  // product update cart
  productUpdateCartData: {},
  isProductUpdateCartLoading: false,
  productUpdateCartError: null,

  //address cart update
  updateCartAddressData: {},
  isUpdateCartAddressLoading: false,
  updateCartAddressError: null,

  // save local cart
  items: [],
  totalPrice: 0,
};
