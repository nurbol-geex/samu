import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  updateAddress,
} from './addressApiThunk';

export const addressInitialState: Address = {
  name: '',
  _id: '',
  city: '',
  country: '',
  geometry: {
    latitude: 0,
    longitude: 0,
  },
  primary: false,
  province: '',
  street: '',
  zip: '',
  unit: '',
  typeOfPlace: '',
  deliveryNotes: '',
};

// User initial state
const userInitialState: UserState = {
  addresses: [],
  isLoading: false,
  error: null,
  selectedAddress: addressInitialState,
  primaryAddress: addressInitialState,
};

// Address Slice
export const addressSlice = createSlice({
  name: 'addresses',
  initialState: userInitialState,
  reducers: {
    setSelectedAddress(state, action: PayloadAction<Address>) {
      state.selectedAddress = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = true;
    },
    resetAddressData(state) {
      state.addresses = [];
      state.isLoading = false;
      state.error = null;
      state.selectedAddress = addressInitialState;
    },
    // setPrimaryAddress(state, action: PayloadAction<Address>) {
    //   state.primaryAddress = action.payload;
    // },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAddresses.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
        let getPrimaryAddress = state.addresses.find(item => item.primary);
        state.primaryAddress = getPrimaryAddress || addressInitialState;
        state.selectedAddress = addressInitialState; // set empty selected address state after update he primary address
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch addresses';
      })

      .addCase(addAddress.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        action.payload && state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add address';
      })

      .addCase(deleteAddress.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.filter(
          address => address._id !== action.payload,
        );
        let getPrimaryAddress = state.addresses.find(item => item.primary);
        state.selectedAddress = getPrimaryAddress || addressInitialState;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete address';
      })

      .addCase(updateAddress.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.map(address =>
          address._id === action.payload._id ? action.payload : address,
        );
        state.selectedAddress = addressInitialState; // set empty selected address state after update he primary address
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update address';
        state.selectedAddress = addressInitialState; // set empty selected address state after update he primary address
      });
  },
});

export const {setSelectedAddress, setIsLoading, resetAddressData} =
  addressSlice.actions;
export default addressSlice.reducer;
