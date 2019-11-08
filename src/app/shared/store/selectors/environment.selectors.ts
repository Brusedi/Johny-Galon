import { createFeatureSelector, createSelector } from "@ngrx/store";
import { State } from "@appStore/reducers/environment.reduser";

export const AUTH_HEADER_CODE_PREFIX  = "Code";
export const AUTH_HEADER_TOKEN_PREFIX = "Bearer";

export const environmentStore = createFeatureSelector<State>('environment');

export const selectEnvironment = createSelector(
    environmentStore,
    (x:State) => x 
); 

export const selEnvError = createSelector(
    environmentStore,
    (x:State) => x.error 
); 

export const selEnvIsAuthed = createSelector(
    environmentStore,
    (x:State) => x&&x.authenticated ?  x.authenticated : false
); 

export const selEnvAuthCode = createSelector(
    environmentStore,
    (x:State) => x&&x.authenticated ?  ( x.authgData && x.authgData.authCode ? x.authgData.authCode : undefined ) : undefined 
); 

/**
 *  Select Authentificate header value
 */
export const selEnvAuthHeader = createSelector(
     environmentStore,
     (x:State) => x&&x.authenticated 
        ? ( x.authgData && x.authgData.authToken 
                ? AUTH_HEADER_TOKEN_PREFIX +" "+ x.authgData.authToken 
                : ( x.authgData && x.authgData.authCode 
                    ? AUTH_HEADER_CODE_PREFIX +" "+ x.authgData.authCode 
                    :undefined
                )  
        ) 
        : undefined 
); 
