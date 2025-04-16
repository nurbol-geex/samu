import type {CaseReducer, PayloadAction} from '@reduxjs/toolkit';
import {addressInitialState, userInitialState, UserState} from './initialState';

export const setUserReducer: CaseReducer<
  UserState,
  PayloadAction<Partial<UserState>>
> = (state: UserState, {payload}) => ({
  ...state,
  ...payload,
});

export const setCreateAccountFormReducer: CaseReducer<
  UserState,
  PayloadAction<Partial<SignUpRequestBody>>
> = (state: UserState, {payload}) => ({
  ...state,
  ...payload,
});

export const resetUserReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = () => ({...userInitialState});

export const resetCreateAccountFormReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => ({
  ...state,
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  phone: '',
  password: '',
  confirmationPassword: '',
});

export const signUpRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
};

export const signUpSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = state => {
  state.isLoading = false;
};

export const signUpFailureReducer: CaseReducer<
  UserState,
  PayloadAction<SignUpError | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};

export const loginRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
};
export const setGuestLoginReducer: CaseReducer<
  UserState,
  PayloadAction<{ isGuest: boolean; lat: number; lng: number }>
  > = (state, { payload }) => {
  state.isGuest = payload.isGuest;
  state.lat = payload.lat;
  state.lng = payload.lng;
};

export const loginSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<LoginWithEmailResponseBody>
> = (state, {payload}) => {
  state.isLoading = false;
  state.isLoggedIn = true;
  state.accessToken = payload.accessToken;
  state.refreshToken = payload.refreshToken;
  // state.isGuest = payload.isGuest;
};

export const loginFailureReducer: CaseReducer<
  UserState,
  PayloadAction<LoginWithEmailErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};
export const socialAuthRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
};
export const socialAuthRSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<LoginWithEmailResponseBody>
> = (state, {payload}) => {
  state.isLoading = false;
  state.isLoggedIn = true;
  state.accessToken = payload.accessToken;
  // state.isGuest = payload.isGuest;
};
export const socialAuthRFailureReducer: CaseReducer<
  UserState,
  PayloadAction<LoginWithEmailErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};
export const phoneConfirmRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
};

export const phoneConfirmSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<PhoneConfirmResponseBody & Pick<SignUpRequestBody, 'phone'>>
> = (state, {payload}) => {
  state.isLoading = false;
  state.isLoggedIn = true;
  state.accessToken = payload.accessToken;
  state.user = payload.user;
  state.verifiedPhone = payload.phone;
};

export const phoneConfirmFailureReducer: CaseReducer<
  UserState,
  PayloadAction<PhoneConfirmErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};

export const setCreateAddressFormReducer: CaseReducer<
  UserState,
  PayloadAction<Partial<Address>>
> = (state: UserState, {payload}) => {
  state.isLoading = true;
  state.addressForm = {...state.addressForm, ...payload};
};

export const resetCreateAddressFormReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.addressForm = {...addressInitialState};
};

export const setUserAddressReducer: CaseReducer<
  UserState,
  PayloadAction<Partial<Address>>
> = (state: UserState, {payload}) => {
  state.user.addresses = [
    ...state.user.addresses.map(
      address =>
        address._id === payload._id ? {...address, ...payload} : address,
      (state.isLoading = true),
    ),
  ];
};

export const deleteUserAddressReducer: CaseReducer<
  UserState,
  PayloadAction<Pick<Address, '_id'>>
> = (state: UserState, {payload}) => {
  state.user.addresses = [
    ...state.user.addresses.filter(address => address._id !== payload._id),
  ];
};

export const reverseGeocodingRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
};

export const reverseGeocodingSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<ReverseGeocodingResult>
> = (state, {payload}) => {
  const addressComponents = payload?.address_components;
  const provinceComponent = addressComponents?.find((component: any) =>
    component.types.includes('administrative_area_level_1'),
  );
  const cityComponent = addressComponents?.find((component: any) =>
    component.types.includes('locality'),
  );
  const postalCodeComponent = addressComponents?.find((component: any) =>
    component.types.includes('postal_code'),
  );
  const countryComponent = addressComponents?.find((component: any) =>
    component.types.includes('country'),
  );

  const province = provinceComponent?.long_name ?? '';
  const city = cityComponent?.long_name ?? '';
  const zip = postalCodeComponent?.long_name ?? '';
  const country = countryComponent?.long_name ?? '';
  const geometry = `${payload?.geometry?.location?.lat}, ${payload?.geometry?.location?.lng}`;

  const address = {
    street: payload?.formatted_address,
    unit: '',
    province,
    city,
    zip,
    country,
    geometry,
  };
  return {
    ...state,
    user: {
      ...state.user,
      addresses: [{...state.user.addresses[0], ...address}],
    },
    addressForm: address,
    isLoading: false,
  };
};

export const reverseGeocodingFailureReducer: CaseReducer<
  UserState,
  PayloadAction<PhoneConfirmErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};

export const createAddressRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
};

export const createAddressSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = state => {
  state.isLoading = false;
};

export const createAddressFailureReducer: CaseReducer<
  UserState,
  PayloadAction<CreateAddressErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};

export const updateAddressRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
  state.updateDone = false;
};

export const updateAddressSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = state => {
  state.isLoading = false;
  state.updateDone = true;
};

export const updateAddressFailureReducer: CaseReducer<
  UserState,
  PayloadAction<UpdateAddressErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
  state.updateDone = false;
};

export const deleteAddressRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
  state.deleteDone = false;
};

export const deleteAddressSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = state => {
  state.isLoading = false;
  state.deleteDone = true;
};

export const deleteAddressFailureReducer: CaseReducer<
  UserState,
  PayloadAction<DeleteAddressErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
  state.deleteDone = false;
};

export const deleteAccountRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
};

export const deleteAccountSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = state => {
  state.isLoading = false;
};

export const deleteAccountFailureReducer: CaseReducer<
  UserState,
  PayloadAction<DeleteAccountErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};

export const getAddressRequestReducer: CaseReducer<
  UserState,
  PayloadAction<GetAddressErrorBody | Error>
> = state => {
  state.isLoading = true;
};

export const getAddressSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<GetAddressResponseBody>
> = (state: UserState, {payload}) => {
  state.user.addresses = [...payload.addresses];
};

export const getAddressFailureReducer: CaseReducer<
  UserState,
  PayloadAction<GetAddressErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};

export const getAnalyticsRequestReducer: CaseReducer<
  UserState,
  PayloadAction<GetAddressErrorBody | Error>
> = state => {
  state.isLoading = true;
};

export const getAnalyticsSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<GetAddressResponseBody>
> = (state: UserState, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};

export const getAnalyticsFailureReducer: CaseReducer<
  UserState,
  PayloadAction<GetAddressErrorBody | Error>
> = (state, {payload}) => {
  state.isLoading = false;
  state.error = payload;
};
export const updateProfileRequestReducer: CaseReducer<
  UserState,
  PayloadAction<undefined>
> = (state: UserState) => {
  state.isUpdateProfileLoading = true;
};

export const updateProfileSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<any>
> = (state: UserState, {payload}) => {
  state.isUpdateProfileLoading = false;
  state.updateProfileData = payload.updateProfileData;
};

export const updateProfileFailureReducer: CaseReducer<
  UserState,
  PayloadAction<any | Error>
> = (state: UserState, {payload}) => {
  state.isUpdateProfileLoading = false;
  state.updateProfileError = payload;
};
//

export const getHelpDeskRequestReducer: CaseReducer<
  UserState,
  PayloadAction<GetAddressErrorBody | Error>
> = state => {
  state.isSelectHelpIsLoading = true;
};

export const getHelpDeskSuccessReducer: CaseReducer<
  UserState,
  PayloadAction<GetAddressResponseBody>
> = (state: UserState, {payload}) => {
  state.isSelectHelpIsLoading = false;
  state.user.help = [...payload.help];
};

export const getHelpDeskFailureReducer: CaseReducer<
  UserState,
  PayloadAction<GetAddressErrorBody | Error>
> = (state, {payload}) => {
  state.isSelectHelpIsLoading = false;
  state.error = payload;
};
