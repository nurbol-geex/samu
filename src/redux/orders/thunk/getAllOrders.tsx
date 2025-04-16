import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import { showToast } from 'src/components/shared/CustomToast/toastUtils';
import {RootState} from 'src/redux';
import {getBaseUrlFromStorage} from 'src/utils/SetENV';

// Initial state
const initialState: OrdersState = {
  ordersData: {orders: [], totalCount: 0},
  completedOrdersData: {orders: [], totalCount: 0},
  cancelledOrdersData: {orders: [], totalCount: 0},
  loading: false,
  error: null,
};

// Thunk for fetching orders by status
export const fetchOrdersByActive = createAsyncThunk<
  FetchOrdersResponse,
  FetchOrdersParams,
  {state: RootState}
>(
  'orders/fetchOrdersByActive',
  async ({page, pageSize, status, sortBy}, {getState, rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${getBaseUrlFromStorage()}/user/order?page=${page}&pageSize=${pageSize}&status=${status}&sortBy=${sortBy}`,
        {
          headers: {
            Authorization: `Bearer ${getState().user.accessToken}`,
          },
        },
      );

      return {
        orders: response.data.orders,
        totalCount: response.data.total,
      };
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || e.message || 'Unknown error';
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchOrdersByCompleted = createAsyncThunk<
  FetchOrdersResponse,
  FetchOrdersParams,
  {state: RootState}
>(
  'orders/fetchOrdersByCompleted',
  async ({page, pageSize, status, sortBy}, {getState, rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${getBaseUrlFromStorage()}/user/order?page=${page}&pageSize=${pageSize}&status=${status}&sortBy=${sortBy}`,
        {
          headers: {
            Authorization: `Bearer ${getState().user.accessToken}`,
          },
        },
      );

      return {
        orders: response.data.orders,
        totalCount: response.data.total,
      };
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || e.message || 'Unknown error';
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchOrdersByCancelled = createAsyncThunk<
  FetchOrdersResponse,
  FetchOrdersParams,
  {state: RootState}
>(
  'orders/fetchOrdersByCancelled',
  async ({page, pageSize, status, sortBy}, {getState, rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${getBaseUrlFromStorage()}/user/order?page=${page}&pageSize=${pageSize}&status=${status}&sortBy=${sortBy}`,
        {
          headers: {
            Authorization: `Bearer ${getState().user.accessToken}`,
          },
        },
      );

      return {
        orders: response.data.orders,
        totalCount: response.data.total,
      };
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.message || e.message || 'Unknown error';
      return rejectWithValue(errorMessage);
    }
  },
);

export const postAllOrderReview = createAsyncThunk<
  ReviewAllOrderResponse,
  ReviewAllOrderParams,
  {state: RootState}
>('orders/postAllOrderReview', async (data, {getState, rejectWithValue}) => {
  try {
    const response = await axios.post(
      `${getBaseUrlFromStorage()}/user/review`,
      data,
      {
        headers: {
          Authorization: `Bearer ${getState().user.accessToken}`,
        },
      },
    );
    showToast('success', 'Review submitted');

    return {message: response.data.message};
  } catch (e: any) {
    const errorMessage =
      e.response?.data?.message || e.message || 'Unknown error';
    console.log('errorMessage: ', errorMessage);
    return rejectWithValue(errorMessage);
  }
});

// Slice
export const getAllOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetActiveReducer: state => {
      state.ordersData = {orders: [], totalCount: 0};
      state.loading = false;
      state.error = null;
    },
    resetCompletedReducer: state => {
      state.completedOrdersData = {orders: [], totalCount: 0};
      state.loading = false;
      state.error = null;
    },
    resetCancelledReducer: state => {
      state.cancelledOrdersData = {orders: [], totalCount: 0};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrdersByActive.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrdersByActive.fulfilled,
        (state, action: PayloadAction<FetchOrdersResponse>) => {
          const {orders, totalCount} = action.payload;
          state.loading = false;
          state.ordersData.orders = [...state.ordersData.orders, ...orders];
          state.ordersData.totalCount = totalCount;
        },
      )
      .addCase(fetchOrdersByActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrdersByCompleted.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrdersByCompleted.fulfilled,
        (state, action: PayloadAction<FetchOrdersResponse>) => {
          const {orders, totalCount} = action.payload;
          state.loading = false;
          state.completedOrdersData.orders = [
            ...state.completedOrdersData.orders,
            ...orders,
          ];
          state.completedOrdersData.totalCount = totalCount;
        },
      )
      .addCase(fetchOrdersByCompleted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrdersByCancelled.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrdersByCancelled.fulfilled,
        (state, action: PayloadAction<FetchOrdersResponse>) => {
          const {orders, totalCount} = action.payload;
          state.loading = false;
          state.cancelledOrdersData.orders = [
            ...state.cancelledOrdersData.orders,
            ...orders,
          ];
          state.cancelledOrdersData.totalCount = totalCount;
        },
      )
      .addCase(fetchOrdersByCancelled.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  resetActiveReducer,
  resetCompletedReducer,
  resetCancelledReducer,
} = getAllOrdersSlice.actions;
export default getAllOrdersSlice.reducer;
