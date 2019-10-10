import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "@appStore/reducers/environment.reduser";

export const environmentStore = createFeatureSelector<State>('environment');

export const selectEnvironment = createSelector(
    environmentStore,
    (x:State) => x 
); 

export const selEnvError = createSelector(
    environmentStore,
    (x:State) => x.error 
); 
