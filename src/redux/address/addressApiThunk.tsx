import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {APIRoutes} from 'src/api/APIRoutes';
import store from '..';
import * as RootNavigation from '../../routes/RootNavigation';
import {showToast} from 'src/components/shared/CustomToast/toastUtils';
import {setCreateAddressForm} from '../user/slice';
import {getBaseUrlFromStorage} from 'src/utils/SetENV';

export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get(`${APIRoutes.User.Address()}`, {
        headers: {
          Authorization: `Bearer ${store.getState().user.accessToken}`,
        },
      });

      return response.data.addresses;
    } catch (error: any) {
      // Use rejectWithValue to return a rejected action payload
      return rejectWithValue(
        error?.response?.data || 'Failed to fetch addresses',
      );
    }
  },
);

export const addAddress = createAsyncThunk(
  'addresses/addAddress',
  async (
    {newAddress, routeFrom, setError}: any,
    {rejectWithValue, dispatch},
  ) => {
    // if (newAddress?.geometry === '') {
    //   setError('Address is not verified');
    //   showToast('error', 'Address is not verified');
    //   return false;
    // } else {
    try {
      const response = await axios.post(
        `${APIRoutes.User.Address()}`,
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${store.getState().user.accessToken}`,
          },
        },
      );

      setError('');
      dispatch(
        setCreateAddressForm({
          street: '',
          unit: '',
          city: '',
          province: '',
          zip: '',
          country: '',
          geometry: '',
          typeOfPlace: '',
          deliveryNotes: '',
        }),
      );
      dispatch(fetchAddresses());
      if (routeFrom === 'goBack') {
        RootNavigation.goBack();
      } else {
        RootNavigation.reset({
          index: 1,
          routes: [
            {
              name: 'tab',
            },
          ],
        });
      }
      return response.data.address;
    } catch (error: any) {
      // Use rejectWithValue to return a rejected action payload
      return rejectWithValue(error?.response?.data || 'Failed to add address');
    }
  },
  // },
);

export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (_id: string, {rejectWithValue, dispatch}) => {
    try {
      await axios.delete(`${getBaseUrlFromStorage()}/user/address/${_id}`, {
        headers: {
          Authorization: `Bearer ${store.getState().user.accessToken}`,
        },
      });

      dispatch(fetchAddresses());
      RootNavigation.goBack();
      // showToast('success', 'Address is successfully deleted');
      return _id;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || 'Failed to delete address',
      );
    }
  },
);

export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async (
    {
      updatedAddress,
      routeFrom,
    }: {
      updatedAddress: Partial<Address>;
      routeFrom: string;
    },
    {rejectWithValue, dispatch},
  ) => {
    try {
      const response = await axios.put(
        `${getBaseUrlFromStorage()}/user/address/${updatedAddress._id}`,
        updatedAddress,
        {
          headers: {
            Authorization: `Bearer ${store.getState().user.accessToken}`,
          },
        },
      );

      dispatch(fetchAddresses());

      if (routeFrom === 'AccountAddress') {
        RootNavigation.goBack();
      }
      return response.data;
    } catch (error: any) {
      console.error('Error updating address:', error);
      return rejectWithValue(
        error.response?.data || 'Failed to update address',
      );
    }
  },
);
