import type {RootState} from '../index';

export const selectUser = (state: RootState) => state.user;

export const selectUserUser = (state: RootState) => state.user.user;

export const selectUserUserAddresses = (state: RootState) =>
  state.user.user.addresses;

export const selectUserAddressById = (state: RootState, addressId: string) =>
  state.user.user.addresses.find(({_id}) => _id === addressId);

export const selectCreateAccountForm = (state: RootState) => ({
  firstName: state.user.firstName,
  lastName: state.user.lastName,
  dateOfBirth: state.user.dateOfBirth,
  gender: state.user.gender,
  email: state.user.email,
  phone: state.user.phone,
  password: state.user.password,
  confirmationPassword: state.user.confirmationPassword,
  signupType: state.user.signupType,
  authorizationCode: state.user.authorizationCode,
});

export const selectCreateAddressForm = (state: RootState) =>
  state.user.addressForm;

export const selectUpdateDone = (state: RootState) => state.user.updateDone;

export const selectDeleteDone = (state: RootState) => state.user.deleteDone;

export const selectAccessToken = (state: RootState) => state.user.accessToken;
export const selectRefeshToken = (state: RootState) => state.user.refreshToken;
export const setIsGuest = (state: RootState) => state.user.isGuest;

export const setLat = (state: RootState) => state.user.lat;
export const setLng = (state: RootState) => state.user.lng;


export const selectUserIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export const selectAuthenticationType = (state: RootState) =>
  state.user.authenticationType;

export const selectUserIsOnboard = (state: RootState) =>
  state.settings.isOnBoard;

export const selectVerifiedPhone = (state: RootState) =>
  state.user.verifiedPhone;

export const selectUserIsLoading = (state: RootState) => state.user.isLoading;

export const selectUserError = (state: RootState) => state.user.error;

// update profile
export const selectUpdateProfile = (state: RootState) =>
  state.user.updateProfileData;

export const selectUpdateProfileIsLoading = (state: RootState) =>
  state.user.isUpdateProfileLoading;

export const selecUpdateProfileError = (state: RootState) =>
  state.user.updateProfileError;

export const selectHelpIsLoading = (state: RootState) =>
  state.user.isSelectHelpIsLoading;

//submit issue
// export const selectSubmitIssue = (state: RootState) =>
//   state.user.updateProfileData;

export const selectSubmitIssueIsLoading = (state: RootState) =>
  state.user.isSubmitIssue;

// export const selecSubmitIssueError = (state: RootState) =>
//   state.user.updateProfileError;
