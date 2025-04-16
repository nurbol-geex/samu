import type {CaseReducer, PayloadAction} from '@reduxjs/toolkit';
import {OrderState} from './initialState';

// get all payment methods
export const getAllPaymentMethodsRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isAllPaymentMethodsLoading = true;
};

export const getAllPaymentMethodsSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isAllPaymentMethodsLoading = false;
  state.getAllPaymentMethodsData = [
    ...(payload?.getAllPaymentMethodsData ?? []),
  ];
};

export const getAllPaymentMethodsFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isAllPaymentMethodsLoading = false;
  state.getAllPaymentMethodsError = payload;
};

// setup payment charge
export const setupPaymentChargeRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isPaymentChargeLoading = true;
};

export const setupPaymentChargeSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isPaymentChargeLoading = false;
  state.paymentChargeData = payload?.paymentChargeData;
};

export const setupPaymentChargeFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isPaymentChargeLoading = false;
  state.paymentChargeError = payload;
};

// setup checkout order
export const setupCheckoutRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isCheckoutDataLoading = true;
};

export const setupCheckoutSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isCheckoutDataLoading = false;
  state.checkoutData = payload?.checkoutData;
};

export const setupCheckoutFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isCheckoutDataLoading = false;
  state.checkoutDataError = payload;
};

// add new payment method
export const addNewPaymentMethodRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isAddNewPaymentMethodLoading = true;
};

export const addNewPaymentMethodSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isAddNewPaymentMethodLoading = false;
  state.addNewPaymentMethodData = payload?.addNewPaymentMethodData;
};

export const addNewPaymentMethodFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isAddNewPaymentMethodLoading = false;
  state.addNewPaymentMethodError = payload;
};

// setup payment charge
export const setupPaymentDefaultRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isPaymentDefaultLoading = true;
};

export const setupPaymentDefaultSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isPaymentDefaultLoading = false;
  state.paymentDefaultData = payload?.paymentDefaultData;
};

export const setupPaymentDefaultFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isPaymentDefaultLoading = false;
  state.paymentDefaultError = payload;
};

// setup payment charge
export const updatePaymentMethodRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isUpadtePaymentMethodLoading = true;
};

export const updatePaymentMethodSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isUpadtePaymentMethodLoading = false;
  state.upadtePaymentMethodData = payload?.upadtePaymentMethodData;
};

export const updatePaymentMethodFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isUpadtePaymentMethodLoading = false;
  state.upadtePaymentMethodError = payload;
};

// check order is verified

// get order Details
export const orderVerifiedRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isOrderVerifiedLoading = true;
};

export const orderVerifiedSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isOrderVerifiedLoading = false;
  state.orderVerifiedData = payload?.orderVerifiedData;
};

export const orderVerifiedFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isOrderVerifiedLoading = false;
  state.orderVerifiedError = payload;
};

export const clearOrderVerifiedReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, action) => {
  state.orderVerifiedData = {};
  state.orderVerifiedError = null;
};
// get order Details
export const getOrderDetailsRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isGetOrderDetailsLoading = true;
};

export const getOrderDetailsSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isGetOrderDetailsLoading = false;
  state.getOrderDetailsData = payload?.getOrderDetailsData;
};

export const getOrderDetailsFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isGetOrderDetailsLoading = false;
  state.getOrderDetailsError = payload;
};
//get all orders

export const getAllOrdersRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isGetAllOrdersLoading = true;
};

export const getAllOrdersSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isGetAllOrdersLoading = false;
  // if (payload?.getAllOrdersData) {
  state.getAllOrdersData = payload.getAllOrdersData.reverse();
  // }
};

export const getAllOrdersFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isGetAllOrdersLoading = false;
  state.getAllOrdersError = payload;
};
export const clearCheckoutReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, action) => {
  state.checkoutData = {};
  state.checkoutDataError = null;
};
export const clearAddNewCardReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, action) => {
  state.addNewPaymentMethodData = {};
  state.addNewPaymentMethodError = null;
};
export const cardDetailsReducer: CaseReducer<OrderState, PayloadAction<any>> = (
  state: OrderState,
  {payload},
) => {
  const newCardDetails = payload.cardDetails;
  const existingIndex = state.cardDetails.findIndex(
    card => card.cardNumber === newCardDetails.cardNumber,
  );

  if (existingIndex !== -1) {
    // Replace the existing card details
    state.cardDetails[existingIndex] = newCardDetails;
  } else {
    // Add new card details to the array
    state.cardDetails.push(newCardDetails);
  }
};
export const setOrderIdReducer: CaseReducer<OrderState, PayloadAction<any>> = (
  state: OrderState,
  {payload},
) => {
  state.orderId = payload.orderId;
};

// cancel order Details
export const cancelOrderRequestReducer: CaseReducer<
  OrderState,
  PayloadAction<undefined>
> = state => {
  state.isCancelOrderLoading = true;
};

export const cancelOrderSuccessReducer: CaseReducer<
  OrderState,
  PayloadAction<any>
> = (state: OrderState, {payload}) => {
  state.isCancelOrderLoading = false;
  state.cancelOrderData = payload?.cancelOrderData;
};

export const cancelOrderFailureReducer: CaseReducer<
  OrderState,
  PayloadAction<any | Error>
> = (state, {payload}) => {
  state.isCancelOrderLoading = false;
  state.cancelOrderError = payload;
};
