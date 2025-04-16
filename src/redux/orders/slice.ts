import {createSlice} from '@reduxjs/toolkit';
import {OrderInitialSate} from './initialState';
import {
  getAllPaymentMethodsRequestReducer,
  getAllPaymentMethodsSuccessReducer,
  getAllPaymentMethodsFailureReducer,
  setupPaymentChargeRequestReducer,
  setupPaymentChargeSuccessReducer,
  setupPaymentChargeFailureReducer,
  setupCheckoutRequestReducer,
  setupCheckoutSuccessReducer,
  setupCheckoutFailureReducer,
  addNewPaymentMethodRequestReducer,
  addNewPaymentMethodSuccessReducer,
  addNewPaymentMethodFailureReducer,
  setupPaymentDefaultRequestReducer,
  setupPaymentDefaultSuccessReducer,
  setupPaymentDefaultFailureReducer,
  updatePaymentMethodRequestReducer,
  updatePaymentMethodSuccessReducer,
  updatePaymentMethodFailureReducer,
  orderVerifiedRequestReducer,
  orderVerifiedSuccessReducer,
  orderVerifiedFailureReducer,
  getOrderDetailsRequestReducer,
  getOrderDetailsSuccessReducer,
  getOrderDetailsFailureReducer,
  getAllOrdersRequestReducer,
  getAllOrdersSuccessReducer,
  getAllOrdersFailureReducer,
  cancelOrderRequestReducer,
  cancelOrderSuccessReducer,
  cancelOrderFailureReducer,
  clearCheckoutReducer,
  cardDetailsReducer,
  setOrderIdReducer,
  clearOrderVerifiedReducer,
  clearAddNewCardReducer,
} from './reducers';
import {ORDER} from './constants';

export const orderSlice = createSlice({
  name: ORDER,
  initialState: OrderInitialSate,
  reducers: {
    getAllPaymentMethodsRequest: getAllPaymentMethodsRequestReducer,
    getAllPaymentMethodsSuccess: getAllPaymentMethodsSuccessReducer,
    getAllPaymentMethodsFailure: getAllPaymentMethodsFailureReducer,

    setupPaymentChargeRequest: setupPaymentChargeRequestReducer,
    setupPaymentChargeSuccess: setupPaymentChargeSuccessReducer,
    setupPaymentChargeFailure: setupPaymentChargeFailureReducer,

    setupCheckoutRequest: setupCheckoutRequestReducer,
    setupCheckoutSuccess: setupCheckoutSuccessReducer,
    setupCheckoutFailure: setupCheckoutFailureReducer,

    addNewPaymentMethodRequest: addNewPaymentMethodRequestReducer,
    addNewPaymentMethodSuccess: addNewPaymentMethodSuccessReducer,
    addNewPaymentMethodFailure: addNewPaymentMethodFailureReducer,

    setupPaymentDefaultRequest: setupPaymentDefaultRequestReducer,
    setupPaymentDefaultSuccess: setupPaymentDefaultSuccessReducer,
    setupPaymentDefaultFailure: setupPaymentDefaultFailureReducer,

    updatePaymentMethodRequest: updatePaymentMethodRequestReducer,
    updatePaymentMethodSuccess: updatePaymentMethodSuccessReducer,
    updatePaymentMethodFailure: updatePaymentMethodFailureReducer,

    orderVerifiedRequest: orderVerifiedRequestReducer,
    orderVerifiedSuccess: orderVerifiedSuccessReducer,
    orderVerifiedFailure: orderVerifiedFailureReducer,
    clearOrderVerified: clearOrderVerifiedReducer,
    clearAddNewCard: clearAddNewCardReducer,
    getOrderDetailsRequest: getOrderDetailsRequestReducer,
    getOrderDetailsSuccess: getOrderDetailsSuccessReducer,
    getOrderDetailsFailure: getOrderDetailsFailureReducer,

    getAllOrdersRequest: getAllOrdersRequestReducer,
    getAllOrdersSuccess: getAllOrdersSuccessReducer,
    getAllOrdersFailure: getAllOrdersFailureReducer,

    cancelOrderRequest: cancelOrderRequestReducer,
    cancelOrderSuccess: cancelOrderSuccessReducer,
    cancelOrderFailure: cancelOrderFailureReducer,

    clearCheckout: clearCheckoutReducer,
    cardDetails: cardDetailsReducer,
    setOrderId: setOrderIdReducer,
  },
});

export const {
  getAllPaymentMethodsRequest,
  getAllPaymentMethodsSuccess,
  getAllPaymentMethodsFailure,

  setupPaymentChargeRequest,
  setupPaymentChargeSuccess,
  setupPaymentChargeFailure,

  setupCheckoutRequest,
  setupCheckoutSuccess,
  setupCheckoutFailure,

  addNewPaymentMethodRequest,
  addNewPaymentMethodSuccess,
  addNewPaymentMethodFailure,

  setupPaymentDefaultRequest,
  setupPaymentDefaultSuccess,
  setupPaymentDefaultFailure,

  updatePaymentMethodRequest,
  updatePaymentMethodSuccess,
  updatePaymentMethodFailure,

  orderVerifiedRequest,
  orderVerifiedSuccess,
  orderVerifiedFailure,
  clearOrderVerified,

  getOrderDetailsRequest,
  getOrderDetailsSuccess,
  getOrderDetailsFailure,

  getAllOrdersRequest,
  getAllOrdersSuccess,
  getAllOrdersFailure,

  cancelOrderRequest,
  cancelOrderSuccess,
  cancelOrderFailure,
  clearAddNewCard,
  clearCheckout,
  cardDetails,
  setOrderId,
} = orderSlice.actions;
export default orderSlice.reducer;
