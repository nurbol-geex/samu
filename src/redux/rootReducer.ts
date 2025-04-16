import {combineSlices} from '@reduxjs/toolkit';
import {appSlice} from './app/slice';
import {userSlice} from './user/slice';
import {categorySlice} from './category/slice';
import {homeSlice} from './home/slice';
import {settingsSlice} from './settings/slice';
import {cartSlice} from './cart/slice';
import {orderSlice} from './orders/slice';
import {addressSlice} from './address/slice';
import {getAllOrdersSlice} from './orders/thunk/getAllOrders';
import { LOGOUT } from './user/constants';

const appReducer = combineSlices(
  homeSlice,
  appSlice,
  userSlice,
  categorySlice,
  settingsSlice,
  cartSlice,
  orderSlice,
  getAllOrdersSlice,
  addressSlice,
);

// Create the root reducer
export const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    // Reset the state to undefined to clear all reducers
    state = undefined;
  }
  return appReducer(state, action);
};
