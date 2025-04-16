import type {RootState} from '../index';

// get all payment methods
export const selectAllPaymentMethods = (state: RootState) =>
  state.order.getAllPaymentMethodsData;

export const selectAllPaymentMethodsIsLoading = (state: RootState) =>
  state.order.isAllPaymentMethodsLoading;

export const selectAllPaymentMethodsError = (state: RootState) =>
  state.order.getAllPaymentMethodsError;

// setup payment charge methods
export const selectPaymentCharge = (state: RootState) =>
  state.order.paymentChargeData;

export const selectPaymentChargeIsLoading = (state: RootState) =>
  state.order.isPaymentChargeLoading;

export const selectPaymentChargeError = (state: RootState) =>
  state.order.paymentChargeError;

// setup checkout order;
export const selectCheckout = (state: RootState) => state.order.checkoutData;

export const selectCheckoutIsLoading = (state: RootState) =>
  state.order.isCheckoutDataLoading;

export const selectCheckoutError = (state: RootState) =>
  state.order.checkoutDataError;

// add new payment method
export const selectAddNewPaymentMethod = (state: RootState) =>
  state.order.addNewPaymentMethodData;

export const selectAddNewPaymentMethodIsLoading = (state: RootState) =>
  state.order.isAddNewPaymentMethodLoading;

export const selectAddNewPaymentMethodError = (state: RootState) =>
  state.order.addNewPaymentMethodError;

// setup default payment methods
export const selectPaymentDefault = (state: RootState) =>
  state.order.paymentDefaultData;

export const selectPaymentDefaultIsLoading = (state: RootState) =>
  state.order.isPaymentDefaultLoading;

export const selectPaymentDefaultError = (state: RootState) =>
  state.order.paymentDefaultError;

// update payment methods
export const selectUpdatePaymentMethod = (state: RootState) =>
  state.order.upadtePaymentMethodData;

export const selectUpdatePaymentMethodIsLoading = (state: RootState) =>
  state.order.isUpadtePaymentMethodLoading;

export const selectUpdatePaymentMethodError = (state: RootState) =>
  state.order.upadtePaymentMethodError;

// order verified
export const selectOrderVerifiedData = (state: RootState) =>
  state.order.orderVerifiedData;

export const selectOrderVerifiedIsLoading = (state: RootState) =>
  state.order.isOrderVerifiedLoading;

export const selectOrderVerifiedError = (state: RootState) =>
  state.order.orderVerifiedError;

// update payment methods
export const selectGetOrderDetails = (state: RootState) =>
  state.order.getOrderDetailsData;

export const selectGetOrderDetailsIsLoading = (state: RootState) =>
  state.order.isGetOrderDetailsLoading;

export const selectGetOrderDetailsError = (state: RootState) =>
  state.order.getOrderDetailsError;

// get all orders
export const selectGetAllOrders = (state: RootState) =>
  state.order.getAllOrdersData;

export const selectGetAllOrderIsLoading = (state: RootState) =>
  state.order.isGetAllOrdersLoading;

export const selectGetAllOrdersError = (state: RootState) =>
  state.order.getAllOrdersError;

// cancel order methods
export const selectCancelOrder = (state: RootState) =>
  state.order.cancelOrderData;

export const selectCancelOrderIsLoading = (state: RootState) =>
  state.order.isCancelOrderLoading;

export const selectCancelOrderError = (state: RootState) =>
  state.order.cancelOrderError;

export const selectCardDetails = (state: RootState) => state.order.cardDetails;
export const selectOrderId = (state: RootState) => state.order.orderId;
