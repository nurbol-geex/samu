import {
  call,
  CallEffect,
  put,
  PutEffect,
  SelectEffect,
  takeLatest,
} from 'redux-saga/effects';
import {ANALYTICS} from '../constants';
import {getError} from 'src/utils';
import {
  pageOpened,
  searchPlaced,
  searchResult,
  storePageView,
  viewProduct,
  addToCart,
  cartPage,
  beginAddingPaymentMethod,
  paymentMethodAdded,
  tipSet,
  checkoutStarted,
  checkoutFailed,
  checkoutCompleted,
} from 'src/api/analyticsAPI';
import {
  analyticsFailure,
  analyticsSuccess,
  deleteAccountFailure,
  deleteAccountSuccess,
  resetUser,
} from '../slice';

// Define the expected payloads for each analytics event
interface AnalyticsPayload {
  eventType: string;
  data: Record<string, any>;
}

function* analytics(action: {
  payload: AnalyticsPayload;
}): Generator<SelectEffect | PutEffect | CallEffect<any>, void, any> {
  try {
    const {eventType, data} = action.payload; // Destructure eventType and data from the payload

    let response;

    // Call the appropriate API with the passed data
    switch (eventType) {
      case 'pageOpened':
        response = yield call(
          pageOpened,
          data.pageName,
          data.userId,
          data.sessionId,
        );
        break;

      case 'searchPlaced':
        response = yield call(
          searchPlaced,
          data.searchQuery,
          data.userId,
          data.sessionId,
        );
        break;

      case 'searchResult':
        response = yield call(
          searchResult,
          data.query,
          data.userId,
          data.sessionId,
          data.itemsShown,
          data.selectedItem,
        );
        break;

      case 'storePageView':
        response = yield call(
          storePageView,
          data.storeId,
          data.userId,
          data.sessionId,
        );
        break;

      case 'viewProduct':
        response = yield call(
          viewProduct,
          data.productId,
          data.userId,
          data.sessionId,
        );
        break;

      case 'addToCart':
        response = yield call(
          addToCart,
          data.productId,
          data.quantity,
          data.userId,
          data.sessionId,
        );
        break;

      case 'cartPage':
        response = yield call(
          cartPage,
          data.cartId,
          data.userId,
          data.sessionId,
        );
        break;

      case 'beginAddingPaymentMethod':
        response = yield call(
          beginAddingPaymentMethod,
          data.userId,
          data.sessionId,
        );
        break;

      case 'paymentMethodAdded':
        response = yield call(
          paymentMethodAdded,
          data.sessionId,
          data.userId,
          data.paymentMethodId,
        );
        break;

      case 'tipSet':
        response = yield call(
          tipSet,
          data.tipAmount,
          data.userId,
          data.sessionId,
        );
        break;

      case 'checkoutStarted':
        response = yield call(
          checkoutStarted,
          data.cartTotal,
          data.items,
          data.userId,
          data.sessionId,
        );
        break;

      case 'checkoutFailed':
        response = yield call(
          checkoutFailed,
          data.reason,
          data.userId,
          data.sessionId,
        );
        break;

      case 'checkoutCompleted':
        response = yield call(
          checkoutCompleted,
          data.orderId,
          data.total,
          data.userId,
          data.sessionId,
        );
        break;

      default:
        throw new Error(`Unsupported eventType: ${eventType}`);
    }

    const json = yield response.json();

    if (response.status >= 200 && response.status < 300) {
      yield put(analyticsSuccess({message: json.message}));
      return;
    }

    yield put(analyticsFailure({message: json.message}));
    getError(json);
  } catch (error) {
    yield put(analyticsFailure(error));
    getError(error);
  }
}

export function* watchAnalytics() {
  yield takeLatest(ANALYTICS, analytics);
}
