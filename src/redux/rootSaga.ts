import {all, fork} from 'redux-saga/effects';
import {watchInit} from './app/sagas/initSaga';
import {watchSignUp} from './user/sagas/signUpSaga';
import {watchLogin} from './user/sagas/loginSaga';
import {watchPhoneConfirm} from './user/sagas/phoneConfirmSaga';
import {watchReverseGeocoding} from './user/sagas/reverseGeocodingSaga';
import {watchLogout} from './user/sagas/logoutSaga';
import {watchDeleteAccount} from './user/sagas/deleteAccountSaga';
import {watchLoginPhoneConfirm} from './user/sagas/loginPhoneConfirmSaga';
import {watchEmailLogin} from './user/sagas/emailLoginSaga';
import {watchGetCollections} from './category/sagas/getAllCollectionsSaga';
import {watchGetHomeSections} from './home/sagas/getHomeSectionsSaga';
import {watchGetExploreSections} from './home/sagas/getExploreSectionsSaga';
import {watchGetProductSearchSections} from './home/sagas/getProductSearchSaga';
import {watchGetProductSearchByStoreIdSections} from './home/sagas/getProductSearchByStoreIdSaga';
import {watchGetStoreDetailsSections} from './home/sagas/getStoreDetailsSaga';
import {watchGetStoreMenuSections} from './home/sagas/getStoreMenuSaga';
import {watchGetStoreProductSections} from './home/sagas/getStoreProductSaga';
import {watchGetStoreProductDetailsSections} from './home/sagas/getStorePoroductDetailsSaga';
import {watchAddToCartSection} from './cart/sagas/productAddToCartSaga';
import {watchGetCartSections} from './cart/sagas/productGetCartSaga';
import {watchSaveLocalCartSection} from './cart/sagas/saveLocalCartSaga';
import {watchClearLocalCartSection} from './cart/sagas/clearLocalCartSaga';
import {watchUpdateCartSection} from './cart/sagas/productUpdateCartSaga';
import {watchAllPaymentMethodsSections} from './orders/sagas/getAllPaymentMethodsSaga';
import {watchInitiatePaymentSections} from './orders/sagas/getInitiatePaymentSaga';
import {watchPaymentChargeSections} from './orders/sagas/setupPaymentChargeSaga';
import {watchCheckoutSections} from './orders/sagas/setupCheckoutSaga';
import {watchSearchStoresSections} from './home/sagas/searchStoresSaga';
import {watchAddNewPaymentMethodSections} from './orders/sagas/addNewPaymentMethodSaga';
import {watchPaymentDefaultSections} from './orders/sagas/setupPaymentDefaultSaga';
import {watchUpdatePaymentMethodSections} from './orders/sagas/updatePaymentMethodSaga';
import {watchCheckOrderPaidSections} from './orders/sagas/checkOrderPaidSaga';
import {watchClearCartSections} from './cart/sagas/productClearCartSaga';
import {watchPaymentCalculateSections} from './orders/sagas/paymentCalculatedSaga';
import {watchGetOrderDetailsSections} from './orders/sagas/getOrderDetailsSaga';
import {watchCardDetailsSection} from './orders/sagas/cardDetailsSaga';
import {watchAllOrdersSections} from './orders/sagas/getAllOrdersSaga';
import {watchUpdateCartAddressSections} from './cart/sagas/updateCartAddress';
import {watchCancelOrderSections} from './orders/sagas/cancelOrderSaga';
import { watchUserProductGridSections } from './home/sagas/getUserProductGridSaga';
import { watchSocial } from './user/sagas/socialAuthSaga';
import { watchAnalytics } from './user/sagas/analyticsSaga';
import { watchHelpDesk } from './user/sagas/helpDeskSaga';
import { watchUpdateProfile } from './user/sagas/updateProfileSaga';
import watchGuestLogin from './user/sagas/guestLoginSaga';

   





export function* rootSaga() {
  yield all([
    fork(watchGuestLogin),
    fork(watchAnalytics),
    fork(watchSocial),
    fork(watchHelpDesk),
    fork(watchUpdateProfile),
    fork(watchInit),
    fork(watchSignUp),
    fork(watchLogin),
    fork(watchEmailLogin),
    fork(watchPhoneConfirm),
    fork(watchLoginPhoneConfirm),
    fork(watchReverseGeocoding),
    fork(watchLogout),
    fork(watchDeleteAccount),
    fork(watchGetCollections),
    fork(watchGetHomeSections),
    fork(watchUserProductGridSections),
    fork(watchGetExploreSections),
    fork(watchGetProductSearchSections),
    fork(watchGetProductSearchByStoreIdSections),
    fork(watchGetStoreDetailsSections),
    fork(watchGetStoreMenuSections),
    fork(watchGetStoreProductSections),
    fork(watchGetStoreProductDetailsSections),
    fork(watchAddToCartSection),
    fork(watchGetCartSections),
    fork(watchSaveLocalCartSection),
    fork(watchClearLocalCartSection),
    fork(watchUpdateCartSection),
    fork(watchAllPaymentMethodsSections),
    fork(watchInitiatePaymentSections),
    fork(watchPaymentChargeSections),
    fork(watchCheckoutSections),
    fork(watchSearchStoresSections),
    fork(watchAddNewPaymentMethodSections),
    fork(watchPaymentDefaultSections),
    fork(watchUpdatePaymentMethodSections),
    fork(watchCheckOrderPaidSections),
    fork(watchClearCartSections),
    fork(watchPaymentCalculateSections),
    fork(watchGetOrderDetailsSections),
    fork(watchCancelOrderSections),
    fork(watchCardDetailsSection),
    fork(watchAllOrdersSections),
    fork(watchUpdateCartAddressSections),
  ]);
}
