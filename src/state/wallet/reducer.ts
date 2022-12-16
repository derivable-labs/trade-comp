// eslint-disable-next-line no-unused-vars
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  AllowancesType,
  BalancesType,
  initialState
} from './type'
import _ from 'lodash'

export const tokens = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetBnA: (state) => {
      state.balances = {}
      state.routerAllowances = {}
      state.account = ''
    },
    updateSwapTxs: (state, action: PayloadAction<{
      account: string,
      txs: any
    }>) => {
      state.swapTxs[action.payload.account] = {
        ...action.payload.txs,
        ...state.swapTxs[action.payload.account]
      }
    },
    updateBalanceAndAllowancesReduce: (
      state,
      action: PayloadAction<{
        balances: BalancesType,
        routerAllowances: AllowancesType,
        account: string,
      }>
    ) => {
      if (action.payload.account !== state.account) {
        state.balances = action.payload.balances
        state.routerAllowances = action.payload.routerAllowances
        state.account = action.payload.account
      } else {
        state.balances = {
          ...state.balances,
          ...action.payload.balances
        }
        state.routerAllowances = {
          ...state.routerAllowances,
          ...action.payload.routerAllowances
        }
      }
    }
  }
})

// Actions
export const {
  resetBnA,
  updateBalanceAndAllowancesReduce,
  updateSwapTxs
} = tokens.actions

export default tokens.reducer
