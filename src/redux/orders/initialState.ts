export const OrderInitialSate: OrderState = {
  // get all payments methods
  getAllPaymentMethodsData: [],
  isAllPaymentMethodsLoading: false,
  getAllPaymentMethodsError: null,

  //  setup payments charge
  paymentChargeData: {},
  isPaymentChargeLoading: false,
  paymentChargeError: null,

  //  setup checkout order
  checkoutData: {},
  isCheckoutDataLoading: false,
  checkoutDataError: null,

  //  add new payment method
  addNewPaymentMethodData: {},
  isAddNewPaymentMethodLoading: false,
  addNewPaymentMethodError: null,

  //  setup default payment
  paymentDefaultData: {},
  isPaymentDefaultLoading: false,
  paymentDefaultError: null,

  //  update payment method
  upadtePaymentMethodData: {},
  isUpadtePaymentMethodLoading: false,
  upadtePaymentMethodError: null,

  // order verified
  orderVerifiedData: {},
  isOrderVerifiedLoading: false,
  orderVerifiedError: null,

  //  get order details
  getOrderDetailsData: {},
  isGetOrderDetailsLoading: false,
  getOrderDetailsError: null,

  // get all orders
  getAllOrdersData: [],
  isGetAllOrdersLoading: false,
  getAllOrdersError: null,

  //  cancel order
  cancelOrderData: {},
  isCancelOrderLoading: false,
  cancelOrderError: null,

  // card details
  cardDetails: [],
  orderId: '',
};
