import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RouterReducerState } from "@ngrx/router-store";
import { RouterStateUrl } from "@appStore/router";

// Reducer selectors
export const selectReducerState = createFeatureSelector< RouterReducerState<RouterStateUrl> >("router");
 
export const getRouterInfo = createSelector(
  selectReducerState,
  state => state.state
);

export const getQueryParams = createSelector(
  selectReducerState,
  state => state.state&&state.state.queryParams?state.state.queryParams:undefined
);